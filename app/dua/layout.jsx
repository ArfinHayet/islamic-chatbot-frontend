export const metadata = {
  title: "Dua | Noor AI — Islamic Chatbot",
  description:
    "Explore authentic duas from the Quran and Sunnah. Get AI-powered guidance on supplications for daily life, special occasions, and spiritual growth.",
  openGraph: {
    title: "Dua | Noor AI — Islamic Chatbot",
    description:
      "Explore authentic duas from the Quran and Sunnah. Get AI-powered guidance on supplications for daily life, special occasions, and spiritual growth.",
    url: "https://www.noorai.online/dua",
    siteName: "Noor AI",
    images: [
      {
        url: "https://www.noorai.online/favicon-social.png",
        width: 1200,
        height: 630,
        alt: "Duas — Noor AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dua | Noor AI — Islamic Chatbot",
    description:
      "Explore authentic duas from the Quran and Sunnah with AI-powered guidance for daily life and spiritual growth.",
    images: ["https://www.noorai.online/favicon-social.png"],
  },
};

export default function DuaLayout({ children }) {
  return children;
}
