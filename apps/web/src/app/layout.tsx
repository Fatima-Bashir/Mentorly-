// @author: fatima bashir
import type { Metadata } from 'next'
// import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/lib/ThemeContext'
import { Toaster } from '@/components/ui/toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mentorly - AI Career Mentor',
  description: 'Personalized AI career mentorship platform for skill development and career growth',
  keywords: 'career, mentorship, AI, skills, learning, interview, resume',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

