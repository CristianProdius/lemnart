import { Footer, Navbar } from '@/components'
import './globals.css'
import type { Metadata } from 'next'
import { Urbanist, Barlow, Instrument_Serif } from 'next/font/google'
import AnimationProvider from '@/providers/animation-provider'
import ModalProvider from '@/providers/modal-provider'
import ToastProvider from '@/providers/toast-provider'
import ThemeProvider from '@/providers/theme-provider'
import OrganizationSchema from '@/components/schema/organization-schema'

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://lemnart.ro'),
  title: {
    default: 'LemnArt — Mascare Calorifere Premium din Lemn Masiv',
    template: '%s | LemnArt',
  },
  description: 'Mascare calorifere din lemn masiv, fabricate artizanal. Design premium, materiale naturale, montaj inclus.',
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    siteName: 'LemnArt',
    title: 'LemnArt — Mascare Calorifere Premium din Lemn Masiv',
    description: 'Mascare calorifere din lemn masiv, fabricate artizanal. Design premium, materiale naturale, montaj inclus.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body className={`${urban.className} ${barlow.variable} ${instrumentSerif.variable} flex min-h-screen flex-col bg-[var(--th-surface)] text-[rgb(var(--th-text))]`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--th-surface)] focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg">
          Salt la conținut
        </a>
        <OrganizationSchema />
        <ThemeProvider>
          <AnimationProvider>
            <ModalProvider />
            <ToastProvider />
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </AnimationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
