"use client";

import { InfoPage } from "@/components/ui/InfoPage";
import { useLocale } from "@/context/LocaleContext";

const CONTENT = {
  en: {
    eyebrow: "Privacy",
    title: "Privacy Policy",
    subtitle:
      "This policy explains what information Noor AI uses to provide the app experience and how users should think about privacy while using the service.",
    updated: "May 16, 2026",
    sections: [
      {
        title: "Information You Provide",
        body:
          "When you use the chat, the message you type is sent to the backend API so Noor AI can generate a response. Avoid sharing passwords, private documents, payment information, or highly sensitive personal details.",
      },
      {
        title: "App Preferences",
        body:
          "Language and theme preferences may be stored locally in your browser so the app can remember your selected experience.",
      },
      {
        title: "Service Data",
        items: [
          "The app may use a generated user identifier to support chat sessions.",
          "Prayer-time features may request timing data from the Noor AI backend.",
          "Public assets such as the manifest, sitemap, robots.txt, and llms.txt may be accessed by browsers and crawlers.",
        ],
      },
      {
        title: "Third-Party Systems",
        body:
          "Noor AI is hosted and delivered through web infrastructure such as Vercel and may use backend services to process requests. Those systems may receive technical data needed to serve the app.",
      },
      {
        title: "Contact",
        body: "For privacy questions, contact us at arfinhayet786@gmail.com.",
      },
    ],
  },
  bn: {
    eyebrow: "গোপনীয়তা",
    title: "গোপনীয়তা নীতি",
    subtitle: "Noor AI কী তথ্য ব্যবহার করে এবং সেবা ব্যবহার করার সময় গোপনীয়তা সম্পর্কে কীভাবে ভাববেন তা এখানে ব্যাখ্যা করা হয়েছে।",
    updated: "১৬ মে ২০২৬",
    sections: [
      {
        title: "আপনার প্রদান করা তথ্য",
        body:
          "চ্যাট ব্যবহার করলে আপনার লেখা বার্তা ব্যাকএন্ড API-তে পাঠানো হয়, যাতে Noor AI উত্তর তৈরি করতে পারে। পাসওয়ার্ড, ব্যক্তিগত নথি, পেমেন্ট তথ্য বা অত্যন্ত সংবেদনশীল ব্যক্তিগত তথ্য শেয়ার করবেন না।",
      },
      {
        title: "অ্যাপ পছন্দ",
        body: "ভাষা ও থিম পছন্দ আপনার ব্রাউজারে স্থানীয়ভাবে সংরক্ষণ হতে পারে, যাতে অ্যাপ আপনার নির্বাচিত অভিজ্ঞতা মনে রাখতে পারে।",
      },
      {
        title: "সেবা-সংক্রান্ত তথ্য",
        items: [
          "চ্যাট সেশন সমর্থনের জন্য অ্যাপ একটি জেনারেটেড user identifier ব্যবহার করতে পারে।",
          "নামাজের সময় ফিচার Noor AI ব্যাকএন্ড থেকে সময়সূচি ডেটা আনতে পারে।",
          "manifest, sitemap, robots.txt এবং llms.txt-এর মতো পাবলিক ফাইল ব্রাউজার ও ক্রলার দ্বারা অ্যাক্সেস হতে পারে।",
        ],
      },
      {
        title: "তৃতীয় পক্ষের সিস্টেম",
        body:
          "Noor AI Vercel-এর মতো ওয়েব অবকাঠামোর মাধ্যমে হোস্ট ও পরিবেশিত হয় এবং অনুরোধ প্রক্রিয়াকরণে ব্যাকএন্ড সেবা ব্যবহার করতে পারে। এসব সিস্টেম অ্যাপ চালাতে প্রয়োজনীয় প্রযুক্তিগত তথ্য পেতে পারে।",
      },
      {
        title: "যোগাযোগ",
        body: "গোপনীয়তা সম্পর্কিত প্রশ্ন থাকলে arfinhayet786@gmail.com ঠিকানায় যোগাযোগ করুন।",
      },
    ],
  },
};

export default function PrivacyPage() {
  const { lang } = useLocale();
  return <InfoPage {...CONTENT[lang]} />;
}
