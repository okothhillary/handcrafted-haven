import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { SkipLink } from "@/utils/accessibility";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Handcrafted Haven - Unique Artisan Marketplace",
  description: "Discover unique handcrafted treasures from talented artisans. Support local creators and find one-of-a-kind handmade items that tell a story.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <SkipLink />
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <OrderProvider>
                <SearchProvider>
                  <Header />
                  <main id="main-content" className="min-h-screen">
                    {children}
                  </main>
                  <Footer />
                </SearchProvider>
              </OrderProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
