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
  ur: {
    eyebrow: "رازداری",
    title: "رازداری کی پالیسی",
    subtitle:
      "یہ پالیسی وضاحت کرتی ہے کہ Noor AI ایپ کا تجربہ فراہم کرنے کے لیے کون سی معلومات استعمال کرتا ہے اور سروس استعمال کرتے وقت صارفین کو رازداری کے بارے میں کیسے سوچنا چاہیے۔",
    updated: "۱۶ مئی ۲۰۲۶",
    sections: [
      {
        title: "آپ کی فراہم کردہ معلومات",
        body:
          "جب آپ چیٹ استعمال کرتے ہیں تو آپ کا لکھا ہوا پیغام بیک اینڈ API کو بھیجا جاتا ہے تاکہ Noor AI جواب تیار کر سکے۔ پاس ورڈ، ذاتی دستاویزات، ادائیگی کی معلومات یا انتہائی حساس ذاتی تفصیلات شیئر کرنے سے گریز کریں۔",
      },
      {
        title: "ایپ کی ترجیحات",
        body:
          "زبان اور تھیم کی ترجیحات آپ کے براؤزر میں مقامی طور پر محفوظ ہو سکتی ہیں تاکہ ایپ آپ کا منتخب کردہ تجربہ یاد رکھ سکے۔",
      },
      {
        title: "سروس ڈیٹا",
        items: [
          "چیٹ سیشنز کے لیے ایپ ایک خودکار طور پر تیار کردہ user identifier استعمال کر سکتی ہے۔",
          "نماز کے اوقات کا فیچر Noor AI بیک اینڈ سے اوقات کا ڈیٹا حاصل کر سکتا ہے۔",
          "manifest، sitemap، robots.txt اور llms.txt جیسی عوامی فائلوں تک براؤزرز اور کرالرز رسائی حاصل کر سکتے ہیں۔",
        ],
      },
      {
        title: "فریق ثالث کے سسٹمز",
        body:
          "Noor AI کو Vercel جیسے ویب انفراسٹرکچر کے ذریعے ہوسٹ اور فراہم کیا جاتا ہے اور درخواستوں کی پروسیسنگ کے لیے بیک اینڈ سروسز استعمال ہو سکتی ہیں۔ ان سسٹمز کو ایپ چلانے کے لیے ضروری تکنیکی ڈیٹا موصول ہو سکتا ہے۔",
      },
      {
        title: "رابطہ",
        body: "رازداری سے متعلق سوالات کے لیے arfinhayet786@gmail.com پر رابطہ کریں۔",
      },
    ],
  },
};

export default function PrivacyPage() {
  const { lang } = useLocale();
  return <InfoPage {...CONTENT[lang]} />;
}
