"use client";

import { InfoPage } from "@/components/ui/InfoPage";
import { useLocale } from "@/context/LocaleContext";

const CONTENT = {
  en: {
    eyebrow: "Legal",
    title: "Terms and Conditions",
    subtitle:
      "These terms explain how you may use Noor AI and what to expect from this Islamic educational assistant.",
    updated: "May 16, 2026",
    sections: [
      {
        title: "Educational Use",
        body:
          "Noor AI provides Islamic information for learning and reflection. It is not a replacement for a qualified scholar, mufti, imam, lawyer, doctor, or other professional advisor.",
      },
      {
        title: "User Responsibilities",
        items: [
          "Use the app respectfully and lawfully.",
          "Do not rely on generated answers as personal fatwas or final religious rulings.",
          "Verify sensitive matters with qualified scholarship and trusted sources.",
          "Do not attempt to misuse, disrupt, reverse engineer, or overload the service.",
        ],
      },
      {
        title: "AI-Generated Content",
        body:
          "Responses may be generated or assisted by AI and can contain mistakes, omissions, or differences of scholarly interpretation. Noor AI aims to be helpful, but accuracy is not guaranteed.",
      },
      {
        title: "Availability",
        body:
          "We may update, pause, limit, or discontinue parts of the service at any time. Features such as chat, prayer times, or duas may depend on third-party systems or network availability.",
      },
      {
        title: "Contact",
        body: "For questions about these terms, contact us at arfinhayet786@gmail.com.",
      },
    ],
  },
  bn: {
    eyebrow: "আইনি তথ্য",
    title: "শর্তাবলি",
    subtitle: "Noor AI ব্যবহার করার নিয়ম এবং এই ইসলামিক শিক্ষা সহায়ক থেকে কী প্রত্যাশা করবেন তা এখানে ব্যাখ্যা করা হয়েছে।",
    updated: "১৬ মে ২০২৬",
    sections: [
      {
        title: "শিক্ষামূলক ব্যবহার",
        body:
          "Noor AI শেখা ও চিন্তার জন্য ইসলামিক তথ্য প্রদান করে। এটি কোনো যোগ্য আলেম, মুফতি, ইমাম, আইনজীবী, ডাক্তার বা পেশাদার পরামর্শকের বিকল্প নয়।",
      },
      {
        title: "ব্যবহারকারীর দায়িত্ব",
        items: [
          "অ্যাপটি সম্মানজনক ও বৈধভাবে ব্যবহার করুন।",
          "জেনারেটেড উত্তরকে ব্যক্তিগত ফতোয়া বা চূড়ান্ত ধর্মীয় সিদ্ধান্ত হিসেবে গ্রহণ করবেন না।",
          "সংবেদনশীল বিষয়ে যোগ্য আলেম ও নির্ভরযোগ্য উৎস থেকে যাচাই করুন।",
          "সেবা অপব্যবহার, ব্যাহত, রিভার্স ইঞ্জিনিয়ার বা অতিরিক্ত চাপ দেওয়ার চেষ্টা করবেন না।",
        ],
      },
      {
        title: "AI-জেনারেটেড কনটেন্ট",
        body:
          "উত্তরগুলো AI দ্বারা তৈরি বা সহায়তাপ্রাপ্ত হতে পারে এবং তাতে ভুল, ঘাটতি বা মতভেদ থাকতে পারে। Noor AI সহায়ক হতে চেষ্টা করে, তবে নির্ভুলতার নিশ্চয়তা দেয় না।",
      },
      {
        title: "সেবার প্রাপ্যতা",
        body:
          "আমরা যেকোনো সময় সেবার অংশ আপডেট, বিরতি, সীমিত বা বন্ধ করতে পারি। চ্যাট, নামাজের সময় বা দোয়ার মতো ফিচার তৃতীয় পক্ষের সিস্টেম বা নেটওয়ার্কের উপর নির্ভর করতে পারে।",
      },
      {
        title: "যোগাযোগ",
        body: "এই শর্তাবলি সম্পর্কে প্রশ্ন থাকলে arfinhayet786@gmail.com ঠিকানায় যোগাযোগ করুন।",
      },
    ],
  },
};

export default function TermsPage() {
  const { lang } = useLocale();
  return <InfoPage {...CONTENT[lang]} />;
}
