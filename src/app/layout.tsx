import type { Metadata } from 'next'
import { Bungee, Manrope, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const bungee = Bungee({
  variable: '--font-display',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const manrope = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
})

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
    <html
      lang="en"
      className={`${bungee.variable} ${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-body">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
