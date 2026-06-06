'use client'

/**
 * WebGL-based ink splash transition effect.
 * Faithfully reproduces the official splatoon.nintendo.com implementation
 * using fragment shaders with simplex noise (Ashima Arts) for organic ink edges.
 *
 * Uses raw WebGL1 — no external dependencies (official uses OGL library).
 */

import * as React from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface InkSplashCanvasProps {
  /** Animation state */
  state: 'in' | 'out' | 'idle'
  /** Duration for opening animation (ms) */
  durationIn?: number
  /** Duration for closing animation (ms) */
  durationOut?: number
  /** Ink color (hex) */
  color?: string
  /** Seed for noise variation (increment each open) */
  count?: number
  /** Start position in NDC coordinates [-0.5..0.5]. If not provided, defaults to [0,0] (center). */
  startPosition?: [number, number]
  /** Called when animation completes */
  onComplete?: () => void
  /** Additional CSS class */
  className?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// GLSL Shaders (faithfully ported from official splatoon.nintendo.com)
// ─────────────────────────────────────────────────────────────────────────────

const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

// Fragment shader: simplex noise + 3-layer ink splash rendering
// Ported verbatim from official site's chunk 732 (module 7732)
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

  varying vec2 v_uv;

  vec2 getScreenSpace() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    return uv;
  }

  float circle(vec2 _uv, float _radius, vec2 _pos){
    vec2 mx = u_resolution.xy / min(u_resolution.y, u_resolution.x);
    float dist = length(_uv - mx * _pos) - max(mx.x, mx.y) * _radius;
    // Original: smoothstep(0.4*u_progress, -0.4, dist) — inverted edges are undefined on ANGLE/Windows.
    // Equivalent: 1.0 - smoothstep(-0.4, 0.4*u_progress, dist)
    return (1.0 - smoothstep(-0.4, 0.4 * u_progress, dist)) + smoothstep(0.9, 1.0, u_progress);
  }

  float swipe(vec2 _uv, float _progress) {
    vec2 mx = u_resolution.xy / min(u_resolution.y, u_resolution.x);
    float e0 = _uv.y + (0.5 - 0.1 * (1.0 - _progress)) / mx.y;
    float e1 = _uv.y + (0.5 + 0.5 * (1.0 - _progress)) / mx.y;
    // When progress → 1.0, e0 ≈ e1 → undefined smoothstep on ANGLE.
    // Enforce minimum gap so smoothstep always returns 1.0 for x >> e1.
    e1 = max(e1, e0 + 0.001);
    return smoothstep(e0, e1, _progress) * (0.8 + 0.2 * smoothstep(0.0, 0.5, _progress));
  }

  void main () {
    vec2 uv = getScreenSpace();
    vec2 pos = mix(u_start, vec2(0.0, 0.0), u_progress);

    float c = u_animatingOut ? swipe(uv, 1.0 * u_progress) : circle(uv, 0.8 * u_progress, pos);
    float c2 = u_animatingOut ? swipe(uv, (1.0 + (0.1 * smoothstep(u_progress, 1.0, 0.9))) * u_progress) : circle(uv, 0.9 * u_progress, pos);
    float c3 = u_animatingOut ? 0.0 : circle(uv, 0.95 * u_progress, pos);

    vec4 baseColor = vec4(0.0);
    float noiseSize = u_animatingOut ? u_noiseSize * 2.0 : u_noiseSize;

    vec2 noisePos = vec2(uv.x, uv.y + u_noiseY);

    vec4 shadow = vec4(vec3(0.0), step((snoise((noisePos.xy + u_seed) * noiseSize) + 1.0) / 2.0, c3) * 0.25);
    vec4 altColor = vec4(u_color * 1.2, step((snoise((noisePos.xy + u_seed) * noiseSize) + 1.0) / 2.0, c2));
    vec4 topColor = vec4(u_color, step((snoise((noisePos.xy + u_seed) * noiseSize) + 1.0) / 2.0, c));

    vec4 layers = mix(altColor, topColor, topColor.a);
    layers = mix(shadow, layers, layers.a);
    gl_FragColor = mix(baseColor, layers, layers.a);
  }
`

// ─────────────────────────────────────────────────────────────────────────────
// WebGL Helpers
// ─────────────────────────────────────────────────────────────────────────────

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }

  return program
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16) / 255
  const g = parseInt(h.substring(2, 4), 16) / 255
  const b = parseInt(h.substring(4, 6), 16) / 255
  return [r, g, b]
}

// ─────────────────────────────────────────────────────────────────────────────
// Default start positions (cycle through corners like official site)
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_START: [number, number] = [0, 0]

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function InkSplashCanvas({
  state,
  durationIn = 700,
  durationOut = 1000,
  color = '#000000',
  count = 0,
  startPosition,
  onComplete,
  className,
}: InkSplashCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const glRef = React.useRef<WebGLRenderingContext | null>(null)
  const programRef = React.useRef<WebGLProgram | null>(null)
  const uniformsRef = React.useRef<Record<string, WebGLUniformLocation | null>>({})
  const animationRef = React.useRef<number>(0)
  const startTimeRef = React.useRef(0)
  const stateRef = React.useRef(state)
  const onCompleteRef = React.useRef(onComplete)
  const colorRef = React.useRef(color)
  const countRef = React.useRef(count)
  const startPosRef = React.useRef(startPosition)
  const validRef = React.useRef(false)

  // Keep refs in sync
  stateRef.current = state
  onCompleteRef.current = onComplete
  colorRef.current = color
  countRef.current = count
  startPosRef.current = startPosition

  // ─────────────────────────────────────────────────────────────
  // Initialize WebGL + ResizeObserver (single effect to avoid race)
  // ─────────────────────────────────────────────────────────────

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', {
      premultipliedAlpha: true,
      alpha: true,
    })
    if (!gl) {
      console.error('WebGL not supported')
      return
    }

    glRef.current = gl

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    if (!vertexShader || !fragmentShader) return

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) return

    programRef.current = program

    // Create fullscreen quad
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const positionLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    // Get uniform locations
    const uniformNames = [
      'u_resolution', 'u_color', 'u_progress', 'u_noiseSize',
      'u_noiseY', 'u_seed', 'u_start', 'u_animatingOut',
    ]
    uniformNames.forEach((name) => {
      uniformsRef.current[name] = gl.getUniformLocation(program, name)
    })

    // Activate program before setting uniforms (required by WebGL spec)
    gl.useProgram(program)

    // Set initial noise size — official forces dpr:1 in OGL renderer,
    // so noiseSize = 1 + 0.2*(1-1) = 1.0 always.
    // We hardcode 1.0 to match exactly.
    gl.uniform1f(uniformsRef.current.u_noiseSize, 1.0)
    validRef.current = true

    // The canvas fills the entire viewport (position:fixed inset-0 parent).
    // Use window dimensions directly — ResizeObserver is unreliable for
    // portal-mounted elements that start at 0 dimensions.
    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }
    resize()
    window.addEventListener('resize', resize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize)
      validRef.current = false
      programRef.current = null
      uniformsRef.current = {}
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      gl.deleteProgram(program)
      gl.deleteBuffer(buffer)
    }
  }, [])

  // ─────────────────────────────────────────────────────────────
  // Draw a single frame
  // ─────────────────────────────────────────────────────────────

  const drawFrame = React.useCallback((gl: WebGLRenderingContext, progress: number) => {
    if (!validRef.current) return
    const program = programRef.current
    const canvas = canvasRef.current
    if (!program || !canvas) return

    gl.useProgram(program)

    const uniforms = uniformsRef.current
    gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height)

    const [r, g, b] = hexToRgb(colorRef.current)
    gl.uniform3f(uniforms.u_color, r, g, b)

    gl.uniform1f(uniforms.u_progress, progress)
    gl.uniform1f(uniforms.u_seed, countRef.current)
    gl.uniform1f(uniforms.u_noiseSize, 1.0)

    // Start position: use prop or default to center
    const startPos = startPosRef.current ?? DEFAULT_START
    gl.uniform2f(uniforms.u_start, startPos[0], startPos[1])

    // Animating out flag
    const isAnimatingOut = stateRef.current === 'out'
    gl.uniform1i(uniforms.u_animatingOut, isAnimatingOut ? 1 : 0)

    // Noise Y: during closing, animate noise offset (official: 1000 - 1000*progress)
    const noiseY = isAnimatingOut ? 1000 - 1000 * progress : 0
    gl.uniform1f(uniforms.u_noiseY, noiseY)

    // Enable blending
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // Clear and draw
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }, [])

  // ─────────────────────────────────────────────────────────────
  // Animation loop
  // ─────────────────────────────────────────────────────────────

  React.useEffect(() => {
    if (state === 'idle') {
      const gl = glRef.current
      if (gl) {
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
      }
      return
    }

    startTimeRef.current = performance.now()

    // Official animation behavior:
    // Opening (in):  progress 0.1 → 1.0, linear easing, real duration = 1.2 * durationIn
    // Closing (out): progress 1.0 → 0.0, t² easing,  real duration = durationOut
    const isOpening = state === 'in'
    const duration = isOpening ? 1.2 * durationIn : durationOut
    const startVal = isOpening ? 0.1 : 1.0
    const endVal = isOpening ? 1.0 : 0.0

    const animate = () => {
      const gl = glRef.current
      if (!gl) return

      const elapsed = performance.now() - startTimeRef.current
      const rawT = Math.min(elapsed / duration, 1)
      // Opening uses linear, closing uses t² easing
      const easedT = isOpening ? rawT : rawT * rawT
      const progress = startVal + (endVal - startVal) * easedT

      if (rawT >= 1) {
        drawFrame(gl, endVal)
        onCompleteRef.current?.()
        return
      }

      drawFrame(gl, progress)
      animationRef.current = requestAnimationFrame(animate)
    }

    // Draw initial frame
    drawFrame(glRef.current!, startVal)
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [state, durationIn, durationOut, drawFrame])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}
