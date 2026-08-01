import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400','600','700','800','900'], variable: '--font-poppins', display: 'swap' })

export const metadata: Metadata = {
  title: 'Planner 360 — Sistema de Produtividade',
  description: 'Sistema completo para organizar tarefas, gerenciar hábitos, acompanhar metas e analisar desempenho.',
  keywords: ['produtividade', 'planejador', 'hábitos', 'metas', 'tarefas'],
}

export const viewport: Viewport = {
  themeColor: '#080b16',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" style={{ background: 'var(--bg-primary, #080b16)' }}>
      <body className={`${inter.variable} ${poppins.variable} antialiased`} style={{ fontFamily: 'Inter, sans-serif' }}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
