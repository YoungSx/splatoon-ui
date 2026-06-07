'use client'

/**
 * WebGL-based ink splash transition effect.
 * Faithfully reproduces the official splatoon.nintendo.com implementation
 * using fragment shaders with simplex noise (Ashima Arts) for organic ink edges.
 *
 * Uses raw WebGL with WebGL2-first fallback — no external dependencies
 * (official uses OGL library on top of WebGL).
 */

import * as React from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type GLContext = WebGLRenderingContext | WebGL2RenderingContext

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
  /**
   * Optional texture supported by the official splat-transition shader.
   * The official navigation overlay leaves this unset so the ink stays flat black.
   */
  background?: string
  /** Called when animation completes */
  onComplete?: () => void
  /** Additional CSS class */
  className?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// GLSL Shaders (faithfully ported from official splatoon.nintendo.com)
// ─────────────────────────────────────────────────────────────────────────────

const vertexShaderSource = `
attribute vec3 position;
attribute vec2 uv;
varying vec2 v_uv;
void main() {
  gl_Position = vec4(position, 1.0);
  v_uv = uv;
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

function isWebGl2Context(gl: GLContext): gl is WebGL2RenderingContext {
  return typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext
}

function getVertexShaderSource(gl: GLContext): string {
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

function getFragmentShaderSource(gl: GLContext): string {
  if (!isWebGl2Context(gl)) {
    return fragmentShaderSource
  }

  return `#version 300 es
${fragmentShaderSource
  .replace('varying vec2 v_uv;', 'in vec2 v_uv;\nout vec4 outColor;')
  .replace(/texture2D/g, 'texture')
  .replace(/gl_FragColor/g, 'outColor')}`
}

// ─────────────────────────────────────────────────────────────────────────────
// WebGL Helpers
// ─────────────────────────────────────────────────────────────────────────────

function createShader(gl: GLContext, type: number, source: string): WebGLShader | null {
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
  gl: GLContext,
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

const OFFICIAL_START_POSITIONS: [number, number][] = [
  [-0.5, 0.5],
  [0.5, 0.5],
  [0.5, -0.5],
  [-0.5, -0.5],
]

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
  background,
  onComplete,
  className,
}: InkSplashCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const glRef = React.useRef<GLContext | null>(null)
  const programRef = React.useRef<WebGLProgram | null>(null)
  const uniformsRef = React.useRef<Record<string, WebGLUniformLocation | null>>({})
  const renderLoopRef = React.useRef<number>(0)
  const tweenRef = React.useRef<number>(0)
  const progressRef = React.useRef(0)
  const stateRef = React.useRef(state)
  const onCompleteRef = React.useRef(onComplete)
  const colorRef = React.useRef(color)
  const countRef = React.useRef(count)
  const startPosRef = React.useRef(startPosition)
  const transitionSeedRef = React.useRef(count)
  const transitionStartRef = React.useRef<[number, number]>(
    startPosition ?? OFFICIAL_START_POSITIONS[count % OFFICIAL_START_POSITIONS.length]
  )

  const bgReadyRef = React.useRef(false)
  const validRef = React.useRef(false)
  const noiseYRef = React.useRef(0)

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
    const container = containerRef.current
    if (!canvas || !container) return

    const contextAttributes = {
      alpha: true,
      depth: true,
      stencil: false,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: 'default',
    } as const

    const webgl2 = canvas.getContext('webgl2', contextAttributes) as WebGL2RenderingContext | null
    const webgl1 = canvas.getContext('webgl', contextAttributes) as WebGLRenderingContext | null
    const gl: GLContext | null = webgl2 ?? webgl1
    if (!gl) {
      console.error('WebGL not supported')
      return
    }

    glRef.current = gl

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, getVertexShaderSource(gl))
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, getFragmentShaderSource(gl))
    if (!vertexShader || !fragmentShader) return

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) return

    programRef.current = program

    // Official OGL helper uses a single oversized fullscreen triangle.
    const positions = new Float32Array([-1, -1, 3, -1, -1, 3])
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    const positionLoc = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    const uvs = new Float32Array([0, 0, 2, 0, 0, 2])
    const uvBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW)

    const uvLoc = gl.getAttribLocation(program, 'uv')
    gl.enableVertexAttribArray(uvLoc)
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0)

    // Get uniform locations
    const uniformNames = [
      'u_resolution', 'u_color', 'u_progress', 'u_noiseSize',
      'u_noiseY', 'u_seed', 'u_start', 'u_animatingOut',
      'u_background', 'u_background_ready',
    ]
    uniformNames.forEach((name) => {
      uniformsRef.current[name] = gl.getUniformLocation(program, name)
    })

    // Activate program before setting uniforms (required by WebGL spec)
    gl.useProgram(program)

    // Set initial values EXACTLY like official code
    progressRef.current = 0
    gl.uniform1f(uniformsRef.current.u_progress, 0)
    
    gl.uniform1f(uniformsRef.current.u_noiseSize, 1.0)
    gl.uniform1i(uniformsRef.current.u_animatingOut, 0)
    gl.uniform1f(uniformsRef.current.u_noiseY, 0)

    // Set u_background_ready to false initially
    gl.uniform1i(uniformsRef.current.u_background_ready, 0)
    bgReadyRef.current = false

    validRef.current = true

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const w = Math.round(rect.width)
      const h = Math.round(rect.height)
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
      cancelAnimationFrame(renderLoopRef.current)
      cancelAnimationFrame(tweenRef.current)
      window.removeEventListener('resize', resize)
      validRef.current = false
      programRef.current = null
      uniformsRef.current = {}
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      gl.deleteProgram(program)
      gl.deleteBuffer(positionBuffer)
      gl.deleteBuffer(uvBuffer)
    }
  }, [count])

  // ─────────────────────────────────────────────────────────────
  // Background texture loading (async, watches `background` prop)
  // Matches official: creates GL texture, loads image, sets ready flag
  // ─────────────────────────────────────────────────────────────

  React.useEffect(() => {
    const gl = glRef.current
    if (!gl || !background) {
      bgReadyRef.current = false
      if (gl && uniformsRef.current.u_background_ready) {
        gl.uniform1i(uniformsRef.current.u_background_ready, 0)
      }
      return
    }

    const bgTexture = gl.createTexture()
    if (!bgTexture) return

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, bgTexture)
    // Placeholder 1x1 pixel while image loads
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 255]))
    gl.uniform1i(uniformsRef.current.u_background, 0)

    let cancelled = false
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (cancelled || !validRef.current) return
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, bgTexture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.uniform1i(uniformsRef.current.u_background_ready, 1)
      bgReadyRef.current = true
    }
    img.src = background

    return () => {
      cancelled = true
      gl.deleteTexture(bgTexture)
      bgReadyRef.current = false
    }
  }, [background, count])

  // ─────────────────────────────────────────────────────────────
  // Draw a single frame
  // ─────────────────────────────────────────────────────────────

  const drawFrame = React.useCallback((gl: GLContext, progress: number) => {
    if (!validRef.current) return
    const program = programRef.current
    const canvas = canvasRef.current
    if (!program || !canvas) return

    gl.useProgram(program)

    const uniforms = uniformsRef.current
    gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height)

    const [r, g, b] = colorRef.current ? hexToRgb(colorRef.current) : [1, 0, 0]
    gl.uniform3f(uniforms.u_color, r, g, b)

    gl.uniform1f(uniforms.u_progress, progress)
    gl.uniform1f(uniforms.u_seed, transitionSeedRef.current)
    gl.uniform1f(uniforms.u_noiseSize, 1.0)

    const startPos = transitionStartRef.current
    gl.uniform2f(uniforms.u_start, startPos[0], startPos[1])

    // Noise Y is updated by tween, matching official `u_noiseY.value` behavior.
    gl.uniform1f(uniforms.u_noiseY, noiseYRef.current)

    // Match the OGL program state used by the official transition.
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.cullFace(gl.BACK)
    gl.frontFace(gl.CCW)
    gl.depthMask(true)
    gl.depthFunc(gl.LESS)
    gl.disable(gl.BLEND)

    // OGL autoClear clears both color and depth every frame before rendering.
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }, [])

  // Official wrapper keeps a continuous render loop alive while the canvas is mounted.
  // Tweens only mutate uniforms; rendering happens independently every frame.
  React.useEffect(() => {
    if (!validRef.current) return

    const render = () => {
      const gl = glRef.current
      if (gl && validRef.current) {
        drawFrame(gl, progressRef.current)
        renderLoopRef.current = requestAnimationFrame(render)
      }
    }

    renderLoopRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(renderLoopRef.current)
    }
  }, [count, drawFrame])

  // ─────────────────────────────────────────────────────────────
  // Progress tween
  // ─────────────────────────────────────────────────────────────

    React.useEffect(() => {
    cancelAnimationFrame(tweenRef.current)

    if (state === 'idle') {
      progressRef.current = 0
      noiseYRef.current = 0
      const gl = glRef.current
      const uniform = uniformsRef.current.u_animatingOut
      if (gl && uniform) {
        gl.useProgram(programRef.current)
        gl.uniform1i(uniform, 0)
      }
      return
    }

    // Official animation behavior:
    // Opening (in):  progress 0.1 → 1.0, linear easing, real duration = 1.2 * durationIn
    // Closing (out): progress 1.0 → 0.0, t² easing,  real duration = durationOut
    const isOpening = state === 'in'
    transitionSeedRef.current = countRef.current
    transitionStartRef.current =
      startPosRef.current ?? OFFICIAL_START_POSITIONS[countRef.current % OFFICIAL_START_POSITIONS.length]
    const gl = glRef.current
    const uniform = uniformsRef.current.u_animatingOut
    if (gl && uniform) {
      gl.useProgram(programRef.current)
      gl.uniform1i(uniform, isOpening ? 0 : 1)
    }
    const duration = isOpening ? 1.2 * durationIn : durationOut
    const startVal = isOpening ? 0.1 : 1.0
    const endVal = isOpening ? 1.0 : 0.0
    let startTime: number | null = null
    let completed = false

    const animateTween = (now: number) => {
      if (startTime === null) {
        startTime = now
      }

      const elapsed = now - startTime
      const rawT = Math.min(elapsed / duration, 1)

      // Official evaluates `timingFunction: n => n*n` on the linear time scale
      // and applies it to the progress tween.
      // Reverting to strict algorithmic match:
      const easedT = isOpening ? rawT : rawT * rawT
      const currentProgress = startVal + (endVal - startVal) * easedT

      progressRef.current = currentProgress
      noiseYRef.current = state === 'out' ? 1000 - 1000 * currentProgress : 0

      if (rawT < 1) {
        tweenRef.current = requestAnimationFrame(animateTween)
        return
      }

      progressRef.current = endVal
      if (!completed) {
        completed = true
        onCompleteRef.current?.()
      }
    }

    tweenRef.current = requestAnimationFrame(animateTween)

    return () => {
      cancelAnimationFrame(tweenRef.current)
    }
  }, [state, durationIn, durationOut])

  return (
    <div ref={containerRef} className={className}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
