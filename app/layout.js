import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'OmTur — Brukte klær og utstyr til sport, fritid og friluftsliv',
  description: 'Kjøp og selg brukte klær og utstyr til sport, fritid og friluftsliv på Helgeland. KI analyserer utstyret og skriver annonsen automatisk.',
  other: {
    "facebook-domain-verification": "dqr93dmehhikavxt51chioyr8ofbrm",
  },
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
