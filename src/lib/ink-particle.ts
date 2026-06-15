// ─── Ink Particle Pool (pure data + drawing, no React) ──────────────────────

export interface InkParticle {
  x: number
  y: number
  size: number
  targetSize: number
  color: string
  opacity: number
  rotation: number
  rotationSpeed: number
  age: number
  maxAge: number
  /** Pre-computed blob control points for organic shape */
  blobPoints: number[]
  alive: boolean
}

export function createParticle(): InkParticle {
  return {
    x: 0,
    y: 0,
    size: 0,
    targetSize: 0,
    color: '#0d0d0d',
    opacity: 0,
    rotation: 0,
    rotationSpeed: 0,
    age: 0,
    maxAge: 1,
    blobPoints: new Array(8).fill(0),
    alive: false,
  }
}

export function initParticleBlob(blobPoints: number[]) {
  for (let i = 0; i < blobPoints.length; i++) {
    blobPoints[i] = 0.7 + Math.random() * 0.6 // 0.7 – 1.3 range
  }
}

// ─── Constants ──────────────────────────────────────────────────────────────

export const DEFAULT_COLORS = [
  '#0d0d0d', // Chaos Black (default ink)
  '#603bff', // Ink Blue
  '#eaff3d', // Neon Yellow
  '#ff505e', // Ink Red
  '#6af7ce', // Ink Green
  '#af50ff', // Ink Purple
  '#ff9750', // Ink Orange
]

export const POOL_SIZE = 200

// ─── Canvas Drawing ─────────────────────────────────────────────────────────

export function drawBlob(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  blobPoints: number[],
  color: string,
) {
  ctx.save()
  ctx.fillStyle = color
  ctx.translate(x, y)
  ctx.rotate(rotation)

  ctx.beginPath()
  const segments = blobPoints.length
  const angleStep = (Math.PI * 2) / segments

  for (let i = 0; i <= segments; i++) {
    const idx = i % segments
    const angle = idx * angleStep
    const r = size * blobPoints[idx]
    const px = Math.cos(angle) * r
    const py = Math.sin(angle) * r

    if (i === 0) {
      ctx.moveTo(px, py)
    } else {
      const prevIdx = (i - 1) % segments
      const prevAngle = prevIdx * angleStep
      const prevR = size * blobPoints[prevIdx]
      const cpx = Math.cos(prevAngle + angleStep * 0.5) * ((prevR + r) / 2) * 1.1
      const cpy = Math.sin(prevAngle + angleStep * 0.5) * ((prevR + r) / 2) * 1.1
      ctx.quadraticCurveTo(cpx, cpy, px, py)
    }
  }

  ctx.closePath()
  ctx.fill()
  ctx.restore()
}
