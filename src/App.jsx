// ============================================================
// Islamic AI Chatbot — Complete UI (Single Component)
// Sections: Chat, History, Profile, Settings
// Features: Light/Dark mode, Bangla/English i18n, Responsive
// ============================================================

import axios from "axios";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

import "primeicons/primeicons.css";

// ── CONSTANTS ────────────────────────────────────────────────
const API_URL = "https://islamic-chatbot-lac.vercel.app/api/v1/chat/stream";
// USER_ID is generated per chat session to keep chat contexts isolated
const USER_ID = null;

// ── TRANSLATIONS (i18n) ──────────────────────────────────────
// All UI strings live here. To add a new language, duplicate
// one of these objects and translate every value.
const TRANSLATIONS = {
  bn: {
    appName: "Noor AI",
    appTagline: "Chatbot",
    appSubtitle: "ইসলামিক জ্ঞানের আলোকে পথ দেখাই",
    version: "ইসলামিক AI চ্যাটবট v2.0",
    bismillah: "বিসমিল্লাহির রাহমানির রাহিম",
    chat: "চ্যাট",
    history: "ইতিহাস",
    profile: "প্রোফাইল",
    settings: "সেটিংস",
    newChat: "নতুন চ্যাট",
    darkMode: "ডার্ক মোড",
    lightMode: "লাইট মোড",
    member: "সদস্য",
    welcomeTitle: "Noor AI",
    welcomeSubtitle: "ইসলামিক বিষয়ে জ্ঞান অর্জনে আপনাকে সহায়তা করতে সদা প্রস্তুত",
    placeholder: "একটি বার্তা লিখুন...",
    disclaimer: "এই চ্যাটবট ইসলামিক তথ্য প্রদান করে। সর্বদা বিশেষজ্ঞ আলেমের পরামর্শ নিন।",
    greeting:
      "আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু! আমি একটি ইসলামিক AI সহায়তাকারী। কুরআন, হাদিস ও ইসলামিক বিষয়ে আপনার যেকোনো প্রশ্ন করুন।",
    errorMsg: "দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।",
    resetMsg: "আবার শুরু করুন। আপনার যেকোনো ইসলামিক প্রশ্ন জিজ্ঞেস করুন।",
    active: "সক্রিয়",
    quickPrompts: [
      "আজকের নামাজের সময় কত ?",
      "নামাজের সঠিক নিয়ম ও পদ্ধতি কী?",
      "রমজান মাসের ফজিলত ও আমল",
      "যাকাত কীভাবে হিসাব করবো?",
      "কুরআন তেলাওয়াতের আদব ও ফজিলত",
      "হালাল ও হারাম উপার্জনের পার্থক্য",
    ],
    historyTitle: "চ্যাট ইতিহাস",
    historySubtitle: "আপনার আগের সকল কথোপকথন",
    noHistory: "কোনো ইতিহাস নেই",
    profileTitle: "প্রোফাইল",
    userName: "আব্দুল্লাহ রহমান",
    userEmail: "abdullah@example.com",
    membershipBasic: "বেসিক সদস্যতা",
    totalQuestions: "মোট প্রশ্ন",
    thisWeek: "এই সপ্তাহে",
    sessions: "সেশন",
    badgesTitle: "অর্জিত ব্যাজ",
    badge1: "নিয়মিত ব্যবহারকারী",
    badge2: "জ্ঞানপিপাসু",
    badge3: "বিশ্বস্ত সদস্য",
    editProfile: "প্রোফাইল সম্পাদনা",
    changePassword: "পাসওয়ার্ড পরিবর্তন",
    deleteAccount: "অ্যাকাউন্ট মুছুন",
    settingsTitle: "সেটিংস",
    settingsSubtitle: "আপনার অভিজ্ঞতা কাস্টমাইজ করুন",
    groupGeneral: "সাধারণ সেটিংস",
    groupIslamic: "ইসলামিক পছন্দ",
    groupDisplay: "উপস্থাপনা",
    language: "ভাষা",
    languageDesc: "ইন্টারফেস ভাষা",
    notifications: "বিজ্ঞপ্তি",
    notificationsDesc: "পুশ নোটিফিকেশন",
    madhab: "মাযহাব",
    madhabDesc: "ফিকহ অনুসরণ",
    saveHistory: "ইতিহাস সংরক্ষণ",
    saveHistoryDesc: "চ্যাট লগ রাখুন",
    darkModeLabel: "ডার্ক মোড",
    darkModeDesc: "অন্ধকার থিম",
    madhabHanafi: "হানাফি",
    madhabMaliki: "মালিকি",
    madhabShafii: "শাফেয়ি",
    madhabHanbali: "হাম্বলি",
    langSelected: "বাংলা ভাষা নির্বাচিত",
    statsValues: ["১২৭", "১৮", "৪২"],

    prayerTitle: "নামাজের সময়",
    prayerSubtitle: "আজকের নামাজের সময়সূচি",
    prayerNames: { Fajr: "ফজর", Sunrise: "সূর্যোদয়", Dhuhr: "যোহর", Asr: "আসর", Maghrib: "মাগরিব", Isha: "এশা" },
    prayerLoading: "লোড হচ্ছে...",
    prayerError: "সময় লোড করতে সমস্যা হয়েছে",
    prayerRetry: "আবার চেষ্টা করুন",
    nextPrayer: "পরবর্তী নামাজ",
    currentPrayer: "এখন",
    hijriDate: "হিজরি তারিখ",
about: "আমাদের সম্পর্কে",
aboutLabel: "আমাদের সম্পর্কে",
aboutAppTitle: "Noor AI — ইসলামিক জ্ঞান সহায়তাকারী",
aboutAppDesc: "Noor AI একটি দ্বিভাষিক ইসলামিক চ্যাটবট যা মুসলিমদের কুরআন, হাদিস ও ইসলামিক ফিকহ সহজে অন্বেষণে সহায়তা করে। আধুনিক AI দ্বারা চালিত এই বট বাংলা ও ইংরেজিতে নির্ভুলভাবে প্রশ্নের উত্তর দেয়।",
aboutTags: ["কুরআন ও হাদিস", "দ্বিভাষিক (EN / BN)", "নামাজের সময়", "ফিকহ পছন্দ", "AI চালিত", "v2.0"],
aboutDevsLabel: "ডেভেলপারদের সাথে পরিচিত হন",
aboutDevsSubtitle: "আমরা বুদ্ধিমান সিস্টেম তৈরি করি — AI চ্যাটবট থেকে সম্পূর্ণ অটোমেশন পাইপলাইন পর্যন্ত।",
aboutDev1Name: "আরফিন হায়েত",
aboutDev1Role: "AI ইঞ্জিনিয়ার",
aboutDev1Bio: "AI ইন্টিগ্রেশন, LLM-চালিত অ্যাপ্লিকেশন এবং অত্যাধুনিক মডেল ব্যবহার করে জটিল ব্যবসায়িক ওয়ার্কফ্লো অটোমেট করায় বিশেষজ্ঞ।",
aboutDev2Name: "রুম্মান",
aboutDev2Role: "ফুল-স্ট্যাক ডেভেলপার",
aboutDev2Bio: "রেসপন্সিভ আধুনিক UI এবং স্কেলেবল ব্যাকএন্ড সিস্টেম ডিজাইনে দক্ষ। ধারণাকে পরিশীলিত পণ্যে রূপান্তর করেন।",
aboutWeDoTitle: "আমরা আপনার জন্য কী করতে পারি",
aboutWeDoDesc: "আমরা যেকোনো বিদ্যমান সিস্টেমকে AI-চালিত করতে পারি, অটোমেশন পাইপলাইন তৈরি করতে পারি এবং ঐতিহ্যবাহী ডেটাবেজকে ভেক্টর স্টোরে রূপান্তর করতে পারি — আপনার ডেটাকে AI-এর জন্য অর্থবহভাবে ব্যবহারযোগ্য করে তোলে। অটোমেট বা স্মার্ট করা যায় এমন যেকোনো কিছু আমরা তৈরি করি।",
aboutContactLabel: "যোগাযোগ করুন",
aboutContactSubtitle: "কোনো প্রজেক্ট মাথায় আছে? আমরা শুনতে আগ্রহী।",
contactName: "আপনার নাম",
contactEmail: "আপনার ইমেইল",
contactMessage: "আপনার প্রজেক্ট সম্পর্কে বলুন...",
contactSend: "বার্তা পাঠান",
contactSending: "পাঠানো হচ্ছে...",
contactSuccess: "বার্তা পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।",
contactError: "সব ঘর পূরণ করুন বা আবার চেষ্টা করুন।",
aboutSkills1: ["LLM / RAG", "অটোমেশন", "ভেক্টর DB", "Python"],
aboutSkills2: ["React", "Node.js", "UI/UX", "APIs"],

// en

  },
  en: {
    appName: "Noor AI",
    appTagline: "Chatbot",
    appSubtitle: "Guiding you through Islamic knowledge",
    version: "Noor AI Chatbot v2.0",
    bismillah: "Bismillahir Rahmanir Rahim",
    chat: "Chat",
    history: "History",
    profile: "Profile",
    settings: "Settings",
    newChat: "New Chat",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    member: "Member",
    welcomeTitle: "Noor AI",
    welcomeSubtitle: "Always ready to help you gain knowledge in Islamic matters",
    placeholder: "Type a message...",
    disclaimer: "This chatbot provides Islamic information. Always consult a qualified scholar.",
    greeting:
      "Assalamu Alaikum Wa Rahmatullahi Wa Barakatuh! I am an Islamic AI assistant. Ask me anything about the Quran, Hadith, and Islamic topics.",
    errorMsg: "Sorry, something went wrong. Please try again.",
    resetMsg: "Starting fresh. Ask me any Islamic question.",
    active: "Active",
    quickPrompts: [
      "What is the Salah time today?",
      "What are the rules and steps of Salah?",
      "What are the virtues and acts of Ramadan?",
      "How do I calculate my Zakat?",
      "What are the etiquettes of reciting the Quran?",
    ],
    historyTitle: "Chat History",
    historySubtitle: "All your previous conversations",
    noHistory: "No history yet",
    profileTitle: "Profile",
    userName: "Abdullah Rahman",
    userEmail: "abdullah@example.com",
    membershipBasic: "Basic Membership",
    totalQuestions: "Total Questions",
    thisWeek: "This Week",
    sessions: "Sessions",
    badgesTitle: "Earned Badges",
    badge1: "Regular User",
    badge2: "Knowledge Seeker",
    badge3: "Trusted Member",
    editProfile: "Edit Profile",
    changePassword: "Change Password",
    deleteAccount: "Delete Account",
    settingsTitle: "Settings",
    settingsSubtitle: "Customize your experience",
    groupGeneral: "General Settings",
    groupIslamic: "Islamic Preferences",
    groupDisplay: "Display",
    language: "Language",
    languageDesc: "Interface language",
    notifications: "Notifications",
    notificationsDesc: "Push notifications",
    madhab: "Madhab",
    madhabDesc: "Fiqh preference",
    saveHistory: "Save History",
    saveHistoryDesc: "Keep chat logs",
    darkModeLabel: "Dark Mode",
    darkModeDesc: "Dark theme",
    madhabHanafi: "Hanafi",
    madhabMaliki: "Maliki",
    madhabShafii: "Shafi'i",
    madhabHanbali: "Hanbali",
    langSelected: "English selected",
    statsValues: ["127", "18", "42"],

    prayerTitle: "Prayer Times",
    prayerSubtitle: "Today's prayer schedule",
    prayerNames: { Fajr: "Fajr", Sunrise: "Sunrise", Dhuhr: "Dhuhr", Asr: "Asr", Maghrib: "Maghrib", Isha: "Isha" },
    prayerLoading: "Loading...",
    prayerError: "Failed to load prayer times",
    prayerRetry: "Try Again",
    nextPrayer: "Next Prayer",
    currentPrayer: "Now",
    hijriDate: "Hijri Date",
    about: "About Us",
    aboutLabel: "About Us",
aboutAppTitle: "Noor AI — Islamic Knowledge Assistant",
aboutAppDesc: "Noor AI is a bilingual Islamic chatbot designed to help Muslims explore the Quran, Hadith, and Islamic jurisprudence with ease. Built with modern AI, it answers questions in both Bangla and English with accuracy and care.",
aboutTags: ["Quran & Hadith", "Bilingual (EN / BN)", "Prayer Times", "Fiqh Preferences", "AI Powered", "v2.0"],
aboutDevsLabel: "Meet the Developers",
aboutDevsSubtitle: "We build intelligent systems — from AI chatbots to full automation pipelines.",
aboutDev1Name: "Arfin Hayet",
aboutDev1Role: "AI Engineer",
aboutDev1Bio: "Specializes in AI integration, LLM-powered applications, and automating complex business workflows using cutting-edge models.",
aboutDev2Name: "Rumman",
aboutDev2Role: "Full-Stack Dev",
aboutDev2Bio: "Expert in designing responsive, modern UIs and scalable backend systems. Transforms ideas into polished user-facing products.",
aboutWeDoTitle: "What we can do for you",
aboutWeDoDesc: "We convert any existing system into an AI-powered one, build automation pipelines, and transform traditional databases into vector stores — making your data queryable by AI in a semantically rich way. If it can be automated or made smarter, we build it.",
aboutContactLabel: "Contact Us",
aboutContactSubtitle: "Have a project in mind? We'd love to hear from you.",
contactName: "Your name",
contactEmail: "Your email",
contactMessage: "Tell us about your project...",
contactSend: "Send Message",
contactSending: "Sending...",
contactSuccess: "Message sent! We'll get back to you soon.",
contactError: "Please fill all fields or try again.",
aboutSkills1: ["LLM / RAG", "Automation", "Vector DB", "Python"],
aboutSkills2: ["React", "Node.js", "UI/UX", "APIs"],
  },
};

// ── MOCK HISTORY (bilingual) ──────────────────────────────────
const MOCK_HISTORY_DATA = {
  bn: [
    { id: 1, title: "নামাজের ওয়াক্ত সম্পর্কে", preview: "ফজরের নামাজ কখন পড়তে হয়?", time: "২ ঘণ্টা আগে" },
    { id: 2, title: "যাকাতের নিসাব", preview: "সোনার যাকাতের নিসাব কত?", time: "গতকাল" },
    { id: 3, title: "রমজানের রোজা", preview: "রোজা রাখার নিয়ত কীভাবে করতে হয়?", time: "৩ দিন আগে" },
    { id: 4, title: "হজ্জের ফরজ", preview: "হজ্জের ফরজগুলো কী কী?", time: "১ সপ্তাহ আগে" },
    { id: 5, title: "দোয়া কুনুত", preview: "বিতর নামাজে দোয়া কুনুত পড়া কি ওয়াজিব?", time: "১ সপ্তাহ আগে" },
  ],
  en: [
    { id: 1, title: "About Prayer Times", preview: "When should Fajr prayer be performed?", time: "2 hours ago" },
    { id: 2, title: "Nisab for Zakat", preview: "What is the nisab for gold zakat?", time: "Yesterday" },
    { id: 3, title: "Fasting in Ramadan", preview: "How do you make the intention for fasting?", time: "3 days ago" },
    { id: 4, title: "Obligatory Acts of Hajj", preview: "What are the fard acts of Hajj?", time: "1 week ago" },
    { id: 5, title: "Dua Qunoot", preview: "Is Dua Qunoot wajib in Witr prayer?", time: "1 week ago" },
  ],
};

// ── SVG ICONS ────────────────────────────────────────────────
const Icons = {
  Info: () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="8" />
    <line x1="12" y1="12" x2="12" y2="16" />
  </svg>
),
  Chat: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  History: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Profile: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Settings: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Moon: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Sun: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Send: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Stop: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  ),
  Menu: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Close: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Plus: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Trash: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  ),
  Star: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Bell: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Globe: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Shield: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Book: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  Chevron: ({ dir = "right" }) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: dir === "left" ? "rotate(180deg)" : dir === "down" ? "rotate(90deg)" : "none" }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),

  Prayer: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
};

// ── ISLAMIC GEOMETRIC PATTERN ────────────────────────────────
function IslamicPattern({ dark }) {
  const c = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)";
  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="ip" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke={c} strokeWidth="0.8" />
          <circle cx="30" cy="30" r="12" fill="none" stroke={c} strokeWidth="0.8" />
          <path d="M30 18 L42 30 L30 42 L18 30 Z" fill="none" stroke={c} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ip)" />
    </svg>
  );
}

// ── AVATARS ───────────────────────────────────────────────────
function BotAvatar() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        flexShrink: 0,
        background: "linear-gradient(135deg, #1a6b5a 0%, #0d4a3e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(26,107,90,0.35)",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,255,255,0.15)" />
        <path
          d="M8 11.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM13 11.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"
          fill="white"
        />
        <path
          d="M9 15.5c0-.83 1.34-1.5 3-1.5s3 .67 3 1.5"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

function UserAvatar({ initials = "A" }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        flexShrink: 0,
        background: "linear-gradient(135deg, #2d5a8e 0%, #1a3a5c 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 600,
        color: "white",
        boxShadow: "0 2px 8px rgba(45,90,142,0.35)",
      }}
    >
      {initials}
    </div>
  );
}

// ── TYPING DOTS ───────────────────────────────────────────────
function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center", marginLeft: 4 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "currentColor",
            opacity: 0.4,
            animation: "typingBounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </span>
  );
}

// Extracted ChatSection to top-level to avoid remounting on App re-renders
function ChatSection({
  messages,
  theme,
  t,
  font,
  bottomRef,
  clearChat,
  textareaRef,
  handleInput,
  handleKeyDown,
  handleFocus,
  isLoading,
  input,
  handleStop,
  sendMessage,
  userInitials,
  copyMessage,
  copiedId,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Welcome */}
        {messages.length === 1 && (
          <div style={{ textAlign: "center", padding: "32px 20px 24px", animation: "fadeSlideUp .5s ease" }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                margin: "0 auto 16px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(26,107,90,0.3)",
              }}
            >
              <img src="/favicon.png" alt="Noor AI" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div
              style={{ fontSize: 20, fontWeight: 600, color: theme.text, marginBottom: 6, fontFamily: "Cinzel, serif" }}
            >
              {t("welcomeTitle")}
            </div>
            <div
              style={{
                fontSize: 13.5,
                color: theme.textSec,
                lineHeight: 1.7,
                maxWidth: 360,
                margin: "0 auto 20px",
              }}
            >
              {t("welcomeSubtitle")}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {t("quickPrompts").map((q, i) => (
                <button
                  key={i}
                  className="quick-chip"
                  onClick={() => sendMessage(q)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 99,
                    background: theme.bgSec,
                    border: `1px solid ${theme.borderMed}`,
                    color: theme.textSec,
                    fontSize: 12.5,
                    cursor: "pointer",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="msg-row"
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
            }}
          >
            {msg.role === "assistant" ? <BotAvatar /> : <UserAvatar initials={userInitials} />}
            <div
              style={{
                maxWidth: "min(76%,520px)",
                background: msg.role === "user" ? theme.userBubble : theme.botBubble,
                color: msg.role === "user" ? theme.userText : theme.text,
                padding: "11px 15px",
                borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                fontSize: 14,
                lineHeight: 1.75,
                border: msg.role === "assistant" ? `1px solid ${theme.border}` : "none",
                boxShadow: theme.shadow,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                position: "relative",
                paddingRight: 56, // space for copy button
              }}
            >
              <div style={{ display: "block", width: "100%", marginRight: msg.role == "assistent" ? "" : "12px" }}>
                {msg.content || (msg.streaming ? "" : "…")}
              </div>
              {msg.streaming && <TypingDots />}

              {msg.content && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    display: "flex",
                    gap: 4,
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyMessage && copyMessage(msg.id, msg.content);
                    }}
                    title="Copy message"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: copiedId === msg.id ? theme.accent : theme.textTer,
                      cursor: "pointer",
                      padding: 6,
                      borderRadius: 8,
                      fontSize: 15,
                    }}
                  >
                    <i className={copiedId === msg.id ? "pi pi-check" : "pi pi-copy"} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({ text: msg.content });
                      } else {
                        copyMessage && copyMessage(msg.id, msg.content);
                      }
                    }}
                    title="Share message"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: theme.textTer,
                      cursor: "pointer",
                      padding: 6,
                      borderRadius: 8,
                      fontSize: 15,
                    }}
                  >
                    <i className="pi pi-share-alt" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ padding: "12px 16px 14px", borderTop: `1px solid ${theme.border}`, background: theme.bgSec }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
            background: theme.inputBg,
            border: `1.5px solid ${theme.borderMed}`,
            borderRadius: 14,
            padding: "8px 8px 8px 14px",
            boxShadow:
              theme.shadow && !theme.shadow.includes("rgba(0,0,0,0.08)") ? "none" : "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={t("placeholder")}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            disabled={isLoading}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: theme.text,
              fontSize: 14,
              lineHeight: 1.6,
              minHeight: 24,
              maxHeight: 180,
              overflowY: "auto",
            }}
          />
          <button
            className="send-btn"
            onClick={isLoading ? handleStop : sendMessage}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
              background: isLoading ? "#c0392b" : input.trim() ? theme.accent : theme.bgTer,
              color: isLoading || input.trim() ? "white" : theme.textTer,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label={isLoading ? "Stop" : "Send"}
          >
            {isLoading ? <Icons.Stop /> : <Icons.Send />}
          </button>
        </div>
        <p
          style={{
            fontSize: 11,
            color: theme.textTer,
            textAlign: "center",
            marginTop: 8,
            lineHeight: 1.5,
          }}
        >
          {t("disclaimer")}
        </p>
      </div>
    </div>
  );
}

// ── LANGUAGE PILL TOGGLE ──────────────────────────────────────
// Compact BN / EN switcher used in sidebar and mobile header
function LangPill({ lang, setLang, theme }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: theme.bgTer,
        border: `1px solid ${theme.borderMed}`,
        borderRadius: 99,
        padding: 3,
        gap: 2,
      }}
    >
      {[
        { code: "bn", label: "বাং" },
        { code: "en", label: "EN" },
      ].map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          style={{
            padding: "4px 11px",
            borderRadius: 99,
            border: "none",
            cursor: "pointer",
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: 0.3,
            transition: "background 0.2s, color 0.2s",
            background: lang === code ? theme.accent : "transparent",
            color: lang === code ? "white" : theme.textSec,
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════
export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "bn");
  const [dark, setDark] = useState(() => localStorage.getItem("dark") === "true");

  const [section, setSection] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [settings, setSettings] = useState({ notifications: true, madhab: "hanafi", saveHistory: true });

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("dark", dark);
  }, [dark]);

  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstall(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setShowInstall(false);
    setInstallPrompt(null);
  };

  const genUserId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `user_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
  const [userId, setUserId] = useState(() => genUserId());

  const t = useCallback((key) => TRANSLATIONS[lang][key] ?? key, [lang]);

  const font = lang === "bn" ? "Hind Siliguri, sans-serif" : "DM Sans, sans-serif";

  const userInitials = lang === "bn" ? "আ" : "A";

  const [messages, setMessages] = useState([
    { id: 0, role: "assistant", content: TRANSLATIONS.bn.greeting, streaming: false },
  ]);

  // clipboard copy feedback
  const [copiedId, setCopiedId] = useState(null);
  const copyMessage = async (id, text) => {
    try {
      const str = String(text ?? "");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(str);
      } else {
        const ta = document.createElement("textarea");
        ta.value = str;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1400);
    } catch (e) {
      console.error("copy failed", e);
    }
  };

  // History list driven by language
  const [history, setHistory] = useState(MOCK_HISTORY_DATA.bn);

  // ── Sync history data when lang changes ───────────────────
  useEffect(() => {
    setHistory(MOCK_HISTORY_DATA[lang]);
  }, [lang]);

  // ── Auto-scroll on new messages ───────────────────────────
  const bottomRef = useRef(null);
  const scrollThrottleRef = useRef(0);
  useEffect(() => {
    const now = Date.now();
    const isStreaming = messages.some((m) => m.streaming);
    // When streaming, throttle scrolls to avoid frequent layout jumps.
    if (isStreaming) {
      if (now - scrollThrottleRef.current > 120) {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
        scrollThrottleRef.current = now;
      }
    } else {
      // final message: smooth scroll to show completion
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      scrollThrottleRef.current = now;
    }
  }, [messages]);

  // ── Facebook WebView viewport fix ───────────────────────
  const textareaRef = useRef(null);
  const abortRef = useRef(null);
  // Direct ref to the root div so we can set its styles immediately
  // (CSS variable updates have a render-frame delay; direct style is synchronous).
  const appRootRef = useRef(null);

  useEffect(() => {
    const syncVP = () => {
      if (window.visualViewport) {
        const vv = window.visualViewport;
        const h = Math.round(vv.height);
        const top = Math.round(vv.offsetTop);
        // Direct DOM update — takes effect this frame, no React reconcile needed.
        if (appRootRef.current) {
          appRootRef.current.style.height = `${h}px`;
          appRootRef.current.style.top = `${top}px`;
        }
        document.documentElement.style.setProperty("--app-height", `${h}px`);
        document.documentElement.style.setProperty("--vv-offset-top", `${top}px`);
      } else {
        const h = window.innerHeight;
        if (appRootRef.current) {
          appRootRef.current.style.height = `${h}px`;
          appRootRef.current.style.top = "0px";
        }
        document.documentElement.style.setProperty("--app-height", `${h}px`);
        document.documentElement.style.setProperty("--vv-offset-top", "0px");
      }
    };
    syncVP();
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", syncVP);
      vv.addEventListener("scroll", syncVP);
    }
    // Always add window.resize as a fallback — some Facebook WebView builds
    // don't fire visualViewport events but do fire window resize.
    window.addEventListener("resize", syncVP);
    return () => {
      if (vv) {
        vv.removeEventListener("resize", syncVP);
        vv.removeEventListener("scroll", syncVP);
      }
      window.removeEventListener("resize", syncVP);
    };
  }, []);

  // ── Theme tokens ──────────────────────────────────────────
  const theme = dark
    ? {
        bg: "#0e1117",
        bgSec: "#161b25",
        bgTer: "#1c2333",
        bgHov: "#222c3c",
        border: "rgba(255,255,255,0.07)",
        borderMed: "rgba(255,255,255,0.12)",
        text: "#e8edf5",
        textSec: "#8a96a8",
        textTer: "#5a6478",
        accent: "#2ecfa0",
        accentBg: "rgba(46,207,160,0.1)",
        accentBgHov: "rgba(46,207,160,0.18)",
        botBubble: "#1c2333",
        userBubble: "#1a3550",
        userText: "#c8e0f8",
        inputBg: "#1c2333",
        sidebarBg: "#0e1117",
        headerBg: "rgba(14,17,23,0.92)",
        shadow: "0 4px 24px rgba(0,0,0,0.4)",
        scrollbar: "#2a3445",
      }
    : {
        bg: "#f7f5f0",
        bgSec: "#ffffff",
        bgTer: "#eeeae2",
        bgHov: "#f0ebe0",
        border: "rgba(0,0,0,0.07)",
        borderMed: "rgba(0,0,0,0.12)",
        text: "#1a1f2e",
        textSec: "#6b7385",
        textTer: "#9ba3b5",
        accent: "#1a6b5a",
        accentBg: "rgba(26,107,90,0.08)",
        accentBgHov: "rgba(26,107,90,0.14)",
        botBubble: "#ffffff",
        userBubble: "#1a3550",
        userText: "#ffffff",
        inputBg: "#ffffff",
        sidebarBg: "#ffffff",
        headerBg: "rgba(255,255,255,0.92)",
        shadow: "0 4px 24px rgba(0,0,0,0.08)",
        scrollbar: "#d4cfc5",
      };

  // ── Global CSS ────────────────────────────────────────────
  const css = useMemo(
    () => `
    @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600&family=Cinzel:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:${theme.scrollbar};border-radius:99px}
    @keyframes typingBounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}
    @keyframes fadeSlideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    /* Use a simple fade for message updates to avoid vertical "shaking" when content streams */
    .msg-row{animation:fadeIn .18s ease forwards}
    .sidebar-item{transition:background .18s,color .18s}
    .sidebar-item:hover{background:${theme.accentBgHov}}
    .send-btn{transition:background .18s,transform .12s}
    .send-btn:hover{transform:scale(1.06)}
    .send-btn:active{transform:scale(.94)}
    .overlay{animation:fadeIn .2s ease}
    .hist-item{transition:background .15s;cursor:pointer}
    .hist-item:hover{background:${theme.bgHov}}
    .quick-chip{transition:background .15s,border-color .15s;cursor:pointer}
    .quick-chip:hover{background:${theme.accentBg};border-color:${theme.accent};color:${theme.accent}}
    textarea:focus{outline:none}
    textarea{resize:none}
    .toggle-switch{position:relative;display:inline-block;width:40px;height:22px}
    .toggle-switch input{opacity:0;width:0;height:0}
    .toggle-slider{position:absolute;inset:0;cursor:pointer;background:${theme.border};border-radius:22px;transition:.3s;border:1px solid ${theme.borderMed}}
    .toggle-slider:before{content:'';position:absolute;width:16px;height:16px;border-radius:50%;left:3px;bottom:3px;background:${theme.textSec};transition:.3s}
    .toggle-switch input:checked+.toggle-slider{background:${theme.accent};border-color:${theme.accent}}
    .toggle-switch input:checked+.toggle-slider:before{transform:translateX(18px);background:white}
    @media(min-width:768px){.desktop-only{display:flex !important}.mobile-only{display:none !important}}
    `,
    [dark, lang, theme.scrollbar],
  );

  // ── Streaming send (original logic preserved) ─────────────
  const sendMessage = useCallback(
    async (promptText) => {
      const text = (typeof promptText === "string" ? promptText : input).trim();
      if (!text || isLoading) return;
      const userMsg = { id: Date.now(), role: "user", content: text, streaming: false };
      const aId = Date.now() + 1;
      const assistantMsg = { id: aId, role: "assistant", content: "", streaming: true };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setIsLoading(true);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      abortRef.current = new AbortController();
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userId, message: text }),
          signal: abortRef.current.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        const isMeaningless = (s) => {
          if (!s || typeof s !== "string") return true;
          const trimmed = s.trim();
          return trimmed === "" || trimmed === "[DONE]";
        };
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const clean = acc
            .split("\n")
            .filter((l) => l.startsWith("data:"))
            .map((l) => l.replace(/^data:\s*/, ""))
            .map((l) => {
              try {
                const p = JSON.parse(l);
                if (p && p.type === "done") return "";
                return (
                  p.content ??
                  p.text ??
                  (p.delta && (p.delta.content ?? p.delta)) ??
                  p.choices?.[0]?.delta?.content ??
                  p.choices?.[0]?.text ??
                  ""
                );
              } catch {
                return l;
              }
            })
            .filter(Boolean)
            .join("");

          if (clean && !isMeaningless(clean)) {
            setMessages((prev) => prev.map((m) => (m.id === aId ? { ...m, content: clean } : m)));
          } else if (!clean && acc.replace(/\n/g, "").length > 0) {
            const raw = acc
              .split("\n")
              .filter((l) => l.startsWith("data:"))
              .map((l) => l.replace(/^data:\s*/, ""))
              .map((l) => l.trim())
              .filter((l) => l && l !== "[DONE]")
              .join("\n")
              .trim();
            if (raw && !isMeaningless(raw))
              setMessages((prev) => prev.map((m) => (m.id === aId ? { ...m, content: raw } : m)));
          }
        }
      } catch (err) {
        if (err.name !== "AbortError")
          setMessages((prev) =>
            prev.map((m) => (m.id === aId ? { ...m, content: t("errorMsg"), streaming: false } : m)),
          );
      } finally {
        // Mark streaming as finished and remove any assistant messages that are empty/whitespace
        setMessages((prev) =>
          prev
            .map((m) => (m.id === aId ? { ...m, streaming: false } : m))
            .filter((m) => !(m.role === "assistant" && (!m.content || String(m.content).trim() === ""))),
        );
        setIsLoading(false);
      }
    },
    [input, isLoading, lang],
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // const handleInput = (e) => {
  //   setInput(e.target.value);
  //   e.target.style.height = "auto";
  //   e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px";
  // };

  const handleStop = () => abortRef.current?.abort();

  const handleFocus = () => {
    // Facebook WebView: keyboard appearance often doesn't fire visualViewport/resize
    // events reliably, or fires them mid-animation with partial height.
    // Poll the viewport at several intervals until it stabilises.
    const poll = () => {
      if (window.visualViewport) {
        const vv = window.visualViewport;
        const h = Math.round(vv.height);
        const top = Math.round(vv.offsetTop);
        if (appRootRef.current) {
          appRootRef.current.style.height = `${h}px`;
          appRootRef.current.style.top = `${top}px`;
        }
        document.documentElement.style.setProperty("--app-height", `${h}px`);
        document.documentElement.style.setProperty("--vv-offset-top", `${top}px`);
      } else {
        const h = window.innerHeight;
        if (appRootRef.current) {
          appRootRef.current.style.height = `${h}px`;
        }
      }
    };
    // Run immediately, then at 100 / 300 / 600 ms to catch slow keyboard animations.
    poll();
    [100, 300, 600].forEach((ms) => setTimeout(poll, ms));
  };

  const clearChat = () => {
    setMessages([{ id: 0, role: "assistant", content: t("resetMsg"), streaming: false }]);
    setUserId(genUserId());
  };

  const navItems = [
    { id: "chat", key: "chat", Icon: Icons.Chat },
    { id: "prayer", key: "prayerTitle", Icon: Icons.Prayer },
    // { id: "history", key: "history", Icon: Icons.History },
    { id: "about", Icon: Icons.Info, key: "about" },
    { id: "settings", key: "settings", Icon: Icons.Settings },
  ];

  const PrayerSection = () => {
    const [prayerData, setPrayerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [now, setNow] = useState(new Date());
    const [countdown, setCountdown] = useState("");

    const PRAYER_KEYS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

    const PRAYER_ICONS = {
      Fajr: "pi pi-star",
      Sunrise: "pi pi-sun",
      Dhuhr: "pi pi-circle-fill",
      Asr: "pi pi-clock",
      Maghrib: "pi pi-palette",
      Isha: "pi pi-moon",
    };

    useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 60000);
      return () => clearInterval(timer);
    }, []);

    const fetchPrayers = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch("https://islamic-chatbot-lac.vercel.app/api/v1/chat/prayer-times");
        const json = await res.json();
        const entry = json.data[0];
        const idx = settings.madhab === "hanafi" ? "1" : "0";
        setPrayerData(entry[idx].data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchPrayers();
    }, [settings.madhab]);

    useEffect(() => {
      const tick = () => {
        const toDate = (str) => {
          const [h, m] = str.split(":").map(Number);
          const d = new Date();
          d.setHours(h, m, 0, 0);
          return d;
        };

        if (!prayerData) return;
        const times = PRAYER_KEYS.map((k) => ({ key: k, date: toDate(prayerData.timings[k]) }));
        const future = times.filter((t) => t.date > new Date());
        const next = future.length ? future[0] : times[0];
        const diff = next.date - new Date();
        const totalSec = Math.floor(diff / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        setCountdown(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
      };

      tick();
      const timer = setInterval(tick, 1000);
      return () => clearInterval(timer);
    }, [prayerData]);

    const getStatus = (key, timings) => {
      const toDate = (str) => {
        const [h, m] = str.split(":").map(Number);
        const d = new Date(now);
        d.setHours(h, m, 0, 0);
        return d;
      };

      const times = PRAYER_KEYS.map((k) => ({ key: k, date: toDate(timings[k]) }));
      const future = times.filter((t) => t.date > now);
      const next = future.length ? future[0] : times[0];
      const prev = times.filter((t) => t.date <= now);
      const current = prev.length ? prev[prev.length - 1] : null;

      if (current && current.key === key) return "current";
      if (next.key === key) return "next";
      return "done";
    };

    const prayerNames = t("prayerNames");

    if (loading)
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: theme.textSec,
            fontSize: 14,
          }}
        >
          <i className="pi pi-spin pi-spinner" style={{ fontSize: 22, marginRight: 10, color: theme.accent }} />
          {t("prayerLoading")}
        </div>
      );

    if (error)
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 14,
          }}
        >
          <i className="pi pi-exclamation-circle" style={{ fontSize: 32, color: "#e74c3c" }} />
          <p style={{ color: theme.textSec, fontSize: 14 }}>{t("prayerError")}</p>
          <button
            onClick={fetchPrayers}
            style={{
              padding: "8px 20px",
              borderRadius: 99,
              background: theme.accent,
              border: "none",
              color: "white",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {t("prayerRetry")}
          </button>
        </div>
      );

    const { timings, date } = prayerData;

    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
        {/* Date card */}
        <div
          style={{
            background: `linear-gradient(135deg, #1a6b5a, #0d4a3e)`,
            borderRadius: 16,
            padding: "24px 20px",
            marginBottom: 16,
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          <IslamicPattern dark={true} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", marginBottom: 6, letterSpacing: 0.5 }}>
              {date.gregorian.weekday.en} · {date.readable}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "white",
                fontFamily: "Cinzel, serif",
                letterSpacing: 0.5,
                marginBottom: 4,
              }}
            >
              {date.hijri.day} {date.hijri.month.en} {date.hijri.year} AH
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 16 }}>
              {date.hijri.month.ar} · {date.hijri.weekday.ar}
            </div>

            {/* Countdown */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.12)",
                borderRadius: 99,
                padding: "8px 20px",
                backdropFilter: "blur(6px)",
              }}
            >
              <i className="pi pi-hourglass" style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginRight: 4 }}>{t("nextPrayer")}</span>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "white",
                  fontFamily: "DM Sans, sans-serif",
                  letterSpacing: 2,
                }}
              >
                {countdown}
              </span>
            </div>
          </div>
        </div>

        {/* Prayer time cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PRAYER_KEYS.map((key) => {
            const status = getStatus(key, timings);
            const isCurrent = status === "current";
            const isNext = status === "next";

            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: `1px solid ${isCurrent ? theme.accent : isNext ? theme.borderMed : theme.border}`,
                  background: isCurrent ? theme.accentBg : theme.bgSec,
                  transition: "all .2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: isCurrent ? theme.accent : isNext ? theme.accentBg : theme.bgTer,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className={PRAYER_ICONS[key]}
                      style={{ fontSize: 16, color: isCurrent ? "white" : isNext ? theme.accent : theme.textTer }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: isCurrent ? theme.accent : theme.text }}>
                      {prayerNames[key]}
                    </div>
                    <div style={{ fontSize: 11.5, color: theme.textTer }}>{key}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {(isCurrent || isNext) && (
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        padding: "3px 9px",
                        borderRadius: 99,
                        background: isCurrent ? theme.accent : theme.accentBg,
                        color: isCurrent ? "white" : theme.accent,
                      }}
                    >
                      {isCurrent ? t("currentPrayer") : t("nextPrayer")}
                    </span>
                  )}
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: isCurrent ? theme.accent : theme.text,
                      fontFamily: "DM Sans, sans-serif",
                      letterSpacing: 0.5,
                    }}
                  >
                    {timings[key]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const Sidebar = () => (
    <aside
      style={{
        width: 224,
        height: "100%",
        background: theme.sidebarBg,
        borderRight: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        transition: "background .25s",
      }}
    >
      <IslamicPattern dark={dark} />
      <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${theme.border}`, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              flexShrink: 0,
              overflow: "hidden",
              boxShadow: "0 3px 10px rgba(26,107,90,0.3)",
            }}
          >
            <img src="/favicon.png" alt="Noor AI" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: theme.text,
                fontFamily: "Cinzel, serif",
                letterSpacing: 0.3,
              }}
            >
              {t("appName")}
            </div>
            <div
              style={{
                fontSize: 10,
                color: theme.accent,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontWeight: 500,
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              {t("appTagline")}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 14px 8px" }}>
        <button
          onClick={() => {
            clearChat();
            setSection("chat");
            setSidebarOpen(false);
          }}
          style={{
            width: "100%",
            padding: "9px 14px",
            background: theme.accentBg,
            border: `1px solid ${theme.accent}`,
            borderRadius: 10,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            color: theme.accent,
            fontSize: 13,
            fontWeight: 600,
            transition: "background .18s",
          }}
        >
          <Icons.Plus /> {t("newChat")}
        </button>
      </div>

      <nav style={{ padding: "4px 10px", flex: 1 }}>
        {navItems.map(({ id, key, Icon }) => {
          const active = section === id;
          return (
            <button
              key={id}
              className="sidebar-item"
              onClick={() => {
                setSection(id);
                setSidebarOpen(false);
              }}
              style={{
                width: "100%",
                padding: "10px 12px",
                marginBottom: 2,
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: active ? theme.accentBg : "transparent",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                color: active ? theme.accent : theme.textSec,
                fontSize: 13.5,
                fontWeight: active ? 600 : 400,
                textAlign: "left",
              }}
            >
              <span style={{ opacity: active ? 1 : 0.7 }}>
                <Icon />
              </span>
              {t(key)}
              {active && (
                <span
                  style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: theme.accent }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "12px 14px 14px", borderTop: `1px solid ${theme.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <LangPill lang={lang} setLang={setLang} theme={theme} />
          <button
            onClick={() => setDark((d) => !d)}
            title={dark ? t("lightMode") : t("darkMode")}
            style={{
              background: dark ? theme.accent : theme.bgTer,
              border: `1px solid ${theme.borderMed}`,
              borderRadius: 99,
              width: 42,
              height: 24,
              cursor: "pointer",
              padding: "0 4px",
              display: "flex",
              alignItems: "center",
              justifyContent: dark ? "flex-end" : "flex-start",
              transition: "all .25s",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: dark ? "white" : theme.textSec,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .25s",
              }}
            >
              {dark ? <Icons.Moon /> : <Icons.Sun />}
            </div>
          </button>
        </div>
        <div style={{ fontSize: 10.5, color: theme.textTer, textAlign: "center", marginBottom: 10 }}>
          {t("langSelected")}
        </div>
        {/* <div
          onClick={() => {
            setSection("profile");
            setSidebarOpen(false);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "8px 10px",
            borderRadius: 10,
            background: theme.bgTer,
            cursor: "pointer",
          }}
        >
          <UserAvatar initials={userInitials} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: theme.text,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {t("userName")}
            </div>
            <div style={{ fontSize: 11, color: theme.textSec }}>{t("member")}</div>
          </div>
        </div> */}
      </div>
    </aside>
  );
  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px";
  };




  // ──────────────────────────────────────────────────────────
  // HISTORY SECTION
  // ──────────────────────────────────────────────────────────
  const HistorySection = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "20px 20px 14px", borderBottom: `1px solid ${theme.border}` }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: theme.text, marginBottom: 4, fontFamily: "Cinzel, serif" }}>
          {t("historyTitle")}
        </h2>
        <p style={{ fontSize: 12.5, color: theme.textSec }}>{t("historySubtitle")}</p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
        {history.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px", color: theme.textTer }}>
            <Icons.History />
            <p style={{ marginTop: 12, fontSize: 13.5 }}>{t("noHistory")}</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="hist-item"
              onClick={() => setSection("chat")}
              style={{
                padding: "12px 14px",
                borderRadius: 11,
                marginBottom: 6,
                border: `1px solid ${theme.border}`,
                background: theme.bgSec,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: theme.text,
                      marginBottom: 3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: theme.textSec,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.preview}
                  </div>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}
                >
                  <span style={{ fontSize: 11, color: theme.textTer }}>{item.time}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHistory((h) => h.filter((x) => x.id !== item.id));
                    }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: theme.textTer, padding: 2 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#e74c3c")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = theme.textTer)}
                  >
                    <Icons.Trash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );


  {/* ── Footer ── */}



const AboutSection = ({ theme, t }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) { setStatus("error"); return; }
    setLoading(true); setStatus("");
    try {
      const res = await fetch("/contacts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { setStatus("success"); setForm({ name: "", email: "", message: "" }); }
      else throw new Error();
    } catch { setStatus("error"); }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    padding: "10px 14px", borderRadius: 8,
    border: `1px solid ${theme.border}`,
    background: theme.bgSec, color: theme.text,
    fontSize: 14, fontFamily: "inherit", outline: "none",
  };

  const tagStyle = {
    display: "inline-block", fontSize: 12,
    padding: "4px 10px", borderRadius: 99, margin: "3px 3px 3px 0",
    background: theme.bgTer, color: theme.textSec,
    border: `1px solid ${theme.border}`,
  };

  const sectionLabel = {
    fontSize: 11, color: theme.accent, fontWeight: 600,
    letterSpacing: "0.06em", textTransform: "uppercase",
  };

  const iconCircle = {
    width: 34, height: 34, borderRadius: "50%",
    background: theme.accentBg,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  };

  const divider = {
    borderBottom: `1px solid ${theme.border}`,
    paddingBottom: 24, marginBottom: 24,
  };

  const devSkillTags = (skills) => skills.map(s => <span key={s} style={tagStyle}>{s}</span>);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 20px 48px" }}>

      {/* ── About the App ── */}
      <div style={divider}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={iconCircle}><Icons.Chat /></div>
          <span style={sectionLabel}>{t("aboutLabel")}</span>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.text, margin: "0 0 10px", fontFamily: "Cinzel, serif" }}>
          {t("aboutAppTitle")}
        </h2>
        <p style={{ fontSize: 14, color: theme.textSec, lineHeight: 1.75, margin: "0 0 14px" }}>
          {t("aboutAppDesc")}
        </p>
        <div>{t("aboutTags").map(tag => <span key={tag} style={tagStyle}>{tag}</span>)}</div>
      </div>

      {/* ── Developers ── */}
      <div style={divider}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={iconCircle}><Icons.Profile /></div>
          <span style={sectionLabel}>{t("aboutDevsLabel")}</span>
        </div>
        <p style={{ fontSize: 13, color: theme.textTer, margin: "0 0 16px" }}>{t("aboutDevsSubtitle")}</p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            { initials: "AH", nameKey: "aboutDev1Name", roleKey: "aboutDev1Role", bioKey: "aboutDev1Bio", skillsKey: "aboutSkills1", avatarBg: theme.accentBg, avatarColor: theme.accent, avatarUrl: "https://lh3.googleusercontent.com/a-/ALV-UjWw93hvXrYt1WhNueHLG0lQXyxpnExavnle9-AF7jh9kKOcN4o=s300-p-k-rw-no" },
            { initials: "RU", nameKey: "aboutDev2Name", roleKey: "aboutDev2Role", bioKey: "aboutDev2Bio", skillsKey: "aboutSkills2", avatarBg: "#5340b720", avatarColor: "#7f77dd", avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocLJk_vtv_dHuJFyJPejdFG4YKuMsXUlz4iMaFSSjqy3aVWCsS8=s360-c-no" },
          ].map(dev => (
            <div key={dev.initials} style={{
              flex: 1, minWidth: 200,
              background: theme.bgSec, border: `1px solid ${theme.border}`,
              borderRadius: 12, padding: "1.25rem",
            }}>
<div style={{
  width: 52, height: 52, borderRadius: "50%",
  background: dev.avatarBg, overflow: "hidden",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 18, fontWeight: 700, marginBottom: 12,
}}>
  {dev.avatarUrl
    ? <img src={dev.avatarUrl} alt={t(dev.nameKey)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    : <span style={{ color: dev.avatarColor }}>{dev.initials}</span>
  }
</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: theme.text, margin: 0 }}>{t(dev.nameKey)}</p>
              <span style={{
                display: "inline-block", fontSize: 11, padding: "3px 10px",
                borderRadius: 99, marginTop: 5,
                background: dev.avatarBg, color: dev.avatarColor,
              }}>{t(dev.roleKey)}</span>
              <p style={{ fontSize: 13, color: theme.textSec, margin: "10px 0", lineHeight: 1.65 }}>{t(dev.bioKey)}</p>
              <div>{devSkillTags(t(dev.skillsKey))}</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 16, background: theme.bgTer,
          border: `1px solid ${theme.border}`, borderRadius: 12, padding: "16px 18px",
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, margin: "0 0 6px" }}>{t("aboutWeDoTitle")}</p>
          <p style={{ fontSize: 13, color: theme.textSec, lineHeight: 1.75, margin: 0 }}>{t("aboutWeDoDesc")}</p>
        </div>
      </div>

{/* ── Contact ── */}
<div>
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
    <div style={iconCircle}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    </div>
    <span style={sectionLabel}>{t("aboutContactLabel")}</span>
  </div>
  <p style={{ fontSize: 13, color: theme.textTer, margin: "0 0 16px" }}>{t("aboutContactSubtitle")}</p>

  <a href="mailto:arfinhayet786@gmail.com" style={{
    display: "inline-flex", alignItems: "center", gap: 8,
    background: theme.accentBg, color: theme.accent,
    border: `1px solid ${theme.accent}40`,
    borderRadius: 10, padding: "11px 22px",
    fontSize: 14, fontWeight: 600, textDecoration: "none",
  }}>
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
    {t("aboutContactLabel")}
  </a>
</div>

    </div>
  );
};

  // ──────────────────────────────────────────────────────────
  // PROFILE SECTION
  // ──────────────────────────────────────────────────────────
  const ProfileSection = () => {
    const [name, setName] = useState(t("userName"));
    const [email, setEmail] = useState(t("userEmail"));
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const initials =
      name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("") || "?";

    const showToast = (msg, type = "ok") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 4000);
    };

    const handleSave = async () => {
      if (!name.trim()) {
        showToast(t("nameRequired"), "err");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        showToast(t("emailInvalid"), "err");
        return;
      }
      setSaving(true);

      try {
        const res = await axios.post(
          "https://islamic-chatbot-lac.vercel.app/api/v1/profile",
          {
            name,
            email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data = res.data;

        let msg = t("savedSuccess");

        try {
          const txt = (data.content || []).map((c) => c.text || "").join("");

          const cleaned = txt.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(cleaned);

          if (parsed.message) msg = parsed.message;
        } catch (_) {
          // silent fail for parsing
        }

        showToast(msg, "ok");
      } catch (error) {
        showToast(t("savedError"), "err");
      } finally {
        s;
      }
    };

    const inputStyle = {
      width: "100%",
      padding: "9px 12px",
      borderRadius: 10,
      border: `1px solid ${theme.border}`,
      background: theme.bgSec,
      color: theme.text,
      fontSize: 13.5,
      outline: "none",
    };

    const labelStyle = {
      fontSize: 12,
      fontWeight: 600,
      color: theme.textSec,
      marginBottom: 5,
      display: "block",
    };

    const rowStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "11px 0",
      borderBottom: `1px solid ${theme.border}`,
    };

    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
        {/* Profile hero */}
        <div
          style={{
            textAlign: "center",
            padding: "28px 20px 24px",
            background: theme.bgSec,
            borderRadius: 16,
            border: `1px solid ${theme.border}`,
            marginBottom: 16,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <IslamicPattern dark={dark} />
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                margin: "0 auto 12px",
                background: "linear-gradient(135deg, #2d5a8e, #1a3a5c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                color: "white",
                fontWeight: 700,
                border: `3px solid ${theme.accent}`,
              }}
            >
              {initials}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>{name || t("userName")}</h2>
            <p style={{ fontSize: 13, color: theme.textSec, marginTop: 4 }}>{email || t("userEmail")}</p>
            <div
              style={{
                display: "inline-block",
                marginTop: 10,
                padding: "4px 14px",
                background: theme.accentBg,
                borderRadius: 99,
                border: `1px solid ${theme.accent}`,
                fontSize: 12,
                color: theme.accent,
                fontWeight: 600,
              }}
            >
              {t("membershipBasic")}
            </div>
          </div>
        </div>

        {/* Profile fields */}
        <div
          style={{
            background: theme.bgSec,
            borderRadius: 14,
            border: `1px solid ${theme.border}`,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <h3 style={{ fontSize: 13.5, fontWeight: 600, color: theme.text, marginBottom: 14 }}>{t("profileTitle")}</h3>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>{t("fullName")}</label>
            <input
              style={inputStyle}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("fullNamePlaceholder")}
            />
          </div>
          <div>
            <label style={labelStyle}>{t("emailAddress")}</label>
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
            />
          </div>
        </div>

        {/* Settings */}
        <div
          style={{
            background: theme.bgSec,
            borderRadius: 14,
            border: `1px solid ${theme.border}`,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <h3 style={{ fontSize: 13.5, fontWeight: 600, color: theme.text, marginBottom: 4 }}>{t("settingsTitle")}</h3>

          {/* Dark mode row */}
          <div style={rowStyle}>
            <div>
              <div style={{ fontSize: 13.5, color: theme.text }}>{t("darkMode")}</div>
              <div style={{ fontSize: 12, color: theme.textSec, marginTop: 2 }}>{t("darkModeSub")}</div>
            </div>
            <div
              onClick={() => setDark((v) => !v)}
              style={{
                width: 40,
                height: 22,
                borderRadius: 99,
                background: dark ? theme.accent : theme.border,
                position: "relative",
                cursor: "pointer",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "white",
                  top: 3,
                  left: dark ? 21 : 3,
                  transition: "left 0.2s",
                }}
              />
            </div>
          </div>

          {/* Language row */}
          <div style={{ ...rowStyle, borderBottom: "none", paddingBottom: 0 }}>
            <div>
              <div style={{ fontSize: 13.5, color: theme.text }}>{t("language")}</div>
              <div style={{ fontSize: 12, color: theme.textSec, marginTop: 2 }}>{t("languageSub")}</div>
            </div>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                padding: "7px 28px 7px 10px",
                borderRadius: 8,
                border: `1px solid ${theme.border}`,
                background: theme.bgSec,
                color: theme.text,
                fontSize: 13,
                cursor: "pointer",
                outline: "none",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 9px center",
                minWidth: 120,
              }}
            >
              <option value="en">English</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div
            style={{
              marginBottom: 12,
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 13,
              border: `1px solid ${toast.type === "ok" ? "#1D9E75" : "#E24B4A"}`,
              background: toast.type === "ok" ? "#E1F5EE" : "#FCEBEB",
              color: toast.type === "ok" ? "#085041" : "#791F1F",
            }}
          >
            {toast.msg}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 10,
            cursor: saving ? "not-allowed" : "pointer",
            background: saving ? theme.border : theme.accent,
            border: "none",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            opacity: saving ? 0.7 : 1,
            transition: "opacity 0.15s",
          }}
        >
          {saving ? t("saving") : t("saveChanges")}
        </button>
      </div>
    );
  };

  // ──────────────────────────────────────────────────────────
  // SETTINGS SECTION
  // ──────────────────────────────────────────────────────────
  const SettingsSection = () => {
    const groups = [
      {
        title: t("groupGeneral"),
        items: [
          {
            icon: <Icons.Globe />,
            label: t("language"),
            desc: t("languageDesc"),
            // Full language names in settings for clarity
            control: (
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { code: "bn", label: "বাংলা" },
                  { code: "en", label: "English" },
                ].map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => setLang(code)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 99,
                      cursor: "pointer",
                      border: `1px solid ${lang === code ? theme.accent : theme.borderMed}`,
                      background: lang === code ? theme.accentBg : "transparent",
                      color: lang === code ? theme.accent : theme.textSec,
                      fontSize: 12,
                      fontWeight: 600,
                      transition: "all .18s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ),
          },
          {
            icon: <Icons.Bell />,
            label: t("notifications"),
            desc: t("notificationsDesc"),
            control: (
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => setSettings((s) => ({ ...s, notifications: e.target.checked }))}
                />
                <span className="toggle-slider" />
              </label>
            ),
          },
        ],
      },
      {
        title: t("groupIslamic"),
        items: [
          {
            icon: <Icons.Book />,
            label: t("madhab"),
            desc: t("madhabDesc"),
            control: (
              <select
                value={settings.madhab}
                onChange={(e) => setSettings((s) => ({ ...s, madhab: e.target.value }))}
                style={{
                  background: theme.bgTer,
                  border: `1px solid ${theme.borderMed}`,
                  borderRadius: 8,
                  padding: "5px 10px",
                  fontSize: 12.5,
                  color: theme.text,
                  cursor: "pointer",
                }}
              >
                {["hanafi", "maliki", "shafii", "hanbali"].map((m) => (
                  <option key={m} value={m}>
                    {t("madhab" + m.charAt(0).toUpperCase() + m.slice(1))}
                  </option>
                ))}
              </select>
            ),
          },
          {
            icon: <Icons.History />,
            label: t("saveHistory"),
            desc: t("saveHistoryDesc"),
            control: (
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.saveHistory}
                  onChange={(e) => setSettings((s) => ({ ...s, saveHistory: e.target.checked }))}
                />
                <span className="toggle-slider" />
              </label>
            ),
          },
        ],
      },
      {
        title: t("groupDisplay"),
        items: [
          {
            icon: dark ? <Icons.Moon /> : <Icons.Sun />,
            label: t("darkModeLabel"),
            desc: t("darkModeDesc"),
            control: (
              <label className="toggle-switch">
                <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            ),
          },
        ],
      },
    ];

    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: theme.text, marginBottom: 4, fontFamily: "Cinzel, serif" }}>
          {t("settingsTitle")}
        </h2>
        <p style={{ fontSize: 12.5, color: theme.textSec, marginBottom: 20 }}>{t("settingsSubtitle")}</p>
        {groups.map((group, gi) => (
          <div
            key={gi}
            style={{
              background: theme.bgSec,
              borderRadius: 14,
              border: `1px solid ${theme.border}`,
              marginBottom: 14,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${theme.border}`, background: theme.bgTer }}>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: theme.textSec,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                {group.title}
              </span>
            </div>
            {group.items.map((item, ii) => (
              <div
                key={ii}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "13px 16px",
                  borderBottom: ii < group.items.length - 1 ? `1px solid ${theme.border}` : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                  <span style={{ color: theme.accent, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 13.5, color: theme.text, fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontSize: 11.5, color: theme.textTer }}>{item.desc}</div>
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>{item.control}</div>
              </div>
            ))}
          </div>
        ))}
        <div
          style={{
            textAlign: "center",
            padding: 16,
            background: theme.bgSec,
            borderRadius: 14,
            border: `1px solid ${theme.border}`,
          }}
        >
          <div style={{ fontSize: 12, color: theme.textTer, marginBottom: 4 }}>{t("version")}</div>
          <div style={{ fontSize: 11, color: theme.textTer }}>{t("bismillah")}</div>
        </div>
      </div>
    );
  };

  // ──────────────────────────────────────────────────────────
  // MOBILE HEADER
  // ──────────────────────────────────────────────────────────
  const MobileHeader = () => (
    <>
      {showInstall && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            background: "linear-gradient(135deg, #6d28d9, #8b5cf6)",
            borderRadius: 14,
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 8px 32px rgba(109,40,217,0.45)",
            border: "1px solid rgba(240,180,41,0.3)",
            maxWidth: "90vw",
            animation: "fadeSlideUp .3s ease",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img src="/favicon.png" style={{ width: 24, height: 24, borderRadius: 6 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Install Noor AI</div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.75)" }}>
              Add to home screen for best experience
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => setShowInstall(false)}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: 8,
                padding: "6px 12px",
                color: "white",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Later
            </button>
            <button
              onClick={handleInstall}
              style={{
                background: theme.accent,
                border: "none",
                borderRadius: 8,
                padding: "6px 12px",
                color: "white",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Install
            </button>
          </div>
        </div>
      )}

      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: `1px solid ${theme.border}`,
          background: theme.headerBg,
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          transition: "background .25s",
        }}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          style={{ background: "none", border: "none", color: theme.text, cursor: "pointer", padding: 4 }}
        >
          <Icons.Menu />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: "linear-gradient(135deg, #1a6b5a, #0d4a3e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.text, fontFamily: "Cinzel, serif" }}>
            {t(section)}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LangPill lang={lang} setLang={setLang} theme={theme} />
          <button
            onClick={() => setDark((d) => !d)}
            style={{ background: "none", border: "none", color: theme.textSec, cursor: "pointer", padding: 4 }}
          >
            {dark ? <Icons.Sun /> : <Icons.Moon />}
          </button>
        </div>
      </header>
    </>
  );

  // ──────────────────────────────────────────────────────────
  // ROOT RENDER
  // ──────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div
        ref={appRootRef}
        style={{
          position: "fixed",
          top: "var(--vv-offset-top, 0px)",
          left: 0,
          right: 0,
          display: "flex",
          height: "var(--app-height, 100dvh)",
          overflow: "hidden",
          background: theme.bg,
          color: theme.text,
          transition: "background .25s, color .25s",
        }}
      >
        {/* ── Desktop sidebar ── */}
        <div className="desktop-only" style={{ display: "none", flexShrink: 0, height: "100%" }}>
          <Sidebar />
        </div>

        {/* ── Mobile drawer overlay ── */}
        {sidebarOpen && (
          <div className="overlay" style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex" }}>
            <div
              onClick={() => setSidebarOpen(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            />
            <div
              style={{
                position: "relative",
                width: 260,
                height: "100%",
                zIndex: 1,
                animation: "fadeSlideUp .25s ease",
              }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: -44,
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: 99,
                  width: 34,
                  height: 34,
                  cursor: "pointer",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icons.Close />
              </button>
              <div style={{ width: 260, height: "100%" }}>
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* ── Main content ── */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minWidth: 0,
            background: dark ? "#111827" : "#faf8f4",
            transition: "background .25s",
          }}
        >
          {/* Mobile header */}
          <div className="mobile-only">
            <MobileHeader />
          </div>

          {/* Desktop top bar */}
          <div
            className="desktop-only"
            style={{
              display: "none",
              padding: "14px 24px",
              borderBottom: `1px solid ${theme.border}`,
              background: theme.headerBg,
              backdropFilter: "blur(10px)",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 600, color: theme.text, fontFamily: "Cinzel, serif" }}>
                {section === "chat"
                  ? t("welcomeTitle")
                  : section === "history"
                    ? t("historyTitle")
                    : section === "profile"
                      ? t("profileTitle")
                      : t("settingsTitle")}
              </h1>
              {section === "chat" && (
                <p style={{ fontSize: 12, color: theme.textTer, marginTop: 1 }}>{t("appSubtitle")}</p>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {section === "chat" && (
                <button
                  onClick={clearChat}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 9,
                    background: theme.bgTer,
                    border: `1px solid ${theme.border}`,
                    color: theme.textSec,
                    fontSize: 12.5,
                    cursor: "pointer",
                  }}
                >
                  {t("newChat")}
                </button>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 10px",
                  background: theme.accentBg,
                  borderRadius: 99,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: theme.accent,
                    animation: "pulse 2s infinite",
                  }}
                />
                <span style={{ fontSize: 11.5, color: theme.accent, fontWeight: 500 }}>{t("active")}</span>
              </div>
            </div>
          </div>

          {/* Section content */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {section === "chat" && (
              <ChatSection
                messages={messages}
                theme={theme}
                t={t}
                font={font}
                bottomRef={bottomRef}
                clearChat={clearChat}
                textareaRef={textareaRef}
                handleInput={handleInput}
                handleKeyDown={handleKeyDown}
                handleFocus={handleFocus}
                isLoading={isLoading}
                input={input}
                handleStop={handleStop}
                sendMessage={sendMessage}
                userInitials={userInitials}
                copyMessage={copyMessage}
                copiedId={copiedId}
              />
            )}
            {section === "history" && <HistorySection />}
            {section === "prayer" && <PrayerSection />}
            {section === "about" && <AboutSection theme={theme} t={t} />}
            {/* {section === "profile" && <ProfileSection />} */}
            {section === "settings" && <SettingsSection />}
          </div>



         <footer style={{
  flexShrink: 0,
  borderTop: `1px solid ${theme.border}`,
  background: theme.headerBg,
  backdropFilter: "blur(10px)",
  padding: "10px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 8,
}}>
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{
      width: 22, height: 22, borderRadius: "50%",
      background: "linear-gradient(135deg, #1d9e75, #0f6e56)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"
          stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <span style={{ fontSize: 12, fontWeight: 600, color: theme.text, fontFamily: "Cinzel, serif" }}>
      Noor AI
    </span>
    <span style={{ fontSize: 11, color: theme.textTer }}>v2.0</span>
  </div>

  <span style={{ fontSize: 11, color: theme.textTer, textAlign: "center" }}>
    {lang === "bn" ? "বিসমিল্লাহির রাহমানির রাহিম" : "Bismillahir Rahmanir Rahim"}
  </span>

  <span style={{ fontSize: 11, color: theme.textTer }}>
    {lang === "bn" ? "আরফিন হায়েত ও রুম্মান কর্তৃক নির্মিত" : "Built by Arfin Hayet & Rumman"}
  </span>
</footer>
        </main>
      </div>
    </>
  );
}
