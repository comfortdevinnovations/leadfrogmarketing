import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntroProvider from "@/components/IntroProvider";
import IntroSplash from "@/components/IntroSplash";
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

export const metadata: Metadata = {
  title: "Lead Frog Marketing | Accelerated Growth",
  description:
    "Lead Frog Marketing is a trusted growth partner delivering lead generation, digital strategy, and analytics that compound results.",
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
