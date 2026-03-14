import { Footer, Navbar } from '@/components'
import './globals.css'
import type { Metadata } from 'next'
import { Urbanist, Barlow, Instrument_Serif } from 'next/font/google'
import AnimationProvider from '@/providers/animation-provider'
import ModalProvider from '@/providers/modal-provider'
import ToastProvider from '@/providers/toast-provider'

const urban = Urbanist({ subsets: ['latin'] })

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-instrument-serif',
})

export const metadata: Metadata = {
  title: 'LemnArt — Mascare Calorifere Premium',
  description: 'Mascare calorifere din lemn masiv, fabricate artizanal. Design premium, materiale naturale, montaj inclus.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <body className={`${urban.className} ${barlow.variable} ${instrumentSerif.variable} bg-[#FAFAFA] text-[#1A1A1A]`}>
        <AnimationProvider>
          <ModalProvider />
          <ToastProvider />
          <Navbar />
          {children}
          <Footer />
        </AnimationProvider>
      </body>
    </html>
  )
}
