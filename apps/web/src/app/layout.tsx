import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import EmotionRegistry from "@/lib/emotion-registry";
import { AuthProvider } from "@/lib/auth-context";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Coast Competitions",
    template: "%s · Coast Competitions",
  },
  description:
    "Skill-based UK competition raffles with transparent draws and fast entry.",
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
              <main className="flex-grow">{children}</main>
              <SiteFooter />
            </div>
          </EmotionRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
