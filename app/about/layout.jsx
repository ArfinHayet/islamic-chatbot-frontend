export const metadata = {
  title: "About | Noor AI — Islamic Chatbot",
  description:
    "Learn about Noor AI — a bilingual Islamic knowledge assistant built to answer questions about the Quran, Hadith, Islamic history, and daily practices.",
  openGraph: {
    title: "About | Noor AI — Islamic Chatbot",
    description:
      "Learn about Noor AI — a bilingual Islamic knowledge assistant built to answer questions about the Quran, Hadith, Islamic history, and daily practices.",
    url: "https://www.noorai.online/about",
    siteName: "Noor AI",
    images: [
      {
        url: "https://www.noorai.online/favicon-social.png",
        width: 1200,
        height: 630,
        alt: "About Noor AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Noor AI — Islamic Chatbot",
    description:
      "Learn about Noor AI — a bilingual Islamic knowledge assistant built to answer questions about the Quran, Hadith, and daily Islamic practices.",
    images: ["https://www.noorai.online/favicon-social.png"],
  },
};

export default function AboutLayout({ children }) {
  return children;
}
