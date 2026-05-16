export const metadata = {
  title: "Settings | Noor AI — Islamic Chatbot",
  description:
    "Customize your Noor AI experience — choose your preferred language, theme, and notification preferences for your Islamic knowledge assistant.",
  openGraph: {
    title: "Settings | Noor AI — Islamic Chatbot",
    description:
      "Customize your Noor AI experience — choose your preferred language, theme, and notification preferences for your Islamic knowledge assistant.",
    url: "https://www.noorai.online/settings",
    siteName: "Noor AI",
    images: [
      {
        url: "https://www.noorai.online/favicon-social.png",
        width: 1200,
        height: 630,
        alt: "Settings — Noor AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Settings | Noor AI — Islamic Chatbot",
    description:
      "Customize your Noor AI experience — language, theme, and notification preferences.",
    images: ["https://www.noorai.online/favicon-social.png"],
  },
};

export default function SettingsLayout({ children }) {
  return children;
}
