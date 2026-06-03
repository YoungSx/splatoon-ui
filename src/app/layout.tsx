import type { Metadata } from 'next'
import './globals.css'

const themeInitScript = `(function(){try{var stored=localStorage.getItem("splat-theme");var theme=stored==="light"||stored==="dark"?stored:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.classList.toggle("dark",theme==="dark");}catch(e){document.documentElement.classList.add("dark");}})();`

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
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/xyd0frw.css" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col font-body">
        {children}
      </body>
    </html>
  )
}
