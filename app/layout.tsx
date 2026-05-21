import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NewsletterPopup from "@/components/NewsletterPopup";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Collective SoHo — A Curated Retail Destination",
  description:
    "The Collective SoHo is a curated retail space at 435 Broadway showcasing emerging designers, artists, and independent brands in the heart of New York City.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <body className="min-h-screen flex flex-col bg-white text-black">
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <NewsletterPopup />
        </body>
      </html>
    </ClerkProvider>
  );
}
