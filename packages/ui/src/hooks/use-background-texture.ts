import * as React from 'react'
import type { GLContext } from '@/components/ui/webgl-utils'

// Module-level cache — survives re-renders and GL context resets.
// Prevents first-play flash where shader falls back to solid color.
const bgImageCache = new Map<string, HTMLImageElement>()

type Uniforms = Record<string, WebGLUniformLocation | null>

export function useBackgroundTexture({
  glRef,
  uniformsRef,
  bgReadyRef,
  validRef,
  preloadedBackground,
  background,
  count,
}: {
  glRef: React.RefObject<GLContext | null>
  uniformsRef: React.RefObject<Uniforms>
  bgReadyRef: React.RefObject<boolean>
  validRef: React.RefObject<boolean>
  preloadedBackground?: HTMLImageElement | null
  background?: string
  count: number
}) {
  React.useEffect(() => {
    const gl = glRef.current
    if (!gl) return

    const imageSource = preloadedBackground ?? background
    if (!imageSource) {
      bgReadyRef.current = false
      if (uniformsRef.current.u_background_ready) {
        gl.uniform1i(uniformsRef.current.u_background_ready, 0)
      }
      return
    }

    const bgTexture = gl.createTexture()
    if (!bgTexture) return

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, bgTexture)
    gl.uniform1i(uniformsRef.current.u_background, 0)

    const uploadTexture = (img: TexImageSource) => {
      if (!validRef.current) return
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

    // Pre-loaded HTMLImageElement — upload synchronously (no flash)
    if (preloadedBackground && preloadedBackground.complete) {
      uploadTexture(preloadedBackground)
      return () => {
        gl.deleteTexture(bgTexture)
        bgReadyRef.current = false
      }
    }

    // String URL — check module-level cache first
    if (typeof imageSource === 'string') {
      const cached = bgImageCache.get(imageSource)
      if (cached && cached.complete) {
        uploadTexture(cached)
        return () => {
          gl.deleteTexture(bgTexture)
          bgReadyRef.current = false
        }
      }

      // Not cached yet — async load, populate cache for next play
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 0, 255])
      )

      let cancelled = false
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        if (cancelled || !validRef.current) return
        bgImageCache.set(imageSource, img)
        uploadTexture(img)
      }
      img.src = imageSource

      return () => {
        cancelled = true
        gl.deleteTexture(bgTexture)
        bgReadyRef.current = false
      }
    }

    return () => {
      gl.deleteTexture(bgTexture)
      bgReadyRef.current = false
    }
  }, [background, preloadedBackground, count, bgReadyRef, glRef, uniformsRef, validRef])
}
