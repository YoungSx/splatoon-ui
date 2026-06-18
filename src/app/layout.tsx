import type { Metadata } from 'next'
import './globals.css'

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
    description:
      'Fan-made React component library for ink-heavy Splatoon-inspired sites.',
    type: 'website',
    siteName: 'Splatoon UI',
  },
  twitter: {
    card: 'summary',
    title: 'Splatoon UI',
    description:
      'Fan-made React component library for ink-heavy Splatoon-inspired sites.',
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
    <html lang="en" className="h-full antialiased">
      {/* External Typekit font: obviously-narrow (used via --font-alt) */}
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/xyd0frw.css" />
      </head>
      <body className="min-h-full flex flex-col font-body">
        {children}
      </body>
    </html>
  )
}
