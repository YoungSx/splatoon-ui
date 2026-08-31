import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// viewport-fit=cover lets the footer respect env(safe-area-inset-*) on
// notched devices. Zoom stays enabled on purpose — blocking it is an a11y
// failure, and iOS ignores user-scalable=no anyway.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const obviouslyNarrow = localFont({
  src: '../../public/fonts/obviously-narrow-600.woff2',
  variable: '--font-obviously-narrow',
  weight: '600',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Splatoon UI',
    template: '%s | Splatoon UI',
  },
  description:
    'Fan-made React component library for ink-heavy Splatoon-inspired sites, built with Next.js, Tailwind CSS, and shadcn-style primitives.',
  applicationName: 'Splatoon UI',
  authors: [{ name: 'YoungSx', url: 'https://github.com/YoungSx' }],
  creator: 'YoungSx',
  keywords: [
    'Splatoon UI',
    'React component library',
    'Next.js components',
    'Tailwind CSS',
    'fan-made UI',
    'ink animation',
  ],
  category: 'developer tools',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Splatoon UI',
    description: 'Fan-made React component library for ink-heavy Splatoon-inspired sites.',
    type: 'website',
    siteName: 'Splatoon UI',
  },
  twitter: {
    card: 'summary',
    title: 'Splatoon UI',
    description: 'Fan-made React component library for ink-heavy Splatoon-inspired sites.',
  },
  icons: {
    icon: '/favicons/favicon.svg',
    shortcut: '/favicons/favicon.ico',
    apple: '/favicons/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${obviouslyNarrow.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body flex min-h-full flex-col">{children}</body>
    </html>
  )
}
