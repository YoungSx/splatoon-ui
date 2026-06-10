import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Splatoon UI',
  description: 'Splatoon-inspired component library built on shadcn/ui + Radix',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
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
