import { Poppins } from "next/font/google";
import "./globals.css";
import BlockchainProvider from "@/providers/blockchain-provider";
import Header from "@/common-components/globals/header";
import { Toaster } from "sonner";
import "react-circular-progressbar/dist/styles.css";
import { headers } from "next/headers";
import Footer from "@/common-components/globals/footer";
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title:
    "NOWA – AI-Powered Crypto Price Prediction Platform | Predict & Earn with $NOW Token",
  description:
    "Join NOWA, the leading AI-powered crypto prediction app on Binance Smart Chain. Beat AI forecasts, stake $NOW tokens, and earn crypto rewards. Participate in global competitions today!",
  keywords: [
    "blockchain",
    "security",
    "crypto",
    "decentralized",
    "web3",
    "finance",
    "exchange",
    "bitcoin",
    "binance",
  ],
  icons: {
    icon: "/assets/brand/onlyLogo.png",
    apple: "/assets/brand/onlyLogo.png",
    shortcut: "/assets/brand/onlyLogo.png",
  },
  other: {
    rel: "mask-icon",
    url: "/assets/brand/onlyLogo.png",
  },

  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default async function RootLayout({ children }) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <BlockchainProvider cookies={cookies}>
          <Header />
          {children}
          <Toaster theme="dark" />
          <Footer />
        </BlockchainProvider>
      </body>
    </html>
  );
}
