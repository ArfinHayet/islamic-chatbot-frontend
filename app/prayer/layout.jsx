export const metadata = {
  title: "Prayer Times | Noor AI — Islamic Chatbot",
  description:
    "Get accurate daily prayer times, Qibla direction, and Islamic calendar information powered by Noor AI — your bilingual Islamic assistant.",
  openGraph: {
    title: "Prayer Times | Noor AI — Islamic Chatbot",
    description:
      "Get accurate daily prayer times, Qibla direction, and Islamic calendar information powered by Noor AI — your bilingual Islamic assistant.",
    url: "https://www.noorai.online/prayer",
    siteName: "Noor AI",
    images: [
      {
        url: "https://www.noorai.online/favicon-social.png",
        width: 1200,
        height: 630,
        alt: "Prayer Times — Noor AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prayer Times | Noor AI — Islamic Chatbot",
    description:
      "Accurate daily prayer times, Qibla direction, and Islamic calendar — powered by Noor AI.",
    images: ["https://www.noorai.online/favicon-social.png"],
  },
};

export default function PrayerLayout({ children }) {
  return children;
}
