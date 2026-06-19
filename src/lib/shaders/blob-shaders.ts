/**
 * Blob play button shaders for the Splatoon UI demo.
 * chunk 566 (SimplexBlobRenderer).
 *
 * Uses a fullscreen triangle plus fragment shader noise alpha mask.
 * No vertex deformation — all wobble is in the fragment shader.
 */

// Fragment shader: simplex noise + circle = organic blob shape
// The vertex shader is the standard OGL fullscreen triangle (handled by WTCGL).
export const blobFragmentShader = `
precision highp float;

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License.
//
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x_) - 0.5;
  vec3 ox = floor(x_ + 0.5);
  vec3 a0 = x_ - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

uniform vec2 u_resolution;
uniform vec3 u_color;
uniform float i_time;
uniform float u_noiseSize;
uniform float u_seed;
uniform float u_progress;
uniform float u_idleSpeed;

varying vec2 v_uv;

vec2 getScreenSpace() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.xy;
  return uv;
}

float circle(vec2 _uv, float _radius, vec2 _pos) {
  float dist = length(_uv * _pos) / _radius;
  return smoothstep(0.15, 0.25, dist);
}

void main() {
  vec2 uv = getScreenSpace();

  float n = (snoise((uv.xy + u_seed + (i_time * 3.0) * u_idleSpeed) * u_noiseSize) + 1.0) / 2.0;
  float c = circle(uv, 1.0 * u_progress, vec2(0.5));
  float alpha = smoothstep(n, n + 0.01, 1.0 - c);

  gl_FragColor = vec4(u_color, 1.0) * alpha;
}
`

// Standard fullscreen-triangle vertex shader (OGL convention)
export const blobVertexShader = `
attribute vec3 position;
attribute vec2 uv;
varying vec2 v_uv;
void main() {
  gl_Position = vec4(position, 1.0);
  v_uv = uv;
}
`
