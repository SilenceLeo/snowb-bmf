#!/bin/bash
# Build msdfgen WASM module.
#
# Prerequisites:
#   - Emscripten SDK activated (source ~/emsdk/emsdk_env.sh)
#   - msdfgen and freetype source directories alongside this script
#
# Output:
#   ../public/wasm/msdfgen.js   (ES module loader)
#   ../public/wasm/msdfgen.wasm (WebAssembly binary)

set -euo pipefail
cd "$(dirname "$0")"

SCRIPT_DIR="$(pwd)"
BUILD_DIR="${SCRIPT_DIR}/build"
OUTPUT_DIR="${SCRIPT_DIR}/../public/wasm"

FREETYPE_SRC="${SCRIPT_DIR}/freetype"
MSDFGEN_SRC="${SCRIPT_DIR}/msdfgen"

echo "=== Building msdfgen WASM ==="
echo "Build dir:   ${BUILD_DIR}"
echo "Output dir:  ${OUTPUT_DIR}"

mkdir -p "${BUILD_DIR}" "${OUTPUT_DIR}"

# ============================================================================
# Step 1: Build FreeType as static library
# ============================================================================
echo ""
echo "--- Step 1: Building FreeType ---"

FREETYPE_BUILD="${BUILD_DIR}/freetype"
mkdir -p "${FREETYPE_BUILD}"

emcmake cmake -S "${FREETYPE_SRC}" -B "${FREETYPE_BUILD}" \
  -DCMAKE_BUILD_TYPE=Release \
  -DBUILD_SHARED_LIBS=OFF \
  -DFT_DISABLE_BZIP2=ON \
  -DFT_DISABLE_BROTLI=ON \
  -DFT_DISABLE_HARFBUZZ=ON \
  -DFT_DISABLE_PNG=ON \
  -DFT_DISABLE_ZLIB=ON \
  2>&1 | tail -5

NPROC=$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)
emmake make -C "${FREETYPE_BUILD}" -j"${NPROC}" 2>&1 | tail -5

FREETYPE_LIB="${FREETYPE_BUILD}/libfreetype.a"
if [ ! -f "${FREETYPE_LIB}" ]; then
  echo "ERROR: FreeType build failed — ${FREETYPE_LIB} not found"
  exit 1
fi
echo "FreeType built: ${FREETYPE_LIB}"

# ============================================================================
# Step 2: Build msdfgen core + ext as static libraries
# ============================================================================
echo ""
echo "--- Step 2: Building msdfgen ---"

MSDFGEN_BUILD="${BUILD_DIR}/msdfgen"
mkdir -p "${MSDFGEN_BUILD}"

emcmake cmake -S "${MSDFGEN_SRC}" -B "${MSDFGEN_BUILD}" \
  -DCMAKE_BUILD_TYPE=Release \
  -DBUILD_SHARED_LIBS=OFF \
  -DMSDFGEN_BUILD_STANDALONE=OFF \
  -DMSDFGEN_USE_SKIA=OFF \
  -DMSDFGEN_DISABLE_SVG=ON \
  -DMSDFGEN_DISABLE_PNG=ON \
  -DMSDFGEN_INSTALL=OFF \
  -DFREETYPE_INCLUDE_DIRS="${FREETYPE_SRC}/include" \
  -DFREETYPE_LIBRARY="${FREETYPE_LIB}" \
  2>&1 | tail -5

emmake make -C "${MSDFGEN_BUILD}" -j"${NPROC}" 2>&1 | tail -5

MSDFGEN_CORE_LIB="${MSDFGEN_BUILD}/libmsdfgen-core.a"
MSDFGEN_EXT_LIB="${MSDFGEN_BUILD}/libmsdfgen-ext.a"

if [ ! -f "${MSDFGEN_CORE_LIB}" ]; then
  echo "ERROR: msdfgen-core build failed"
  exit 1
fi
if [ ! -f "${MSDFGEN_EXT_LIB}" ]; then
  echo "ERROR: msdfgen-ext build failed"
  exit 1
fi
echo "msdfgen built: ${MSDFGEN_CORE_LIB}, ${MSDFGEN_EXT_LIB}"

# ============================================================================
# Step 3: Compile wrapper and link everything into WASM
# ============================================================================
echo ""
echo "--- Step 3: Compiling WASM module ---"

EXPORTED_FUNCTIONS="[\
'_msdfgen_init',\
'_msdfgen_deinit',\
'_msdfgen_loadFontData',\
'_msdfgen_destroyFont',\
'_msdfgen_getFontMetrics',\
'_msdfgen_loadGlyph',\
'_msdfgen_destroyGlyph',\
'_msdfgen_generate',\
'_msdfgen_freePixels',\
'_malloc',\
'_free'\
]"

emcc "${SCRIPT_DIR}/msdfgen_c.cpp" \
  -I "${MSDFGEN_SRC}" \
  -I "${FREETYPE_SRC}/include" \
  -DMSDFGEN_PUBLIC= \
  -DMSDFGEN_EXT_PUBLIC= \
  -DMSDFGEN_USE_CPP11 \
  "${MSDFGEN_EXT_LIB}" \
  "${MSDFGEN_CORE_LIB}" \
  "${FREETYPE_LIB}" \
  -O2 \
  -std=c++17 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME="MsdfgenModule" \
  -s EXPORT_ES6=1 \
  -s ENVIRONMENT=web \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s FILESYSTEM=0 \
  -s INVOKE_RUN=0 \
  -s EXPORTED_FUNCTIONS="${EXPORTED_FUNCTIONS}" \
  -s EXPORTED_RUNTIME_METHODS="['HEAPU8','HEAPF64']" \
  -o "${OUTPUT_DIR}/msdfgen.js"

if [ ! -f "${OUTPUT_DIR}/msdfgen.wasm" ]; then
  echo "ERROR: WASM compilation failed"
  exit 1
fi

WASM_SIZE=$(wc -c < "${OUTPUT_DIR}/msdfgen.wasm" | tr -d ' ')
JS_SIZE=$(wc -c < "${OUTPUT_DIR}/msdfgen.js" | tr -d ' ')
echo ""
echo "=== Build complete ==="
echo "  ${OUTPUT_DIR}/msdfgen.js   (${JS_SIZE} bytes)"
echo "  ${OUTPUT_DIR}/msdfgen.wasm (${WASM_SIZE} bytes)"
