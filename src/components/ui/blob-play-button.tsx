"use client"

import * as React from 'react'
import { blobVertexShader, blobFragmentShader } from '@/lib/shaders/blob-shaders'
import { cn } from '@/lib/utils'

interface BlobPlayButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  idleWobbleAmount?: number
  hexColor?: string
  blobSize?: number
}

// Convert hex to rgb for WebGL uniform
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [0, 0, 0]
}

export const BlobPlayButton = React.forwardRef<HTMLDivElement, BlobPlayButtonProps>(
  ({ className, idleWobbleAmount = 0.9, hexColor = '#eaff3d', blobSize = 120, ...props }, ref) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const glRef = React.useRef<WebGLRenderingContext | null>(null)
    const programRef = React.useRef<WebGLProgram | null>(null)
    const uniformsRef = React.useRef<Record<string, WebGLUniformLocation | null>>({})
    const animationRef = React.useRef<number>(0)
    const validRef = React.useRef<boolean>(true)

    React.useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const gl = canvas.getContext('webgl', { alpha: true, antialias: true })
      if (!gl) return

      glRef.current = gl
      validRef.current = true

      // Compile Shaders
      const createShader = (type: number, source: string) => {
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

      const vertexShader = createShader(gl.VERTEX_SHADER, blobVertexShader)
      const fragmentShader = createShader(gl.FRAGMENT_SHADER, blobFragmentShader)
      if (!vertexShader || !fragmentShader) return

      const program = gl.createProgram()
      if (!program) return
      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program))
        return
      }

      programRef.current = program
      gl.useProgram(program)

      // Get uniform locations
      uniformsRef.current = {
        u_time: gl.getUniformLocation(program, 'u_time'),
        u_wobbleAmount: gl.getUniformLocation(program, 'u_wobbleAmount'),
        u_color: gl.getUniformLocation(program, 'u_color'),
        projectionMatrix: gl.getUniformLocation(program, 'projectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(program, 'modelViewMatrix'),
      }

      // Generate a circular mesh
      const segments = 64
      const vertices = []
      const uvs = []
      
      // Center point
      vertices.push(0, 0)
      uvs.push(0.5, 0.5)

      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2
        // Radius is ~0.7 to leave room for wobble distortion
        const x = Math.cos(theta) * 0.7
        const y = Math.sin(theta) * 0.7
        vertices.push(x, y)
        uvs.push(x * 0.5 + 0.5, y * 0.5 + 0.5)
      }

      // Create indices for triangle fan
      const indices = []
      for (let i = 1; i <= segments; i++) {
        indices.push(0, i, i + 1)
      }

      // Buffers
      const positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
      const posLoc = gl.getAttribLocation(program, 'position')
      gl.enableVertexAttribArray(posLoc)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

      const uvBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW)
      const uvLoc = gl.getAttribLocation(program, 'uv')
      gl.enableVertexAttribArray(uvLoc)
      gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0)

      const indexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

      // Setup simple orthographic projection
      const projectionMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ])
      gl.uniformMatrix4fv(uniformsRef.current.projectionMatrix, false, projectionMatrix)
      gl.uniformMatrix4fv(uniformsRef.current.modelViewMatrix, false, projectionMatrix)

      // Set fixed color
      const [r, g, b] = hexToRgb(hexColor)
      gl.uniform3f(uniformsRef.current.u_color, r, g, b)

      const resize = () => {
        // High-DPI support
        const dpr = window.devicePixelRatio || 1
        canvas.width = blobSize * dpr
        canvas.height = blobSize * dpr
        canvas.style.width = `${blobSize}px`
        canvas.style.height = `${blobSize}px`
        gl.viewport(0, 0, canvas.width, canvas.height)
      }
      resize()
      window.addEventListener('resize', resize)

      let startTime = performance.now()

      const render = (now: number) => {
        if (!validRef.current) return
        
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        
        const elapsed = (now - startTime) / 1000
        gl.uniform1f(uniformsRef.current.u_time, elapsed)
        gl.uniform1f(uniformsRef.current.u_wobbleAmount, idleWobbleAmount)

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)

        animationRef.current = requestAnimationFrame(render)
      }
      animationRef.current = requestAnimationFrame(render)

      return () => {
        validRef.current = false
        cancelAnimationFrame(animationRef.current)
        window.removeEventListener('resize', resize)
        gl.deleteProgram(program)
        gl.deleteShader(vertexShader)
        gl.deleteShader(fragmentShader)
        gl.deleteBuffer(positionBuffer)
        gl.deleteBuffer(uvBuffer)
        gl.deleteBuffer(indexBuffer)
      }
    }, [hexColor, idleWobbleAmount, blobSize])

    return (
      <div
        ref={ref}
        className={cn(
          'group relative flex items-center justify-center isolate overflow-visible',
          'transition-transform duration-300',
          className
        )}
        {...props}
      >
        {/* WebGL Blob Layer */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
          <canvas ref={canvasRef} className="block" />
        </div>
        
        {/* Play Icon Layer */}
        <svg
          aria-hidden="true"
          role="img"
          className="relative z-10 w-8 h-8 md:w-12 md:h-12 ml-1 text-chaos-black"
          viewBox="0 0 74 84"
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
)
BlobPlayButton.displayName = 'BlobPlayButton'
