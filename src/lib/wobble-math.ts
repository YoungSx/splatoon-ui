/**
 * Splatoon-inspired Physics and Easing Utilities
 * Extracted algorithms for GSAP-like animations without the GSAP dependency.
 */

// GSAP 'power3.in' equivalent (used for modal closing)
export const power3In = (t: number) => {
  return t * t * t
}

// GSAP 'power3.out' equivalent (used for modal opening slam)
export const power3Out = (t: number) => {
  return 1 - Math.pow(1 - t, 3)
}

// GSAP 'power3.inOut' equivalent
export const power3InOut = (t: number) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// GSAP 'power4.inOut' equivalent (used for FLIP-style open animation)
export const power4InOut = (t: number) => {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
}

// GSAP 'back.out' equivalent (used for the bouncy pop-in of elements)
export const backOut = (t: number, overshoot = 1.70158) => {
  return 1 + overshoot * Math.pow(t - 1, 3) + (overshoot + 1) * Math.pow(t - 1, 2)
}

/**
 * Linearly interpolates between two values.
 */
export const lerp = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t
}

/**
 * Generates a random number between min and max.
 */
export const randomRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

/**
 * Generates a random rotation for the modal drop animation.
 */
export const getSplatRandomRotation = () => {
  const sign = Math.random() > 0.5 ? 1 : -1
  return sign * randomRange(20, 30)
}
