"use client";

import { InfoPage } from "@/components/ui/InfoPage";
import { useLocale } from "@/context/LocaleContext";

const CONTENT = {
  en: {
    eyebrow: "Help",
    title: "Frequently Asked Questions",
    subtitle: "Answers to common questions about Noor AI, Islamic guidance, duas, prayer times, and app usage.",
    sections: [
      {
        title: "What is Noor AI?",
        body:
          "Noor AI is a bilingual Islamic AI assistant that helps users ask questions, read daily duas, and view prayer-time information in English and Bangla.",
      },
      {
        title: "Can Noor AI give fatwas?",
        body:
          "No. Noor AI can provide educational information, but personal rulings and fatwas should come from qualified scholars who understand your context.",
      },
      {
        title: "Which languages are supported?",
        body: "The app interface supports English and Bangla. Chat answers may also be requested in either language.",
      },
      {
        title: "Where do the duas come from?",
        body:
          "The dua page contains a curated local collection with Arabic text, transliteration, sources, and English/Bangla meanings.",
      },
      {
        title: "Why should I verify answers?",
        body:
          "AI-generated answers can contain mistakes or omit scholarly differences. Always verify sensitive religious matters with trusted scholars and authentic references.",
      },
    ],
  },
  bn: {
    eyebrow: "সহায়তা",
    title: "সাধারণ প্রশ্ন",
    subtitle: "Noor AI, ইসলামিক নির্দেশনা, দোয়া, নামাজের সময় এবং অ্যাপ ব্যবহার সম্পর্কে সাধারণ প্রশ্নের উত্তর।",
    sections: [
      {
        title: "Noor AI কী?",
        body: "Noor AI একটি দ্বিভাষিক ইসলামিক AI সহায়ক, যা ইংরেজি ও বাংলায় প্রশ্ন, দৈনন্দিন দোয়া এবং নামাজের সময় সম্পর্কে সাহায্য করে।",
      },
      {
        title: "Noor AI কি ফতোয়া দিতে পারে?",
        body: "না। Noor AI শিক্ষামূলক তথ্য দিতে পারে, তবে ব্যক্তিগত ফতোয়া বা রুলিং যোগ্য আলেমের কাছ থেকে নেওয়া উচিত।",
      },
      {
        title: "কোন ভাষা সমর্থিত?",
        body: "অ্যাপ ইন্টারফেস ইংরেজি ও বাংলা সমর্থন করে। চ্যাট উত্তরও এই ভাষাগুলোর যেকোনো একটিতে চাইতে পারেন।",
      },
      {
        title: "দোয়াগুলো কোথা থেকে এসেছে?",
        body: "দোয়া পেজে আরবি টেক্সট, উচ্চারণ, সূত্র এবং ইংরেজি/বাংলা অর্থসহ একটি নির্বাচিত লোকাল সংগ্রহ রয়েছে।",
      },
      {
        title: "উত্তর যাচাই করা কেন দরকার?",
        body: "AI-জেনারেটেড উত্তরে ভুল থাকতে পারে বা মতভেদ বাদ পড়তে পারে। সংবেদনশীল ধর্মীয় বিষয়ে বিশ্বস্ত আলেম ও নির্ভরযোগ্য রেফারেন্স থেকে যাচাই করুন।",
      },
    ],
  },
};

export default function FaqPage() {
  const { lang } = useLocale();
  return <InfoPage {...CONTENT[lang]} />;
}
