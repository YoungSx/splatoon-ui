'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { GitHubMark } from './github-mark'
import { WaveCanvas } from './wave-canvas'
import styles from './footer.module.css'

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Wave fill color (default: var(--color-black)) */
  waveColor?: string
  /** Wave height in px (default 120) */
  waveHeight?: number
}

const projectLinks = [
  {
    label: 'Issues',
    href: 'https://github.com/YoungSx/splatoon-ui/issues',
  },
  {
    label: 'README',
    href: 'https://github.com/YoungSx/splatoon-ui#readme',
  },
] as const

export function Footer({
  waveColor = 'var(--color-black)',
  waveHeight = 120,
  className,
  ...props
}: FooterProps) {
  return (
    <footer className={cn(styles.footer, className)} {...props}>
      <WaveCanvas color={waveColor} height={waveHeight} />

      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <p className={styles.kicker}>Stay fresh, ship fresh</p>
          <h2 className={styles.brandTitle}>Splatoon UI</h2>
          <p className={styles.brandCopy}>
            A fan-made React component library for ink-heavy community pages,
            tournament portals, and experimental Splatoon-inspired interfaces.
          </p>
        </div>

        <div className={styles.projectActions}>
          <Button
            variant="yellow"
            size="sm"
            theme="dark-yellow"
            leftIcon={<GitHubMark className="h-4 w-4 translate-y-px" />}
            render={
              <a
                href="https://github.com/YoungSx/splatoon-ui"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Splatoon UI on GitHub"
              />
            }
          >
            GitHub
          </Button>

          <div className={styles.linkRow} aria-label="Project links">
            {projectLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.navLink}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.legalRow}>
          <span className={styles.copyright}>
            MIT licensed. Fan-made and not affiliated with, endorsed by, or sponsored by Nintendo.
          </span>
          <span className={styles.copyright}>
            Splatoon is a trademark of Nintendo; this project is for non-commercial community use.
          </span>
        </div>
      </div>
    </footer>
  )
}
