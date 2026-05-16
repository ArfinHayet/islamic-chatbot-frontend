export const metadata = {
  title: "Chat | Noor AI — Islamic Chatbot",
  description:
    "Ask your Islamic questions and get AI-powered answers based on the Quran, Hadith, and authentic Islamic scholarship — in English and Bangla.",
  openGraph: {
    title: "Chat | Noor AI — Islamic Chatbot",
    description:
      "Ask your Islamic questions and get AI-powered answers based on the Quran, Hadith, and authentic Islamic scholarship — in English and Bangla.",
    url: "https://www.noorai.online/chat",
    siteName: "Noor AI",
    images: [
      {
        url: "https://www.noorai.online/favicon-social.png",
        width: 1200,
        height: 630,
        alt: "Noor AI Chat",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat | Noor AI — Islamic Chatbot",
    description:
      "Ask Islamic questions and get AI-powered answers from the Quran and Hadith — in English and Bangla.",
    images: ["https://www.noorai.online/favicon-social.png"],
  },
};

export default function ChatLayout({ children }) {
  return children;
}
