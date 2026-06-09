'use client'

/**
 * Footer — Official splatoon.nintendo.com footer replica.
 *
 * Features:
 * - Social media icon links (Twitter/X, Facebook, YouTube, Instagram)
 * - Navigation link columns
 * - Copyright and legal links
 * - Nintendo branding logo
 *
 * Integrates with the existing WaveCanvas for the wave decoration.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { WaveCanvas } from './wave-canvas'
import styles from './footer.module.css'

// ─── Social icon components (matching official look) ─────────────────────

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Wave fill color (default '#0c0c0c') */
  waveColor?: string
  /** Wave height in px (default 120) */
  waveHeight?: number
}

// ─── Component ────────────────────────────────────────────────────────────

export function Footer({
  waveColor = '#0c0c0c',
  waveHeight = 120,
  className,
  ...props
}: FooterProps) {
  return (
    <footer
      className={cn(styles.footer, className)}
      {...props}
    >
      {/* Wave decoration — positioned above the footer content */}
      <WaveCanvas color={waveColor} height={waveHeight} />

      <div className={styles.inner}>
        {/* Social media icons */}
        <div className={styles.socialRow}>
          <a
            href="https://twitter.com/SplatoonJP"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Follow Splatoon on X (Twitter)"
          >
            <TwitterIcon />
          </a>
          <a
            href="https://www.facebook.com/Splatoon/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Follow Splatoon on Facebook"
          >
            <FacebookIcon />
          </a>
          <a
            href="https://www.youtube.com/@NintendoAmerica"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Watch Splatoon on YouTube"
          >
            <YoutubeIcon />
          </a>
          <a
            href="https://www.instagram.com/splatoonjp/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Follow Splatoon on Instagram"
          >
            <InstagramIcon />
          </a>
        </div>

        <hr className={styles.divider} />

        {/* Navigation columns */}
        <div className={styles.navGrid}>
          <div className={styles.navColumn}>
            <h3>Games</h3>
            <ul className={styles.navList}>
              <li><a href="https://splatoon.nintendo.com" className={styles.navLink}>Splatoon 3</a></li>
              <li><a href="https://splatoon.nintendo.com" className={styles.navLink}>Splatoon 2</a></li>
              <li><a href="https://splatoon.nintendo.com" className={styles.navLink}>Splatoon</a></li>
            </ul>
          </div>
          <div className={styles.navColumn}>
            <h3>Support</h3>
            <ul className={styles.navList}>
              <li><a href="https://en-americas-support.nintendo.com/" className={styles.navLink}>Customer Support</a></li>
              <li><a href="https://www.nintendo.com/us/switch/online/" className={styles.navLink}>Nintendo Switch Online</a></li>
              <li><a href="https://www.nintendo.com/us/switch/online/" className={styles.navLink}>Nintendo eShop</a></li>
            </ul>
          </div>
          <div className={styles.navColumn}>
            <h3>Community</h3>
            <ul className={styles.navList}>
              <li><a href="https://www.nintendo.com/us/" className={styles.navLink}>Nintendo Official Site</a></li>
              <li><a href="https://www.nintendo.com/us/switch/" className={styles.navLink}>Nintendo Switch</a></li>
            </ul>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Legal / Copyright */}
        <div className={styles.legalRow}>
          <span className={styles.copyright}>
            © Nintendo. Titles are owned by their respective copyright holders.
          </span>
          <a href="https://www.nintendo.com/privacy-policy/" className={styles.legalLink}>Privacy Policy</a>
          <a href="https://www.nintendo.com/terms-of-use/" className={styles.legalLink}>Terms of Use</a>
          <a href="https://www.nintendo.com/cookie-policy/" className={styles.legalLink}>Cookie Policy</a>
        </div>

        {/* Nintendo branding */}
        <div className={styles.brandRow}>
          <a
            href="https://www.nintendo.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.nintendoLogo}
            aria-label="Nintendo Official Site"
          >
            <svg viewBox="-2 -5 114 28" width="96" height="20" fill="currentColor" aria-label="NINTENDO">
              {/* N (first) */}
              <path d="M0 0h5l9 14V0h4v20h-5L4 6V20H0z" />
              {/* I with diamond dot */}
              <path d="M21 0h4v20h-4z" />
              <path d="M23 -4l2 2-2 2-2-2z" fill="currentColor" />
              {/* N (second) */}
              <path d="M28 0h5l9 14V0h4v20h-5L32 6V20H28z" />
              {/* T */}
              <path d="M49 0h12v3h-4v17h-4V3h-4z" />
              {/* E */}
              <path d="M64 0h9v3h-5v4h4.5v3H68v5h5.5v3H64z" />
              {/* N (third) */}
              <path d="M76 0h5l9 14V0h4v20h-5L80 6V20H76z" />
              {/* D */}
              <path d="M97 0h5c3 0 5.5 2.5 5.5 5.5v9c0 3-2.5 5.5-5.5 5.5H97zm4 3v14h1c1.4 0 2.5-1.1 2.5-2.5v-9C104.5 4.1 103.4 3 102 3h-1z" />
              {/* O */}
              <path d="M112 0c-3.3 0-6 2.7-6 6v8c0 3.3 2.7 6 6 6s6-2.7 6-6V6c0-3.3-2.7-6-6-6zm0 3.5c1.4 0 2.5 1.1 2.5 2.5v6c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V6c0-1.4 1.1-2.5 2.5-2.5z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
