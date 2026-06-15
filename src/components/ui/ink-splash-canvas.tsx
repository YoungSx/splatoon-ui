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
import { resolveCSSColor } from '@/lib/utils'
import { type GLContext, createShader, createProgram, hexToRgb } from './webgl-utils'
import { getVertexShaderSource, getFragmentShaderSource } from './ink-splash-shaders'
import { useBackgroundTexture } from '@/hooks/use-background-texture'

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
  /**
   * Optional texture supported by the official splat-transition shader.
   * The official navigation overlay leaves this unset so the ink stays flat black.
   */
  background?: string
  /**
   * Pre-loaded image element for the background texture.
   * When provided, skips async Image() loading — texture uploads synchronously on mount.
   * Use this to avoid the first-play flash where the shader falls back to solid color.
   */
  preloadedBackground?: HTMLImageElement | null
  /** Called when animation completes */
  onComplete?: () => void
  /** Additional CSS class */
  className?: string
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
  color = 'var(--color-true-black)',
  count = 0,
  startPosition,
  background,
  preloadedBackground,
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
    if (!gl) return

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
  }, [])

  // Background texture loading — async image load with module-level cache
  useBackgroundTexture({
    glRef,
    uniformsRef,
    bgReadyRef,
    validRef,
    preloadedBackground,
    background,
    count,
  })

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

    const resolvedColor = containerRef.current ? resolveCSSColor(colorRef.current, containerRef.current) : colorRef.current
    const [r, g, b] = resolvedColor ? hexToRgb(resolvedColor) : [1, 0, 0]
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
    // OGL defaults: cullFace=null (disabled), frontFace=CCW, depthMask=true, depthFunc=LESS
    gl.depthMask(true)
    gl.depthFunc(gl.LESS)
    gl.disable(gl.BLEND)

    // Official OGL Scene sets clearColor(1,1,1,1) — white background.
    // The shader outputs transparent black (0,0,0,0) where ink is absent,
    // so the white clear color shows through, matching the official visual.
    gl.clearColor(1, 1, 1, 1)
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
  }, [drawFrame])

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
