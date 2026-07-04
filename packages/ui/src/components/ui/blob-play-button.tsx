'use client'

import * as React from 'react'
import { blobVertexShader, blobFragmentShader } from '@/lib/shaders/blob-shaders'
import { cn, resolveCSSColor } from '@/lib/utils'
import { createShader, createProgram, hexToRgb } from './webgl-utils'
import { useRenderGate } from '@/hooks/use-render-gate'
import { observeElementResize } from '@/lib/observe-element-resize'

// ── CSS Custom Properties ──
// --ease-back-out: cubic-bezier(0.21, 0.12, 0.35, 1.43)
// --duration-factor: 1
// --color-green: #6af7ce
const EASE_BACK_OUT = 'cubic-bezier(0.21, 0.12, 0.35, 1.43)'

export interface BlobPlayButtonProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  idleWobbleAmount?: number
  /** Blob color */
  hexColor?: string
  /** Container width in px */
  blobSize?: number
  ref?: React.Ref<HTMLDivElement>
}

export function BlobPlayButton({
  ref,
  className,
  idleWobbleAmount = 0.9,
  hexColor = 'var(--color-true-black)',
  blobSize = 120,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: BlobPlayButtonProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const animationRef = React.useRef<number>(0)
  const validRef = React.useRef<boolean>(true)
  const scheduleRenderRef = React.useRef<() => void>(() => {})
  // Skip GPU work while the button is scrolled off-screen or the tab is hidden.
  const activeRef = useRenderGate(canvasRef, {
    rootMargin: '200px',
    onActiveChange: (active) => {
      if (active) scheduleRenderRef.current()
    },
  })

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Use WebGL2 first, then fall back to WebGL1.
    const gl =
      (canvas.getContext('webgl2', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: true,
      }) as WebGL2RenderingContext) ||
      (canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: true,
      }) as WebGLRenderingContext)
    if (!gl) return

    validRef.current = true

    // Adapt fragment shader for WebGL2 if needed
    const isWebGL2 =
      typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext
    let fragSrc = blobFragmentShader
    let vertSrc = blobVertexShader
    if (isWebGL2) {
      vertSrc = `#version 300 es\nin vec3 position;\nin vec2 uv;\nout vec2 v_uv;\nvoid main() {\n  gl_Position = vec4(position, 1.0);\n  v_uv = uv;\n}\n`
      fragSrc = `#version 300 es\n${fragSrc
        .replace('varying vec2 v_uv;', 'in vec2 v_uv;\nout vec4 outColor;')
        .replace(/gl_FragColor/g, 'outColor')}`
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertSrc)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragSrc)
    if (!vertexShader || !fragmentShader) return

    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) return

    gl.useProgram(program)

    // ── Fullscreen triangle ──────────────────────────────────────
    const positions = new Float32Array([-1, -1, 3, -1, -1, 3])
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
    const posLoc = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uvs = new Float32Array([0, 0, 2, 0, 0, 2])
    const uvBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW)
    const uvLoc = gl.getAttribLocation(program, 'uv')
    gl.enableVertexAttribArray(uvLoc)
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0)

    // ── Uniforms ─────────────────────────────────────────────────
    const u_resolution = gl.getUniformLocation(program, 'u_resolution')
    const u_color = gl.getUniformLocation(program, 'u_color')
    const u_i_time = gl.getUniformLocation(program, 'i_time')
    const u_noiseSize = gl.getUniformLocation(program, 'u_noiseSize')
    const u_seed = gl.getUniformLocation(program, 'u_seed')
    const u_progress = gl.getUniformLocation(program, 'u_progress')
    const u_idleSpeed = gl.getUniformLocation(program, 'u_idleSpeed')

    const resolvedColor = resolveCSSColor(hexColor, canvas)
    const [r, g, b] = hexToRgb(resolvedColor)
    gl.uniform3f(u_color, r, g, b)
    gl.uniform1f(u_progress, 1.0) // blob visible at full size
    gl.uniform1f(u_seed, Math.random())
    gl.uniform1f(u_idleSpeed, idleWobbleAmount)

    // ── Resize: 2:1 canvas, 3:1 canvas-to-display ratio ─────────
    // The 2:1 canvas stretched to square creates the elliptical blob shape.
    // The 3:1 ratio ensures smoothstep(n, n+.01, 1-c) covers ~3 display pixels.
    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const w = parent.clientWidth || blobSize
      const h = parent.clientHeight || blobSize
      // Canvas = display × 3, aspect 2:1.
      const canvasW = Math.round(w * 3)
      const canvasH = Math.round(canvasW / 2)
      canvas.width = canvasW
      canvas.height = canvasH
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(u_resolution, canvas.width, canvas.height)
      gl.uniform1f(u_noiseSize, 0.945)
    }
    const unobserveResize = observeElementResize(canvas.parentElement ?? canvas, resize)

    // ── Render loop ──────────────────────────────────────────────
    let elapsedTime = 0
    let frameScheduled = false

    const scheduleRender = () => {
      if (!validRef.current || frameScheduled) return
      frameScheduled = true
      animationRef.current = requestAnimationFrame(render)
    }

    const render = () => {
      frameScheduled = false
      if (!validRef.current) return
      if (!activeRef.current) {
        return
      }

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      elapsedTime += 0.001
      gl.uniform1f(u_i_time, elapsedTime)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      scheduleRender()
    }

    scheduleRenderRef.current = scheduleRender
    scheduleRender()

    return () => {
      validRef.current = false
      scheduleRenderRef.current = () => {}
      cancelAnimationFrame(animationRef.current)
      unobserveResize()
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      gl.deleteBuffer(positionBuffer)
      gl.deleteBuffer(uvBuffer)
    }
  }, [hexColor, idleWobbleAmount, blobSize, activeRef])

  return (
    // ── playButton container ──────────────────────────────────────
    // The padding-top:100% creates a 1:1 square based on the parent width.
    //   transform:translate(-50%,-50%); width:100%; height:0; padding-top:100%;
    <div
      ref={(node) => {
        // Forward ref
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      }}
      className={cn('relative', className)}
      style={
        {
          width: '100%',
          height: 0,
          paddingTop: '100%',
          // Effective default is 1. Container hover sets 1.1.
          '--blob-scale': '1',
          ...style,
        } as React.CSSProperties
      }
      onMouseEnter={(event) => {
        event.currentTarget.style.setProperty('--blob-scale', '1.1')
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.setProperty('--blob-scale', '1')
        onMouseLeave?.(event)
      }}
      {...props}
    >
      {/* ── blobPositioner ─────────────────────────────────────────
            Blob positioner: absolute inset, scaled via --blob-scale.
              transform:scale(var(--blob-scale));
              transition:transform 0.3s cubic-bezier(0.21,0.12,0.35,1.43) 0.1s;
        */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          transform: 'scale(var(--blob-scale, 1))',
          transition: `transform 0.3s ${EASE_BACK_OUT} 0.1s`,
        }}
      >
        {/* ── image-blob ───────────────────────────────────────────
              Canvas fills the positioner.
          */}
        <div style={{ width: '100%', height: '100%' }}>
          <canvas ref={canvasRef} style={{ display: 'inline', width: '100%', height: '100%' }} />
        </div>
      </div>

      {/* ── playIcon ───────────────────────────────────────────────
            Centered play icon overlay.
              transform:translate(-40%,-50%) scale(var(--blob-scale));
              transition:transform 0.3s cubic-bezier(0.21,0.12,0.35,1.43);
              color:var(--color-green); width:30%;
        */}
      <svg
        aria-hidden="true"
        viewBox="0 0 74 84"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '30%',
          color: 'var(--color-green)',
          transform: 'translate(-40%, -50%) scale(var(--blob-scale, 1))',
          transition: `transform 0.3s ${EASE_BACK_OUT}`,
        }}
      >
        <path
          d="M8.273.749C4.596-1.38 0 1.28 0 5.539V78.46c0 4.258 4.596 6.918 8.273 4.79l62.97-36.461c3.676-2.13 3.676-7.452 0-9.58L8.273.75Z"
          stroke="none"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    </div>
  )
}
