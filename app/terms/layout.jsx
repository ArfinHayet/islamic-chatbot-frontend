export const metadata = {
  title: "Terms and Conditions | Noor AI",
  description:
    "Read the Noor AI terms and conditions for using the bilingual Islamic chatbot, dua, and prayer-time features.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms and Conditions | Noor AI",
    description:
      "Read the Noor AI terms and conditions for using the bilingual Islamic chatbot, dua, and prayer-time features.",
    url: "https://www.noorai.online/terms",
    siteName: "Noor AI",
    images: [{ url: "https://www.noorai.online/favicon-social.png", width: 1200, height: 630, alt: "Noor AI Terms" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions | Noor AI",
    description: "Noor AI terms and conditions for using the Islamic assistant.",
    images: ["https://www.noorai.online/favicon-social.png"],
  },
};

export default function TermsLayout({ children }) {
  return children;
}
