import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CookieConsent } from "@/components/CookieConsent";
import EmotionRegistry from "@/lib/emotion-registry";
import { AuthProvider } from "@/lib/auth-context";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Coast Competitions UK · Win Incredible Prizes & Cash",
    template: "%s · Coast Competitions UK",
  },
  description:
    "Enter Coast Competitions UK for your chance to win tax-free cash, luxury cars, and the latest tech. Skill-based UK prize competitions and raffles with transparent draws and guaranteed winners.",
  keywords: ["prize competition", "competitions", "win cash", "UK competitions", "skill-based competition", "Coast Competitions UK", "win a car", "UK prize competitions", "raffle"],
  authors: [{ name: "Coast Competitions" }],
  creator: "Coast Competitions",
  publisher: "Coast Competitions",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://coastcompetitions.co.uk'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  openGraph: {
    title: "Coast Competitions UK · Win Incredible Prizes & Cash",
    description: "Enter Coast Competitions UK for your chance to win tax-free cash, luxury cars, and the latest tech.",
    url: 'https://coastcompetitions.co.uk',
    siteName: 'Coast Competitions UK',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: 'https://images.ctfassets.net/gbo22d874wm2/4SxkVn3dgdpIM6ICvihQ7o/38d94b3752507a021da051be56a1e5f4/Photo_26-02-2026__07_46_17.jpg',
        width: 1200,
        height: 630,
        alt: 'Coast Competitions',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Coast Competitions UK · Win Incredible Prizes & Cash",
    description: "Enter Coast Competitions UK for your chance to win tax-free cash, luxury cars, and the latest tech.",
    images: [
      {
        url: 'https://images.ctfassets.net/gbo22d874wm2/4SxkVn3dgdpIM6ICvihQ7o/38d94b3752507a021da051be56a1e5f4/Photo_26-02-2026__07_46_17.jpg',
        alt: 'Coast Competitions',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} antialiased`}>
        <AuthProvider>
          <EmotionRegistry>
            <div className="flex min-h-screen flex-col bg-background text-foreground">
              <SiteHeader />
              <main className="grow">{children}</main>
              <SiteFooter />
              <CookieConsent />
            </div>
          </EmotionRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
