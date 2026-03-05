/**
 * C API wrapper for msdfgen WASM.
 *
 * Exposes a minimal extern "C" interface so that Emscripten can export
 * each function to JavaScript.  The caller (TypeScript) works with
 * opaque pointers and plain numeric types.
 *
 * Memory contract:
 *   - Pixel buffers returned by msdfgen_generate() are heap-allocated;
 *     the caller MUST free them via msdfgen_freePixels().
 *   - Shape objects returned by msdfgen_loadGlyph() are heap-allocated;
 *     the caller MUST free them via msdfgen_destroyGlyph().
 *   - FreetypeHandle / FontHandle follow the same new/destroy pattern.
 */

#include <cstdlib>
#include <cstring>
#include <cmath>
#include <algorithm>
#include <emscripten.h>

#include "msdfgen/msdfgen.h"
#include "msdfgen/msdfgen-ext.h"

using namespace msdfgen;

// ============================================================================
// Helpers
// ============================================================================

static inline uint8_t clampByte(float v) {
    if (v != v) return 0;  // NaN guard
    int i = static_cast<int>(v * 255.0f + 0.5f);
    return static_cast<uint8_t>(i < 0 ? 0 : (i > 255 ? 255 : i));
}

// ============================================================================
// Exported C API
// ============================================================================

extern "C" {

// --- Initialization ---------------------------------------------------------

EMSCRIPTEN_KEEPALIVE
void* msdfgen_init() {
    return static_cast<void*>(initializeFreetype());
}

EMSCRIPTEN_KEEPALIVE
void msdfgen_deinit(void* ftHandle) {
    if (ftHandle)
        deinitializeFreetype(static_cast<FreetypeHandle*>(ftHandle));
}

// --- Font management --------------------------------------------------------

EMSCRIPTEN_KEEPALIVE
void* msdfgen_loadFontData(void* ftHandle, const uint8_t* data, int length) {
    if (!ftHandle || !data || length <= 0) return nullptr;
    return static_cast<void*>(
        loadFontData(static_cast<FreetypeHandle*>(ftHandle),
                     static_cast<const byte*>(data), length));
}

EMSCRIPTEN_KEEPALIVE
void msdfgen_destroyFont(void* fontHandle) {
    if (fontHandle)
        destroyFont(static_cast<FontHandle*>(fontHandle));
}

// --- Font metrics -----------------------------------------------------------

/**
 * Write 6 doubles into outMetrics:
 *   [0] emSize, [1] ascenderY, [2] descenderY,
 *   [3] lineHeight, [4] underlineY, [5] underlineThickness
 * Returns 1 on success, 0 on failure.
 */
EMSCRIPTEN_KEEPALIVE
int msdfgen_getFontMetrics(void* fontHandle, double* outMetrics) {
    if (!fontHandle || !outMetrics) return 0;
    FontMetrics m;
    if (!getFontMetrics(m, static_cast<FontHandle*>(fontHandle),
                        FONT_SCALING_EM_NORMALIZED))
        return 0;
    outMetrics[0] = m.emSize;
    outMetrics[1] = m.ascenderY;
    outMetrics[2] = m.descenderY;
    outMetrics[3] = m.lineHeight;
    outMetrics[4] = m.underlineY;
    outMetrics[5] = m.underlineThickness;
    return 1;
}

// --- Glyph loading ----------------------------------------------------------

/**
 * Load glyph shape for a Unicode code point.
 *
 * outAdvance: receives the advance width (em-normalized).
 * outBounds:  receives [left, bottom, right, top] (em-normalized).
 *
 * Returns an opaque Shape* pointer, or nullptr on failure.
 * The caller MUST call msdfgen_destroyGlyph() to free it.
 */
EMSCRIPTEN_KEEPALIVE
void* msdfgen_loadGlyph(void* fontHandle, unsigned int unicode,
                         double* outAdvance, double* outBounds) {
    if (!fontHandle) return nullptr;

    Shape* shape = new (std::nothrow) Shape();
    if (!shape) return nullptr;

    double advance = 0;
    if (!loadGlyph(*shape, static_cast<FontHandle*>(fontHandle),
                   static_cast<unicode_t>(unicode),
                   FONT_SCALING_EM_NORMALIZED, &advance)) {
        delete shape;
        return nullptr;
    }

    if (outAdvance) *outAdvance = advance;

    // Normalize contour orientation before getBounds (matches msdf-atlas-gen order:
    // GlyphGeometry.cpp:21-22 — normalize may split single-edge contours,
    // which can change the bounds slightly)
    shape->normalize();

    if (outBounds) {
        Shape::Bounds bounds = shape->getBounds();
        outBounds[0] = bounds.l;
        outBounds[1] = bounds.b;
        outBounds[2] = bounds.r;
        outBounds[3] = bounds.t;
    }

    return static_cast<void*>(shape);
}

EMSCRIPTEN_KEEPALIVE
void msdfgen_destroyGlyph(void* shapePtr) {
    if (shapePtr)
        delete static_cast<Shape*>(shapePtr);
}

// --- MSDF generation --------------------------------------------------------

/**
 * Generate a distance field for a previously loaded glyph shape.
 *
 * @param shapePtr          Opaque Shape* from msdfgen_loadGlyph()
 * @param type              0=SDF, 1=PSDF, 2=MSDF, 3=MTSDF
 * @param width, height     Output bitmap dimensions in pixels
 * @param rangeValue        Distance range in em-normalized units
 * @param scaleX, scaleY    Projection scale (em → pixels)
 * @param translateX, translateY  Projection translation
 * @param angleThreshold    Edge coloring angle threshold (radians, e.g. 3.0)
 * @param coloringStrategy  0=simple, 1=inktrap, 2=distance
 * @param seed              Edge coloring seed
 * @param overlapSupport    1=use overlap contour combiner, 0=legacy
 * @param errorCorrectionMode  0=disabled, 1=indiscriminate, 2=edge-priority, 3=edge-only
 * @param scanlinePass      1=apply scanline sign correction, 0=skip
 * @param fillRule          0=nonzero, 1=even-odd, 2=positive, 3=negative
 *
 * Returns a pointer to width*height*4 uint8_t RGBA pixel data,
 * or nullptr on failure.
 * The caller MUST call msdfgen_freePixels() to free the buffer.
 */
EMSCRIPTEN_KEEPALIVE
uint8_t* msdfgen_generate(
    void* shapePtr,
    int type,
    int width, int height,
    double rangeValue,
    double scaleX, double scaleY,
    double translateX, double translateY,
    double angleThreshold,
    int coloringStrategy,
    unsigned int seed,
    int overlapSupport,
    int errorCorrectionMode,
    int scanlinePass,
    int fillRule
) {
    if (!shapePtr || width <= 0 || height <= 0) return nullptr;

    // Reject unreasonably large dimensions to prevent integer overflow
    // in pixelCount calculation (width * height * 4 must fit in size_t safely).
    if (width > 8192 || height > 8192) return nullptr;

    // Copy shape to avoid mutating the cached version
    // (edge coloring modifies the shape in-place)
    Shape shape = *static_cast<Shape*>(shapePtr);

    switch (coloringStrategy) {
        case 1:
            edgeColoringInkTrap(shape, angleThreshold,
                                static_cast<unsigned long long>(seed));
            break;
        case 2:
            edgeColoringByDistance(shape, angleThreshold,
                                  static_cast<unsigned long long>(seed));
            break;
        default:
            edgeColoringSimple(shape, angleThreshold,
                               static_cast<unsigned long long>(seed));
            break;
    }

    // Build projection and range
    Projection projection(Vector2(scaleX, scaleY),
                          Vector2(translateX, translateY));
    Range range(-rangeValue, rangeValue);
    SDFTransformation transformation(projection, range);

    // Error correction config
    ErrorCorrectionConfig::Mode ecMode;
    switch (errorCorrectionMode) {
        case 0: ecMode = ErrorCorrectionConfig::DISABLED; break;
        case 1: ecMode = ErrorCorrectionConfig::INDISCRIMINATE; break;
        case 3: ecMode = ErrorCorrectionConfig::EDGE_ONLY; break;
        default: ecMode = ErrorCorrectionConfig::EDGE_PRIORITY; break;
    }
    ErrorCorrectionConfig ecConfig(ecMode);
    MSDFGeneratorConfig msdfConfig(overlapSupport != 0, ecConfig);
    GeneratorConfig sdfConfig(overlapSupport != 0);

    // Fill rule for scanline correction
    FillRule fr;
    switch (fillRule) {
        case 1: fr = FILL_ODD; break;
        case 2: fr = FILL_POSITIVE; break;
        case 3: fr = FILL_NEGATIVE; break;
        default: fr = FILL_NONZERO; break;
    }

    // Allocate output RGBA buffer (use size_t to prevent overflow)
    size_t pixelCount = static_cast<size_t>(width) * static_cast<size_t>(height);
    uint8_t* rgba = static_cast<uint8_t*>(std::malloc(pixelCount * 4));
    if (!rgba) return nullptr;

    if (type == 2) {
        // MSDF — 3-channel
        Bitmap<float, 3> msdf(width, height);
        generateMSDF(msdf, shape, transformation, msdfConfig);

        if (scanlinePass) {
            distanceSignCorrection(msdf, shape, projection, fr);
        }

        // Convert float3 → RGBA uint8
        for (int y = 0; y < height; ++y) {
            for (int x = 0; x < width; ++x) {
                // msdfgen uses bottom-up; output top-down for web canvas
                const float* px = msdf(x, height - 1 - y);
                int idx = (y * width + x) * 4;
                rgba[idx + 0] = clampByte(px[0]);
                rgba[idx + 1] = clampByte(px[1]);
                rgba[idx + 2] = clampByte(px[2]);
                rgba[idx + 3] = 255;
            }
        }
    } else if (type == 3) {
        // MTSDF — 4-channel
        Bitmap<float, 4> mtsdf(width, height);
        generateMTSDF(mtsdf, shape, transformation, msdfConfig);

        if (scanlinePass) {
            distanceSignCorrection(mtsdf, shape, projection, fr);
        }

        for (int y = 0; y < height; ++y) {
            for (int x = 0; x < width; ++x) {
                const float* px = mtsdf(x, height - 1 - y);
                int idx = (y * width + x) * 4;
                rgba[idx + 0] = clampByte(px[0]);
                rgba[idx + 1] = clampByte(px[1]);
                rgba[idx + 2] = clampByte(px[2]);
                rgba[idx + 3] = clampByte(px[3]);
            }
        }
    } else if (type == 1) {
        // PSDF — pseudo-distance, 1-channel
        Bitmap<float, 1> psdf(width, height);
        generatePSDF(psdf, shape, transformation, sdfConfig);

        if (scanlinePass) {
            distanceSignCorrection(psdf, shape, projection, fr);
        }

        for (int y = 0; y < height; ++y) {
            for (int x = 0; x < width; ++x) {
                const float* px = psdf(x, height - 1 - y);
                uint8_t v = clampByte(px[0]);
                int idx = (y * width + x) * 4;
                rgba[idx + 0] = v;
                rgba[idx + 1] = v;
                rgba[idx + 2] = v;
                rgba[idx + 3] = 255;
            }
        }
    } else {
        // SDF — true distance, 1-channel
        Bitmap<float, 1> sdf(width, height);
        generateSDF(sdf, shape, transformation, sdfConfig);

        if (scanlinePass) {
            distanceSignCorrection(sdf, shape, projection, fr);
        }

        for (int y = 0; y < height; ++y) {
            for (int x = 0; x < width; ++x) {
                const float* px = sdf(x, height - 1 - y);
                uint8_t v = clampByte(px[0]);
                int idx = (y * width + x) * 4;
                rgba[idx + 0] = v;
                rgba[idx + 1] = v;
                rgba[idx + 2] = v;
                rgba[idx + 3] = 255;
            }
        }
    }

    return rgba;
}

EMSCRIPTEN_KEEPALIVE
void msdfgen_freePixels(uint8_t* pixels) {
    std::free(pixels);
}

} // extern "C"
