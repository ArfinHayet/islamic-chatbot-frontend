export const metadata = {
  title: "FAQ | Noor AI",
  description:
    "Frequently asked questions about Noor AI, Islamic AI guidance, duas, prayer times, languages, and answer verification.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ | Noor AI",
    description:
      "Frequently asked questions about Noor AI, Islamic AI guidance, duas, prayer times, languages, and answer verification.",
    url: "https://www.noorai.online/faq",
    siteName: "Noor AI",
    images: [{ url: "https://www.noorai.online/favicon-social.png", width: 1200, height: 630, alt: "Noor AI FAQ" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Noor AI",
    description: "Common questions about Noor AI and its Islamic assistant features.",
    images: ["https://www.noorai.online/favicon-social.png"],
  },
};

export default function FaqLayout({ children }) {
  return children;
}
