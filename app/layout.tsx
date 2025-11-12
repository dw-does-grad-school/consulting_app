import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/components/ConvexClientProvider'
import Navbar from '@/components/navbar'
import FloatingChatButton from '@/components/FloatingChatButton'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'A Business Consulting SAAS App',
  description: 'This is in the early stages of development and ',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50`}>
        <ClerkProvider>
          <ConvexClientProvider>
            <Navbar />
            {children}
            <FloatingChatButton />
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}