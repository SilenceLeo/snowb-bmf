/**
 * GLSL shader sources for SDF/MSDF preview rendering.
 *
 * Vertex shader: unit quad [0,1] → clip space [-1,1], UV via u_uvRect uniform.
 * SDF fragment shader: single-channel distance field (sdf/psdf modes).
 * MSDF fragment shader: multi-channel distance field (msdf/mtsdf modes).
 *
 * Both fragment shaders use the msdfgen canonical screenPxRange formula
 * for screen-space anti-aliasing: UV derivatives × distanceRange → screen
 * pixel distance, then clamp to [0,1]. Requires u_distanceRange and
 * u_textureSize uniforms.
 * Requires OES_standard_derivatives extension (WebGL 1).
 */

export const VERTEX_SHADER = `
precision highp float;
attribute vec2 a_position;
uniform vec4 u_uvRect;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
  v_texCoord = mix(u_uvRect.xy, u_uvRect.zw, a_position);
}
`

/**
 * SDF fragment shader for sdf/psdf modes.
 *
 * Channel modes (u_channelMode):
 *   0 = rgb:       distance in R channel (R=G=B), A=255
 *   1 = rgb-inv:   inverted distance in R channel, A=255
 *   2 = alpha:     distance in A channel, RGB=255
 *   3 = alpha-inv: distance in A channel, RGB=0
 */
export const SDF_FRAGMENT_SHADER = `
#extension GL_OES_standard_derivatives : enable
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 v_texCoord;
uniform sampler2D u_texture;
uniform int u_channelMode;
uniform vec3 u_color;
uniform float u_distanceRange;
uniform vec2 u_textureSize;

void main() {
  vec4 texel = texture2D(u_texture, v_texCoord);
  float dist;

  if (u_channelMode == 0) {
    dist = texel.r;
  } else if (u_channelMode == 1) {
    dist = 1.0 - texel.r;
  } else if (u_channelMode == 2) {
    dist = texel.a;
  } else {
    dist = 1.0 - texel.a;
  }

  // msdfgen canonical screenPxRange: UV derivatives convert texels-per-pixel,
  // multiplied by distanceRange to get screen-pixel distance from edge.
  vec2 unitRange = vec2(u_distanceRange) / u_textureSize;
  vec2 screenTexSize = vec2(1.0) / fwidth(v_texCoord);
  float screenPxRange = max(0.5 * dot(unitRange, screenTexSize), 1.0);
  float screenPxDist = screenPxRange * (dist - 0.5);
  float alpha = clamp(screenPxDist + 0.5, 0.0, 1.0);
  gl_FragColor = vec4(u_color * alpha, alpha);
}
`

/**
 * MSDF fragment shader for msdf/mtsdf modes.
 *
 * Uses Chlumsky's standard median formula for multi-channel distance fields.
 * For mtsdf, alpha channel also carries distance data and is combined
 * with the RGB median via min().
 */
export const MSDF_FRAGMENT_SHADER = `
#extension GL_OES_standard_derivatives : enable
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 v_texCoord;
uniform sampler2D u_texture;
uniform bool u_isMtsdf;
uniform vec3 u_color;
uniform float u_distanceRange;
uniform vec2 u_textureSize;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main() {
  vec4 texel = texture2D(u_texture, v_texCoord);
  float sd = median(texel.r, texel.g, texel.b);

  if (u_isMtsdf) {
    sd = min(sd, texel.a);
  }

  vec2 unitRange = vec2(max(u_distanceRange, 1.0)) / u_textureSize;
  vec2 screenTexSize = vec2(1.0) / fwidth(v_texCoord);
  float screenPxRange = max(0.5 * dot(unitRange, screenTexSize), 1.0);
  float screenPxDist = screenPxRange * (sd - 0.5);
  float alpha = clamp(screenPxDist + 0.5, 0.0, 1.0);
  gl_FragColor = vec4(u_color, alpha);
}
`
