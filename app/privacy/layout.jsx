export const metadata = {
  title: "Privacy Policy | Noor AI",
  description:
    "Learn how Noor AI handles chat messages, app preferences, service data, and privacy for the bilingual Islamic assistant.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | Noor AI",
    description:
      "Learn how Noor AI handles chat messages, app preferences, service data, and privacy for the bilingual Islamic assistant.",
    url: "https://www.noorai.online/privacy",
    siteName: "Noor AI",
    images: [{ url: "https://www.noorai.online/favicon-social.png", width: 1200, height: 630, alt: "Noor AI Privacy" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Noor AI",
    description: "Noor AI privacy policy for chat, preferences, and service data.",
    images: ["https://www.noorai.online/favicon-social.png"],
  },
};

export default function PrivacyLayout({ children }) {
  return children;
}
