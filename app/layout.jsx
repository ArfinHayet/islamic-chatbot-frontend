import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import { AppShell } from "@/components/AppShell";
import { AllProviders } from "@/components/providers/AllProviders";
import "./globals.css";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export const metadata = {
  metadataBase: new URL("https://www.noorai.online"),
  title: {
    default: "Noor AI — Islamic Chatbot for Quran, Hadith, Prayer Times & Duas",
    template: "%s | Noor AI",
  },
  description:
    "Noor AI is a bilingual Islamic AI assistant for Quran and Hadith questions, daily duas, prayer times, Islamic guidance, and reminders in English and Bangla.",
  applicationName: "Noor AI",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: [
    "Noor AI",
    "Islamic chatbot",
    "Islamic AI assistant",
    "Quran AI",
    "Hadith AI",
    "Islamic questions",
    "Prayer times",
    "Daily duas",
    "Bangla Islamic chatbot",
    "Muslim AI assistant",
  ],
  authors: [{ name: "Noor AI", url: "https://www.noorai.online" }],
  creator: "Noor AI",
  publisher: "Noor AI",
  category: "religion",
  classification: "Islamic education and prayer assistant",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      bn: "/",
      "x-default": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googleba05054e4b179638.html",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Noor AI — Islamic Chatbot for Quran, Hadith, Prayer Times & Duas",
    description:
      "Ask Islamic questions, explore authentic duas, check prayer times, and get bilingual guidance grounded in Quran and Hadith.",
    url: "https://www.noorai.online",
    siteName: "Noor AI",
    images: [
      {
        url: "https://www.noorai.online/favicon-social.png",
        width: 1200,
        height: 630,
        alt: "Noor AI — Islamic Chatbot",
      },
    ],
    locale: "en_US",
    alternateLocale: ["bn_BD"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noor AI — Islamic Chatbot",
    description:
      "A bilingual Islamic AI assistant for Quran, Hadith, prayer times, duas, and daily guidance in English and Bangla.",
    images: ["https://www.noorai.online/favicon-social.png"],
  },
  appleWebApp: {
    capable: true,
    title: "Noor AI",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f6e56",
  colorScheme: "light dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>
        <ServiceWorkerRegistrar />
        <AllProviders>
          <AppShell>{children}</AppShell>
        </AllProviders>
      </body>
    </html>
  );
}
