import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntroProvider from "@/components/IntroProvider";
import IntroSplash from "@/components/IntroSplash";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const title = "Lead Frog Marketing | Accelerated Growth";
const description =
  "Lead Frog Marketing is a trusted growth partner delivering lead generation, digital strategy, and analytics that compound results.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s | ${SITE_NAME}`,
  },
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title,
    description,
    url: SITE_URL,
    images: [{ url: "/hero-analytics.jpg", width: 1200, height: 1200 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/hero-analytics.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#025374",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-secondary text-text font-paragraph">
        {/* Without JS the splash can never finish, so drop it and un-hide the
            header lockup it would otherwise have handed off to. */}
        <noscript>
          <style>{`[data-intro-overlay]{display:none!important}[data-brand-lockup]{opacity:1!important}`}</style>
        </noscript>
        <IntroProvider>
          <IntroSplash />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </IntroProvider>
      </body>
    </html>
  );
}
