/* ──────────────────────────────────────────────
   Ink Splash Canvas — GLSL Shader Sources
   Ink splash shader program used by Splatoon UI transitions.
   ────────────────────────────────────────────── */

type GLContext = WebGLRenderingContext | WebGL2RenderingContext

function isWebGl2Context(gl: GLContext): gl is WebGL2RenderingContext {
  return typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext
}

// ── Vertex Shader (WebGL 1) ──────────────────────────────────────────────────

const vertexShaderSource = `
attribute vec3 position;
attribute vec2 uv;
varying vec2 v_uv;
void main() {
  gl_Position = vec4(position, 1.0);
  v_uv = uv;
}
`

// ── Fragment Shader ──────────────────────────────────────────────────────────
// Simplex noise + 3-layer ink splash rendering
// Simplex noise helpers adapted for the transition shader.

const fragmentShaderSource = `

  precision highp float;

  //
  // Description : Array and textureless GLSL 2D simplex noise function.
  //      Author : Ian McEwan, Ashima Arts.
  //  Maintainer : ijm
  //     Lastmod : 20110822 (ijm)
  //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
  //               Distributed under the MIT License. See LICENSE file.
  //               https://github.com/ashima/webgl-noise
  //

  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
  }

  float snoise(vec2 v)
    {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                      -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
  // First corner
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);

  // Other corners
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

  // Permutations
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;

  // Gradients: 41 points uniformly over a line, mapped onto a diamond.
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  uniform vec3 u_color;
  uniform float u_progress;
  uniform float u_noiseSize;
  uniform float u_noiseY;
  uniform float u_seed;
  uniform vec2 u_resolution;
  uniform vec2 u_start;
  uniform bool u_animatingOut;
  uniform sampler2D u_background;
  uniform bool u_background_ready;

  varying vec2 v_uv;

  vec2 getScreenSpace() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    return uv;
  }

  float circle(vec2 _uv, float _radius, vec2 _pos){
    vec2 mx = u_resolution.xy / min(u_resolution.y, u_resolution.x);
    float dist = length(_uv - mx * _pos) - max(mx.x, mx.y) * _radius;

    return smoothstep( 0.4 * u_progress, -0.4, dist) + (1.0 * smoothstep( 0.9, 1.0, u_progress));
  }

  float swipe(vec2 _uv, float _progress) {
    vec2 mx = u_resolution.xy / min(u_resolution.y, u_resolution.x);

    return smoothstep(_uv.y + (0.5 - 0.1 * (1.0 -_progress) ) / mx.y, _uv.y + (0.5 + 0.5 * (1.0 - _progress)) / mx.y, _progress) * (0.8 + 0.2 * smoothstep(0.0, 0.5, _progress));
  }

  void main () {
    vec2 uv = getScreenSpace();
    vec2 pos = mix(u_start, vec2(0.0, 0.0), u_progress);

    float c = u_animatingOut ? swipe(uv, 1. * u_progress) : circle(uv, .8 * u_progress, pos);
    float c2 = u_animatingOut ? swipe(uv, (1. + (0.1 * smoothstep(u_progress, 1.0, 0.9))) * u_progress) : circle(uv, .9 * u_progress, pos);
    float c3 = u_animatingOut ? 0.0 : circle(uv, 0.95 * u_progress, pos);

    vec4 baseColor = vec4(0.0);
    float noiseSize = u_animatingOut ? u_noiseSize * 2.0 : u_noiseSize;

    vec2 noisePos = vec2(uv.x, uv.y + u_noiseY);

    vec4 color = u_background_ready ? texture2D(u_background, u_animatingOut ? vec2(uv.x, uv.y + (((snoise(uv.xy + u_seed) * 1. + 1.0) * 0.5) * (1.0 - u_progress))) : uv) : vec4(u_color, 1.0);

    vec4 shadow = vec4(vec3(0.0), step((snoise((noisePos.xy + u_seed ) * noiseSize) + 1.0) / 2.0, c3) * 0.25);
    vec4 altColor = vec4(u_color * (u_background_ready ? 1.0 : 1.2), step((snoise((noisePos.xy + u_seed ) * (noiseSize * (u_animatingOut ? 1. : 1.))) + 1.0) / 2.0, c2));
    vec4 topColor = vec4(color.rgb, step((snoise((noisePos.xy + u_seed) * (noiseSize * (u_animatingOut ? 1. : 1.))) + 1.0) / 2.0, c));

    vec4 layers = mix(altColor, topColor, topColor.a);
    layers = mix(shadow, layers, layers.a);
    gl_FragColor = mix(baseColor, layers, layers.a);
  }
`

// ── Public API ───────────────────────────────────────────────────────────────

export function getVertexShaderSource(gl: GLContext): string {
  if (!isWebGl2Context(gl)) {
    return vertexShaderSource
  }

  return `#version 300 es
in vec3 position;
in vec2 uv;
out vec2 v_uv;
void main() {
  gl_Position = vec4(position, 1.0);
  v_uv = uv;
}
`
}

export function getFragmentShaderSource(gl: GLContext): string {
  if (!isWebGl2Context(gl)) {
    return fragmentShaderSource
  }

  return `#version 300 es
${fragmentShaderSource
  .replace('varying vec2 v_uv;', 'in vec2 v_uv;\nout vec4 outColor;')
  .replace(/texture2D/g, 'texture')
  .replace(/gl_FragColor/g, 'outColor')}`
}
