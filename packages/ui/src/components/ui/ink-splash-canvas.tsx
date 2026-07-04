'use client'

/**
 * WebGL-based ink splash transition effect.
 * Uses fragment shaders with simplex noise (Ashima Arts) for organic ink edges.
 *
 * Uses raw WebGL with WebGL2-first fallback — no external dependencies
 * Implemented with raw WebGL.
 */

import * as React from 'react'
import { resolveCSSColor } from '@/lib/utils'
import { type GLContext, createShader, createProgram, hexToRgb } from './webgl-utils'
import { getVertexShaderSource, getFragmentShaderSource } from './ink-splash-shaders'
import { useBackgroundTexture } from '@/hooks/use-background-texture'
import { observeElementResize } from '@/lib/observe-element-resize'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface InkSplashCanvasProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'color'
> {
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
  /** Optional texture for the splat-transition shader. */
  background?: string
  /**
   * Pre-loaded image element for the background texture.
   * When provided, skips async Image() loading — texture uploads synchronously on mount.
   * Use this to avoid the first-play flash where the shader falls back to solid color.
   */
  preloadedBackground?: HTMLImageElement | null
  /** Called when animation completes */
  onComplete?: () => void
  ref?: React.Ref<HTMLDivElement>
}

// ─────────────────────────────────────────────────────────────────────────────
// Default start positions cycle through viewport corners.
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
  ref,
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
  style,
  ...props
}: InkSplashCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const glRef = React.useRef<GLContext | null>(null)
  const programRef = React.useRef<WebGLProgram | null>(null)
  const uniformsRef = React.useRef<Record<string, WebGLUniformLocation | null>>({})
  const renderLoopRef = React.useRef<number>(0)
  const tweenRef = React.useRef<number>(0)
  const progressRef = React.useRef(0)
  const onCompleteRef = React.useRef(onComplete)
  const transitionSeedRef = React.useRef(count)
  const transitionStartRef = React.useRef<[number, number]>(
    startPosition ?? OFFICIAL_START_POSITIONS[count % OFFICIAL_START_POSITIONS.length]
  )

  const bgReadyRef = React.useRef(false)
  const validRef = React.useRef(false)
  const noiseYRef = React.useRef(0)

  const setContainerRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node

      if (typeof ref === 'function') {
        ref(node)
        return
      }

      if (ref) {
        ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      }
    },
    [ref]
  )

  React.useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

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

    // The shader uses a single oversized fullscreen triangle.
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
      'u_resolution',
      'u_color',
      'u_progress',
      'u_noiseSize',
      'u_noiseY',
      'u_seed',
      'u_start',
      'u_animatingOut',
      'u_background',
      'u_background_ready',
    ]
    uniformNames.forEach((name) => {
      uniformsRef.current[name] = gl.getUniformLocation(program, name)
    })

    // Activate program before setting uniforms (required by WebGL spec)
    gl.useProgram(program)

    // Set initial shader values.
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
      const w = container.clientWidth
      const h = container.clientHeight
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }
    const unobserveResize = observeElementResize(container, resize)

    // Cleanup
    return () => {
      cancelAnimationFrame(renderLoopRef.current)
      cancelAnimationFrame(tweenRef.current)
      unobserveResize()
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

  const drawFrame = React.useCallback(
    (gl: GLContext, progress: number) => {
      if (!validRef.current) return
      const program = programRef.current
      const canvas = canvasRef.current
      if (!program || !canvas) return

      gl.useProgram(program)

      const uniforms = uniformsRef.current
      gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height)

      const resolvedColor = containerRef.current
        ? resolveCSSColor(color, containerRef.current)
        : color
      const [r, g, b] = resolvedColor ? hexToRgb(resolvedColor) : [1, 0, 0]
      gl.uniform3f(uniforms.u_color, r, g, b)

      gl.uniform1f(uniforms.u_progress, progress)
      gl.uniform1f(uniforms.u_seed, transitionSeedRef.current)
      gl.uniform1f(uniforms.u_noiseSize, 1.0)

      const startPos = transitionStartRef.current
      gl.uniform2f(uniforms.u_start, startPos[0], startPos[1])

      // Noise Y is updated by the tween.
      gl.uniform1f(uniforms.u_noiseY, noiseYRef.current)

      // Match the OGL-style program state used by this transition.
      gl.enable(gl.DEPTH_TEST)
      // OGL defaults: cullFace=null (disabled), frontFace=CCW, depthMask=true, depthFunc=LESS
      gl.depthMask(true)
      gl.depthFunc(gl.LESS)
      gl.disable(gl.BLEND)

      // A white clear color shows through where the shader outputs transparency.
      // The shader outputs transparent black (0,0,0,0) where ink is absent,
      // so the white clear color shows through.
      gl.clearColor(1, 1, 1, 1)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
    [color]
  )

  // Run the render loop only while a transition is in flight. In the 'idle'
  // state the shader output is fully transparent and static, so a single
  // flush frame produces the identical pixels while letting the GPU sleep
  // instead of redrawing a transparent fullscreen quad at 60fps.
  React.useEffect(() => {
    if (!validRef.current) return
    const gl = glRef.current
    if (!gl) return

    if (state === 'idle') {
      // Idle steady state is fully transparent. Draw one frame at the resting
      // values (matching the tween's idle reset) to flush identical pixels,
      // then stop the loop so the GPU isn't redrawing a transparent quad.
      progressRef.current = 0
      noiseYRef.current = 0
      drawFrame(gl, 0)
      return
    }

    let running = true

    const render = () => {
      if (!running) return
      const ctx = glRef.current
      if (ctx && validRef.current) {
        drawFrame(ctx, progressRef.current)
        renderLoopRef.current = requestAnimationFrame(render)
      }
    }

    renderLoopRef.current = requestAnimationFrame(render)

    return () => {
      running = false
      cancelAnimationFrame(renderLoopRef.current)
    }
  }, [drawFrame, state])

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

    // Animation behavior:
    // Opening (in):  progress 0.1 → 1.0, linear easing, real duration = 1.2 * durationIn
    // Closing (out): progress 1.0 → 0.0, t² easing,  real duration = durationOut
    const isOpening = state === 'in'
    transitionSeedRef.current = count
    transitionStartRef.current =
      startPosition ?? OFFICIAL_START_POSITIONS[count % OFFICIAL_START_POSITIONS.length]
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

      // The closing tween squares the linear time scale before applying progress.
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
  }, [state, durationIn, durationOut, count, startPosition])

  return (
    <div ref={setContainerRef} className={className} style={style} {...props}>
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
