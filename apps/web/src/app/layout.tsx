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
    default: "Coast Competitions · Win Incredible Prizes & Cash",
    template: "%s · Coast Competitions",
  },
  description:
    "Enter Coast Competitions for your chance to win tax-free cash, luxury cars, and the latest tech. Skill-based UK raffles with transparent draws and guaranteed winners.",
  keywords: ["raffle", "competitions", "win cash", "UK competitions", "skill-based raffle", "Coast Competitions", "win a car"],
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
    title: "Coast Competitions · Win Incredible Prizes & Cash",
    description: "Enter Coast Competitions for your chance to win tax-free cash, luxury cars, and the latest tech.",
    url: 'https://coastcompetitions.co.uk',
    siteName: 'Coast Competitions',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Coast Competitions · Win Incredible Prizes & Cash",
    description: "Enter Coast Competitions for your chance to win tax-free cash, luxury cars, and the latest tech.",
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
