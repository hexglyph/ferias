import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema de Cadastro de Férias',
  description: 'Sistema para gerenciamento e cadastro de férias de funcionários',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          {children}
        </main>
      </body>
    </html>
  )
}

