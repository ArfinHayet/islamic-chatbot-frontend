// ============================================================
// Islamic AI Chatbot — Complete UI (Single Component)
// Sections: Chat, History, Profile, Settings
// Features: Light/Dark mode, Bangla/English i18n, Responsive
// ============================================================

import axios from "axios";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { TabMenu } from "primereact/tabmenu";

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
    aboutAppDesc:
      "Noor AI একটি দ্বিভাষিক ইসলামিক চ্যাটবট যা মুসলিমদের কুরআন, হাদিস ও ইসলামিক ফিকহ সহজে অন্বেষণে সহায়তা করে। আধুনিক AI দ্বারা চালিত এই বট বাংলা ও ইংরেজিতে নির্ভুলভাবে প্রশ্নের উত্তর দেয়।",
    aboutTags: ["কুরআন ও হাদিস", "দ্বিভাষিক (EN / BN)", "নামাজের সময়", "ফিকহ পছন্দ", "AI চালিত", "v2.0"],
    aboutDevsLabel: "ডেভেলপারদের সাথে পরিচিত হন",
    aboutDevsSubtitle: "আমরা বুদ্ধিমান সিস্টেম তৈরি করি — AI চ্যাটবট থেকে সম্পূর্ণ অটোমেশন পাইপলাইন পর্যন্ত।",
    aboutDev1Name: "আরফিন হায়েত",
    aboutDev1Role: "ফুল-স্ট্যাক ডেভেলপার",
    aboutDev1Bio:
      "AI ইন্টিগ্রেশন, LLM-চালিত অ্যাপ্লিকেশন এবং অত্যাধুনিক মডেল ব্যবহার করে জটিল ব্যবসায়িক ওয়ার্কফ্লো অটোমেট করায় বিশেষজ্ঞ।",
    aboutDev2Name: "মোহাম্মাদ রুম্মান",
    aboutDev2Role: "ফুল-স্ট্যাক ডেভেলপার",
    aboutDev2Bio:
      "রেসপন্সিভ আধুনিক UI এবং স্কেলেবল ব্যাকএন্ড সিস্টেম ডিজাইনে দক্ষ। ধারণাকে পরিশীলিত পণ্যে রূপান্তর করেন।",
    aboutWeDoTitle: "আমরা আপনার জন্য কী করতে পারি",
    aboutWeDoDesc:
      "আমরা যেকোনো বিদ্যমান সিস্টেমকে AI-চালিত করতে পারি, অটোমেশন পাইপলাইন তৈরি করতে পারি এবং ঐতিহ্যবাহী ডেটাবেজকে ভেক্টর স্টোরে রূপান্তর করতে পারি — আপনার ডেটাকে AI-এর জন্য অর্থবহভাবে ব্যবহারযোগ্য করে তোলে। অটোমেট বা স্মার্ট করা যায় এমন যেকোনো কিছু আমরা তৈরি করি।",
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
    dua: "দোয়া সমুহ",
    duaComing: "দ্রুত আসছে...",
      duaTitle:        "দৈনন্দিন দোয়া",
  duaSearch:       "দোয়া খুঁজুন...",
  duaMeaning:      "অর্থ",
  duaSource:       "সূত্র",
  duaEmpty:        "কোনো দোয়া পাওয়া যায়নি",
  duaCatAll:       "সব",
  duaCatMorning:   "সকাল",
  duaCatEvening:   "সন্ধ্যা",
  duaCatPrayer:    "নামাজ",
  duaCatFood:      "খাবার",
  duaCatTravel:    "সফর",
  duaCatDistress:  "বিপদ",
  duaCatSleep:     "ঘুম",
  duaCatForgive:   "ক্ষমা",

    // en
  },


  en: {
      duaTitle:        "Daily Duas",
  duaSearch:       "Search duas...",
  duaMeaning:      "Meaning",
  duaSource:       "Source",
  duaEmpty:        "No duas found",
  duaCatAll:       "All",
  duaCatMorning:   "Morning",
  duaCatEvening:   "Evening",
  duaCatPrayer:    "Prayer",
  duaCatFood:      "Food",
  duaCatTravel:    "Travel",
  duaCatDistress:  "Distress",
  duaCatSleep:     "Sleep",
  duaCatForgive:   "Forgiveness",
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
    aboutAppDesc:
      "Noor AI is a bilingual Islamic chatbot designed to help Muslims explore the Quran, Hadith, and Islamic jurisprudence with ease. Built with modern AI, it answers questions in both Bangla and English with accuracy and care.",
    aboutTags: ["Quran & Hadith", "Bilingual (EN / BN)", "Prayer Times", "Fiqh Preferences", "AI Powered", "v2.0"],
    aboutDevsLabel: "Meet the Developers",
    aboutDevsSubtitle: "We build intelligent systems — from AI chatbots to full automation pipelines.",
    aboutDev1Name: "Arfin Hayet",
    aboutDev1Role: "Full-Stack Dev",
    aboutDev1Bio:
      "Specializes in AI integration, LLM-powered applications, and automating complex business workflows using cutting-edge models.",
    aboutDev2Name: "Mohammad Rumman",
    aboutDev2Role: "Full-Stack Dev",
    aboutDev2Bio:
      "Expert in designing responsive, modern UIs and scalable backend systems. Transforms ideas into polished user-facing products.",
    aboutWeDoTitle: "What we can do for you",
    aboutWeDoDesc:
      "We convert any existing system into an AI-powered one, build automation pipelines, and transform traditional databases into vector stores — making your data queryable by AI in a semantically rich way. If it can be automated or made smarter, we build it.",
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
    dua: "Dua",
    duaComing: "Coming soon...",

     // ── Section heading ──────────────────────────────────────────────
    duaTitle:          "Daily Duas",
    duaSubtitle:       "Essential supplications for every Muslim",
 
    // ── Search ───────────────────────────────────────────────────────
    duaSearch:         "Search duas...",
    duaEmpty:          "No duas found",
 
    // ── Expanded card labels ─────────────────────────────────────────
    duaMeaning:        "Meaning",
    duaSource:         "Source",
 
    // ── Category tabs ────────────────────────────────────────────────
    duaCatAll:         "All",
    duaCatMorning:     "Morning",
    duaCatEvening:     "Evening",
    duaCatPrayer:      "Prayer",
    duaCatFood:        "Food",
    duaCatTravel:      "Travel",
    duaCatDistress:    "Distress",
    duaCatSleep:       "Sleep",
    duaCatForgive:     "Forgiveness",
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
  Search: () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5">
    <circle cx="7" cy="7" r="4.5"/>
    <path d="M10.5 10.5l2.5 2.5"/>
  </svg>
),
  Info: () => (
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
function LangPill({ lang, setLang, theme, setMessages }) {
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
          onClick={() => {
            setLang(code);
            setMessages((prev) => {
              prev[0] = { id: 0, role: "assistant", content: TRANSLATIONS[code].greeting, streaming: false };
              return [...prev];
            });
          }}
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
    { id: 0, role: "assistant", content: TRANSLATIONS[lang].greeting, streaming: false },
  ]);

  // responsive helper: track desktop vs mobile to reliably hide footer on small screens
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width:768px)").matches : false,
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width:768px)");
    const onChange = (e) => setIsDesktop(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

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
    { id: "dua", key: "dua", Icon: Icons.Book },
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
    const [clockMode, setClockMode] = useState("digital"); // "digital" | "analog"
    const [madhab, setMadhab] = useState(settings?.madhab ?? "standard"); // local override

    const PRAYER_KEYS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

    const PRAYER_ICONS = {
      Fajr: "pi pi-star",
      Sunrise: "pi pi-sun",
      Dhuhr: "pi pi-circle-fill",
      Asr: "pi pi-clock",
      Maghrib: "pi pi-palette",
      Isha: "pi pi-moon",
    };

    // ── Tick every second ───────────────────────────────────────────────────────
    useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    const [rawData, setRawData] = useState(null); // cache full API response

    const fetchPrayers = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch("https://islamic-chatbot-lac.vercel.app/api/v1/chat/prayer-times");
        const json = await res.json();
        const entry = json.data[0];
        setRawData(entry); // cache both madhab entries
        const idx = madhab === "hanafi" ? "1" : "0";
        setPrayerData(entry[idx].data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    // Fetch only once on mount
    useEffect(() => {
      fetchPrayers();
    }, []);

    // Switch data locally when madhab changes — no refetch
    useEffect(() => {
      if (!rawData) return;
      const idx = madhab === "hanafi" ? "1" : "0";
      setPrayerData(rawData[idx].data);
    }, [madhab, rawData]);

    // ── Countdown ────────────────────────────────────────────────────────────────
    useEffect(() => {
      if (!prayerData) return;
      const toDate = (str) => {
        const [h, m] = str.split(":").map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return d;
      };
      const times = PRAYER_KEYS.map((k) => ({
        key: k,
        date: toDate(prayerData.timings[k]),
      }));
      const future = times.filter((t) => t.date > new Date());
      const next = future.length ? future[0] : times[0];
      const diff = next.date - new Date();
      const totalSec = Math.max(0, Math.floor(diff / 1000));
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      setCountdown(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    }, [now, prayerData]);

    // ── Helpers ──────────────────────────────────────────────────────────────────
    const formatTime = (time24) => {
      if (!time24) return "";
      const [hourStr, minuteStr] = time24.split(":");
      let hour = parseInt(hourStr, 10);
      const minute = minuteStr ?? "00";
      const period = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}:${minute} ${period}`;
    };

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

    // ── Analog Clock (pure SVG — no extra library needed) ───────────────────────
    const AnalogClock = ({ date }) => {
      const size = 180;
      const cx = size / 2;
      const cy = size / 2;
      const r = size / 2 - 10;

      const sec = date.getSeconds();
      const min = date.getMinutes();
      const hr = date.getHours() % 12;

      const toRad = (deg) => (deg - 90) * (Math.PI / 180);
      const hand = (angle, length, width, color) => {
        const rad = toRad(angle);
        const x2 = cx + length * Math.cos(rad);
        const y2 = cy + length * Math.sin(rad);
        return <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />;
      };

      const hrAngle = (hr + min / 60) * 30;
      const minAngle = (min + sec / 60) * 6;
      const secAngle = sec * 6;

      const ticks = Array.from({ length: 60 }, (_, i) => {
        const isMajor = i % 5 === 0;
        const rad = toRad(i * 6);
        const outer = r;
        const inner = r - (isMajor ? 10 : 5);
        return (
          <line
            key={i}
            x1={cx + outer * Math.cos(rad)}
            y1={cy + outer * Math.sin(rad)}
            x2={cx + inner * Math.cos(rad)}
            y2={cy + inner * Math.sin(rad)}
            stroke={isMajor ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)"}
            strokeWidth={isMajor ? 2 : 1}
          />
        );
      });

      return (
        <svg width={size} height={size} style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.4))" }}>
          {/* Face */}
          <circle cx={cx} cy={cy} r={r} fill="#0d2e27" stroke="rgba(110,231,183,0.3)" strokeWidth={2} />
          {/* Ticks */}
          {ticks}
          {/* Hour numbers */}
          {[12, 3, 6, 9].map((n, i) => {
            const angle = (i * 90 - 90) * (Math.PI / 180);
            return (
              <text
                key={n}
                x={cx + (r - 22) * Math.cos(angle)}
                y={cy + (r - 22) * Math.sin(angle)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize={11}
                fontFamily="DM Mono, monospace"
              >
                {n}
              </text>
            );
          })}
          {/* Hands */}
          {hand(hrAngle, r * 0.5, 4, "white")}
          {hand(minAngle, r * 0.7, 3, "rgba(110,231,183,1)")}
          {hand(secAngle, r * 0.82, 1.5, "#f59e0b")}
          {/* Center cap */}
          <circle cx={cx} cy={cy} r={5} fill="#6ee7b7" />
        </svg>
      );
    };

    // ── Digital Clock display ────────────────────────────────────────────────────
    const DigitalClock = ({ date }) => {
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");
      const period = date.getHours() >= 12 ? "PM" : "AM";
      const h12 = date.getHours() % 12 || 12;
      return (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 46,
              fontWeight: 800,
              fontFamily: "DM Mono, monospace",
              color: "white",
              letterSpacing: 4,
              lineHeight: 1,
            }}
          >
            {String(h12).padStart(2, "0")}
            <span style={{ color: "#6ee7b7", animation: "blink 1s step-end infinite" }}>:</span>
            {mm}
            <span style={{ color: "#6ee7b7", animation: "blink 1s step-end infinite" }}>:</span>
            {ss}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4, letterSpacing: 3 }}>
            {period} · {date.toLocaleDateString("en-US", { weekday: "long" })}
          </div>
          <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
        </div>
      );
    };

    // ── Madhab Dropdown ──────────────────────────────────────────────────────────
    const MadhabDropdown = () => (
      <div style={{ position: "relative", display: "inline-block" }}>
        <select
          value={madhab}
          onChange={(e) => setMadhab(e.target.value)}
          style={{
            appearance: "none",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(110,231,183,0.3)",
            borderRadius: 99,
            color: "white",
            fontSize: 12,
            fontFamily: "DM Mono, monospace",
            padding: "6px 32px 6px 14px",
            cursor: "pointer",
            backdropFilter: "blur(6px)",
            outline: "none",
          }}
        >
          <option value="standard" style={{ background: "#0d2e27" }}>
            Standard
          </option>
          <option value="hanafi" style={{ background: "#0d2e27" }}>
            Hanafi
          </option>
        </select>
        <i
          className="pi pi-chevron-down"
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 10,
            color: "#6ee7b7",
            pointerEvents: "none",
          }}
        />
      </div>
    );

    // ── Clock Mode Tab ───────────────────────────────────────────────────────────
    const ClockTabs = () => (
      <div
        style={{
          display: "inline-flex",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 99,
          padding: 3,
          gap: 2,
        }}
      >
        {["digital", "analog"].map((mode) => (
          <button
            key={mode}
            onClick={() => setClockMode(mode)}
            style={{
              padding: "5px 14px",
              borderRadius: 99,
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "DM Mono, monospace",
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: "capitalize",
              background: clockMode === mode ? "#6ee7b7" : "transparent",
              color: clockMode === mode ? "#0d2e27" : "rgba(255,255,255,0.6)",
              transition: "all 0.2s",
            }}
          >
            {mode === "digital" ? "⏱ Digital" : "🕐 Analog"}
          </button>
        ))}
      </div>
    );

    const madhabItems = [
      { label: "Standard", icon: "pi pi-globe" },
      { label: "Hanafi", icon: "pi pi-star" },
    ];

    const [activeMadhabIndex, setActiveMadhabIndex] = useState(madhab === "hanafi" ? 1 : 0);

    const MadhabTabs = () => (
      <div
        style={{
          display: "inline-flex",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 99,
          padding: 3,
          gap: 2,
        }}
      >
        {[
          { label: "🌍 Standard", value: "standard" },
          { label: "☪️ Hanafi", value: "hanafi" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setMadhab(opt.value)}
            style={{
              padding: "5px 14px",
              borderRadius: 99,
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "DM Mono, monospace",
              fontWeight: 600,
              letterSpacing: 0.5,
              background: madhab === opt.value ? "#6ee7b7" : "transparent",
              color: madhab === opt.value ? "#0d2e27" : "rgba(255,255,255,0.6)",
              transition: "all 0.2s",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );

    // ── Render guards ────────────────────────────────────────────────────────────
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

    // ── Main render ──────────────────────────────────────────────────────────────
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
        {/* ── Date / Clock card ── */}
        <div
          style={{
            background: "linear-gradient(135deg, #1a6b5a, #0d4a3e)",
            borderRadius: 16,
            padding: "24px 20px",
            marginBottom: 16,
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          <IslamicPattern dark={true} />

          {/* Top row: Madhab selector left, Clock tabs right */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <MadhabTabs />
            <ClockTabs />
          </div>

          {/* Clock display */}
          <div
            style={{
              position: "relative",
              marginBottom: 16,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 100,
            }}
          >
            {clockMode === "digital" ? <DigitalClock date={now} /> : <AnalogClock date={now} />}
          </div>

          {/* Hijri date */}
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
                  fontFamily: "DM Mono, monospace",
                  letterSpacing: 2,
                }}
              >
                {countdown}
              </span>
            </div>
          </div>
        </div>

        {/* ── Prayer time cards ── */}
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
                      fontFamily: "DM Mono, monospace",
                      letterSpacing: 0.5,
                    }}
                  >
                    {formatTime(timings[key])}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };



// ─── DATA ────────────────────────────────────────────────────────────────────
const DUAS = [
  {
    id: 1, cat: "morning", icon: "🌅", color: "teal",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdulillahi alladhi ahyaanaa ba'da maa amaatanaa wa ilayhin-nushoor",
    en: { name: "Upon Waking", sub: "Start of the day", meaning: "All praise is for Allah who gave us life after causing us to die, and to Him is the resurrection." },
    bn: { name: "ঘুম থেকে জাগার দোয়া", sub: "দিনের শুরু", meaning: "সমস্ত প্রশংসা আল্লাহর, যিনি আমাদের মৃত্যুর পর জীবিত করলেন এবং তাঁর কাছেই পুনরুত্থান।" },
    source: "Bukhari",
  },
  {
    id: 2, cat: "morning", icon: "🛡️", color: "purple",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-sami'ul-'alim",
    en: { name: "Morning Protection", sub: "Seeking Allah's protection", meaning: "In the name of Allah, with whose name nothing is harmed on earth or in the heavens, and He is the All-Hearing, All-Knowing." },
    bn: { name: "সকালের সুরক্ষার দোয়া", sub: "আল্লাহর সুরক্ষা চাওয়া", meaning: "আল্লাহর নামে, যার নামের সাথে পৃথিবী বা আকাশে কিছুই ক্ষতি করতে পারে না। তিনি সর্বশ্রোতা, সর্বজ্ঞ।" },
    source: "Abu Dawud",
  },
  {
    id: 3, cat: "evening", icon: "🌇", color: "amber",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    transliteration: "Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah",
    en: { name: "At Sunset", sub: "Evening remembrance", meaning: "We have reached the evening and sovereignty belongs to Allah. Praise is for Allah. None is worthy of worship except Allah alone with no partner." },
    bn: { name: "সন্ধ্যার দোয়া", sub: "সন্ধ্যার জিকির", meaning: "আমরা সন্ধ্যায় পৌঁছেছি এবং রাজত্ব আল্লাহর। সমস্ত প্রশংসা আল্লাহর। আল্লাহ ছাড়া কোনো মাবুদ নেই, তিনি একা, তার কোনো শরিক নেই।" },
    source: "Muslim",
  },
  {
    id: 4, cat: "evening", icon: "🌃", color: "blue",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    transliteration: "Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilaykal-masir",
    en: { name: "Evening Remembrance", sub: "Nightly dua", meaning: "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return." },
    bn: { name: "রাতের স্মরণ", sub: "রাতের দোয়া", meaning: "হে আল্লাহ, তোমার মাধ্যমে আমরা সন্ধ্যায় পৌঁছাই এবং সকালে উপনীত হই, তোমার মাধ্যমে আমরা বাঁচি ও মরি, এবং তোমার কাছেই প্রত্যাবর্তন।" },
    source: "Tirmidhi",
  },
  {
    id: 5, cat: "prayer", icon: "🕌", color: "teal",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "Allahummaf-tah li abwaba rahmatik",
    en: { name: "Entering the Masjid", sub: "Before prayer", meaning: "O Allah, open for me the gates of Your mercy." },
    bn: { name: "মসজিদে প্রবেশের দোয়া", sub: "নামাজের আগে", meaning: "হে আল্লাহ, আমার জন্য তোমার রহমতের দরজা খুলে দাও।" },
    source: "Muslim",
  },
  {
    id: 6, cat: "prayer", icon: "🚶", color: "blue",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    transliteration: "Allahumma inni as'aluka min fadlik",
    en: { name: "Leaving the Masjid", sub: "After prayer", meaning: "O Allah, I ask You of Your bounty." },
    bn: { name: "মসজিদ থেকে বের হওয়ার দোয়া", sub: "নামাজের পরে", meaning: "হে আল্লাহ, আমি তোমার অনুগ্রহ চাই।" },
    source: "Ibn Majah",
  },
  {
    id: 7, cat: "food", icon: "🍽️", color: "coral",
    arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
    transliteration: "Bismillahi wa 'ala barakatillah",
    en: { name: "Before Eating", sub: "Bismillah dua", meaning: "In the name of Allah and with the blessings of Allah." },
    bn: { name: "খাওয়ার আগের দোয়া", sub: "বিসমিল্লাহ", meaning: "আল্লাহর নামে এবং আল্লাহর বরকতে।" },
    source: "Abu Dawud",
  },
  {
    id: 8, cat: "food", icon: "✅", color: "teal",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    transliteration: "Alhamdulillahil-ladhi at'amana wa saqana wa ja'alna muslimin",
    en: { name: "After Eating", sub: "Gratitude for food", meaning: "Praise be to Allah who fed us, gave us drink, and made us Muslims." },
    bn: { name: "খাওয়ার পরের দোয়া", sub: "খাবারের কৃতজ্ঞতা", meaning: "সেই আল্লাহর প্রশংসা যিনি আমাদের খাইয়েছেন, পান করিয়েছেন এবং মুসলিম বানিয়েছেন।" },
    source: "Abu Dawud",
  },
  {
    id: 9, cat: "travel", icon: "✈️", color: "blue",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "Bismillahi tawakkaltu 'alallahi wa la hawla wa la quwwata illa billah",
    en: { name: "Leaving Home", sub: "Start of journey", meaning: "In the name of Allah, I place my trust in Allah, and there is no power or strength except through Allah." },
    bn: { name: "বাড়ি থেকে বের হওয়ার দোয়া", sub: "সফরের শুরুতে", meaning: "আল্লাহর নামে, আল্লাহর উপর ভরসা করলাম। আল্লাহ ছাড়া কোনো শক্তি ও ক্ষমতা নেই।" },
    source: "Abu Dawud",
  },
  {
    id: 10, cat: "travel", icon: "🚗", color: "purple",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration: "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun",
    en: { name: "Boarding a Vehicle", sub: "Transport dua", meaning: "Glory to Him who has subjected this to us, and we were not capable of it, and indeed we will return to our Lord." },
    bn: { name: "যানবাহনে ওঠার দোয়া", sub: "গাড়িতে ওঠার সময়", meaning: "পবিত্র তিনি যিনি এটি আমাদের বশীভূত করে দিয়েছেন, আমরা এর যোগ্য ছিলাম না। নিশ্চয়ই আমরা আমাদের রবের কাছে ফিরে যাব।" },
    source: "Quran 43:13-14",
  },
  {
    id: 11, cat: "distress", icon: "🤲", color: "pink",
    arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa anta subhanaka inni kuntu minaz-zalimin",
    en: { name: "Dua of Yunus (AS)", sub: "Relief from anxiety", meaning: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers." },
    bn: { name: "ইউনুস (আ)-এর দোয়া", sub: "উদ্বেগ থেকে মুক্তির দোয়া", meaning: "তুমি ছাড়া কোনো মাবুদ নেই, তুমি পবিত্র। নিশ্চয়ই আমি জালেমদের অন্তর্ভুক্ত ছিলাম।" },
    source: "Quran 21:87",
  },
  {
    id: 12, cat: "distress", icon: "⚖️", color: "amber",
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    transliteration: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana wansurna 'alal-qawmil-kafirin",
    en: { name: "Dua for Patience", sub: "In times of difficulty", meaning: "Our Lord! Shower us with perseverance, make our steps firm, and give us victory over the disbelieving people." },
    bn: { name: "ধৈর্যের দোয়া", sub: "কঠিন সময়ে", meaning: "হে আমাদের রব! আমাদের উপর ধৈর্য ঢেলে দাও, আমাদের পা স্থির রাখো এবং কাফের সম্প্রদায়ের বিরুদ্ধে আমাদের সাহায্য করো।" },
    source: "Quran 2:250",
  },
  {
    id: 13, cat: "sleep", icon: "🌙", color: "purple",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismikal-lahumma amutu wa ahya",
    en: { name: "Before Sleeping", sub: "Night protection", meaning: "In Your name, O Allah, I die and I live." },
    bn: { name: "ঘুমানোর আগের দোয়া", sub: "রাতের সুরক্ষা", meaning: "হে আল্লাহ, তোমার নামেই আমি মরি এবং বাঁচি।" },
    source: "Bukhari",
  },
  {
    id: 14, cat: "sleep", icon: "🌌", color: "blue",
    arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
    transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
    en: { name: "Before Sleeping (2)", sub: "Protection on Judgment Day", meaning: "O Allah, protect me from Your punishment on the day You resurrect Your servants." },
    bn: { name: "ঘুমানোর আগের দোয়া (২)", sub: "কিয়ামতের আজাব থেকে সুরক্ষা", meaning: "হে আল্লাহ, যেদিন তুমি তোমার বান্দাদের পুনরুত্থিত করবে, সেদিন আমাকে তোমার আজাব থেকে রক্ষা করো।" },
    source: "Abu Dawud",
  },
  {
    id: 15, cat: "forgiveness", icon: "💚", color: "teal",
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullaha al-'adhim al-ladhi la ilaha illa huwal-hayyul-qayyum wa atubu ilayh",
    en: { name: "Seeking Forgiveness", sub: "Istighfar", meaning: "I seek forgiveness from Allah the Magnificent, besides whom there is no deity, the Ever-Living, the Sustainer of all, and I turn to Him in repentance." },
    bn: { name: "ক্ষমা প্রার্থনার দোয়া", sub: "ইস্তেগফার", meaning: "আমি মহান আল্লাহর কাছে ক্ষমা চাই, যিনি ছাড়া কোনো মাবুদ নেই, যিনি চিরঞ্জীব, সর্বস্থায়ী। আমি তাঁর কাছে তওবা করছি।" },
    source: "Tirmidhi",
  },
  {
    id: 16, cat: "forgiveness", icon: "🌿", color: "coral",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
    transliteration: "Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mastata't",
    en: { name: "Sayyidul Istighfar", sub: "Master of forgiveness duas", meaning: "O Allah, You are my Lord, there is no deity except You. You created me and I am Your servant, and I am on Your covenant and promise as much as I am able." },
    bn: { name: "সাইয়্যেদুল ইস্তেগফার", sub: "ক্ষমার সেরা দোয়া", meaning: "হে আল্লাহ, তুমি আমার রব। তুমি ছাড়া কোনো মাবুদ নেই। তুমি আমাকে সৃষ্টি করেছো এবং আমি তোমার বান্দা। আমি সাধ্যমতো তোমার অঙ্গীকার ও প্রতিশ্রুতিতে অবিচল।" },
    source: "Bukhari",
  },
];

const CATEGORIES = [
  { key: "all",        en: "All",        bn: "সব" },
  { key: "morning",   en: "Morning",    bn: "সকাল" },
  { key: "evening",   en: "Evening",    bn: "সন্ধ্যা" },
  { key: "prayer",    en: "Prayer",     bn: "নামাজ" },
  { key: "food",      en: "Food",       bn: "খাবার" },
  { key: "travel",    en: "Travel",     bn: "সফর" },
  { key: "distress",  en: "Distress",   bn: "বিপদ" },
  { key: "sleep",     en: "Sleep",      bn: "ঘুম" },
  { key: "forgiveness", en: "Forgiveness", bn: "ক্ষমা" },
];

const COLOR_MAP = {
  teal:   { bg: "#E1F5EE", text: "#085041", dot: "#0F6E56" },
  purple: { bg: "#EEEDFE", text: "#3C3489", dot: "#534AB7" },
  amber:  { bg: "#FAEEDA", text: "#633806", dot: "#BA7517" },
  blue:   { bg: "#E6F1FB", text: "#0C447C", dot: "#185FA5" },
  coral:  { bg: "#FAECE7", text: "#712B13", dot: "#993C1D" },
  pink:   { bg: "#FBEAF0", text: "#72243E", dot: "#993556" },
};
// ─────────────────────────────────────────────────────────────────────────────
//  DuaSection.jsx  —  drop-in replacement
//  Reads:  theme, lang, t()  from outer scope (same as SettingsSection)
//  Needs:  Icons.Search  added to your Icons object (see bottom of file)
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Add these keys to your TRANSLATIONS object ────────────────────────────
//
// en: {

// },
// bn: {

// },

// ── 2. Add Icons.Search to your Icons object ─────────────────────────────────
//
// Search: () => (
//   <svg width="15" height="15" viewBox="0 0 16 16" fill="none"
//     stroke="currentColor" strokeWidth="1.5">
//     <circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5l2.5 2.5"/>
//   </svg>
// ),

// ── 3. Dua data (declare outside component) ───────────────────────────────────
const DUA_DATA = [
  {
    id: 1, cat: "morning", icon: "🌅", color: "accent",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdulillahi alladhi ahyaanaa ba'da maa amaatanaa wa ilayhin-nushoor",
    source: "Bukhari",
    en: { name: "Upon Waking", sub: "Start of the day", meaning: "All praise is for Allah who gave us life after causing us to die, and to Him is the resurrection." },
    bn: { name: "ঘুম থেকে জাগার দোয়া", sub: "দিনের শুরু", meaning: "সমস্ত প্রশংসা আল্লাহর, যিনি আমাদের মৃত্যুর পর জীবিত করলেন এবং তাঁর কাছেই পুনরুত্থান।" },
  },
  {
    id: 2, cat: "morning", icon: "🛡️", color: "purple",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-sami'ul-'alim",
    source: "Abu Dawud",
    en: { name: "Morning Protection", sub: "Seeking Allah's protection", meaning: "In the name of Allah, with whose name nothing is harmed on earth or in the heavens, and He is the All-Hearing, All-Knowing." },
    bn: { name: "সকালের সুরক্ষার দোয়া", sub: "আল্লাহর সুরক্ষা চাওয়া", meaning: "আল্লাহর নামে, যার নামের সাথে পৃথিবী বা আকাশে কিছুই ক্ষতি করতে পারে না। তিনি সর্বশ্রোতা, সর্বজ্ঞ।" },
  },
  {
    id: 3, cat: "evening", icon: "🌇", color: "amber",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    transliteration: "Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah",
    source: "Muslim",
    en: { name: "At Sunset", sub: "Evening remembrance", meaning: "We have reached the evening and sovereignty belongs to Allah. Praise is for Allah. None is worthy of worship except Allah alone with no partner." },
    bn: { name: "সন্ধ্যার দোয়া", sub: "সন্ধ্যার জিকির", meaning: "আমরা সন্ধ্যায় পৌঁছেছি এবং রাজত্ব আল্লাহর। সমস্ত প্রশংসা আল্লাহর। আল্লাহ ছাড়া কোনো মাবুদ নেই, তিনি একা।" },
  },
  {
    id: 4, cat: "evening", icon: "🌃", color: "blue",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    transliteration: "Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilaykal-masir",
    source: "Tirmidhi",
    en: { name: "Evening Remembrance", sub: "Nightly dua", meaning: "O Allah, by You we enter the evening and morning, by You we live and die, and to You is the final return." },
    bn: { name: "রাতের স্মরণ", sub: "রাতের দোয়া", meaning: "হে আল্লাহ, তোমার মাধ্যমে আমরা সন্ধ্যায় ও সকালে পৌঁছাই, তোমার মাধ্যমে বাঁচি ও মরি, এবং তোমার কাছেই প্রত্যাবর্তন।" },
  },
  {
    id: 5, cat: "prayer", icon: "🕌", color: "accent",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "Allahummaf-tah li abwaba rahmatik",
    source: "Muslim",
    en: { name: "Entering the Masjid", sub: "Before prayer", meaning: "O Allah, open for me the gates of Your mercy." },
    bn: { name: "মসজিদে প্রবেশের দোয়া", sub: "নামাজের আগে", meaning: "হে আল্লাহ, আমার জন্য তোমার রহমতের দরজা খুলে দাও।" },
  },
  {
    id: 6, cat: "prayer", icon: "🚶", color: "blue",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    transliteration: "Allahumma inni as'aluka min fadlik",
    source: "Ibn Majah",
    en: { name: "Leaving the Masjid", sub: "After prayer", meaning: "O Allah, I ask You of Your bounty." },
    bn: { name: "মসজিদ থেকে বের হওয়ার দোয়া", sub: "নামাজের পরে", meaning: "হে আল্লাহ, আমি তোমার অনুগ্রহ চাই।" },
  },
  {
    id: 7, cat: "food", icon: "🍽️", color: "coral",
    arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
    transliteration: "Bismillahi wa 'ala barakatillah",
    source: "Abu Dawud",
    en: { name: "Before Eating", sub: "Bismillah dua", meaning: "In the name of Allah and with the blessings of Allah." },
    bn: { name: "খাওয়ার আগের দোয়া", sub: "বিসমিল্লাহ", meaning: "আল্লাহর নামে এবং আল্লাহর বরকতে।" },
  },
  {
    id: 8, cat: "food", icon: "✅", color: "accent",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    transliteration: "Alhamdulillahil-ladhi at'amana wa saqana wa ja'alna muslimin",
    source: "Abu Dawud",
    en: { name: "After Eating", sub: "Gratitude for food", meaning: "Praise be to Allah who fed us, gave us drink, and made us Muslims." },
    bn: { name: "খাওয়ার পরের দোয়া", sub: "খাবারের কৃতজ্ঞতা", meaning: "সেই আল্লাহর প্রশংসা যিনি আমাদের খাইয়েছেন, পান করিয়েছেন এবং মুসলিম বানিয়েছেন।" },
  },
  {
    id: 9, cat: "travel", icon: "✈️", color: "blue",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "Bismillahi tawakkaltu 'alallahi wa la hawla wa la quwwata illa billah",
    source: "Abu Dawud",
    en: { name: "Leaving Home", sub: "Start of journey", meaning: "In the name of Allah, I place my trust in Allah, and there is no power or strength except through Allah." },
    bn: { name: "বাড়ি থেকে বের হওয়ার দোয়া", sub: "সফরের শুরুতে", meaning: "আল্লাহর নামে, আল্লাহর উপর ভরসা করলাম। আল্লাহ ছাড়া কোনো শক্তি ও ক্ষমতা নেই।" },
  },
  {
    id: 10, cat: "travel", icon: "🚗", color: "purple",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration: "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun",
    source: "Quran 43:13-14",
    en: { name: "Boarding a Vehicle", sub: "Transport dua", meaning: "Glory to Him who subjected this to us; we were not capable of it, and indeed we will return to our Lord." },
    bn: { name: "যানবাহনে ওঠার দোয়া", sub: "গাড়িতে ওঠার সময়", meaning: "পবিত্র তিনি যিনি এটি আমাদের অধীন করেছেন, আমরা এর যোগ্য ছিলাম না। নিশ্চয়ই আমরা রবের কাছে ফিরে যাব।" },
  },
  {
    id: 11, cat: "distress", icon: "🤲", color: "pink",
    arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa anta subhanaka inni kuntu minaz-zalimin",
    source: "Quran 21:87",
    en: { name: "Dua of Yunus (AS)", sub: "Relief from anxiety", meaning: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers." },
    bn: { name: "ইউনুস (আ)-এর দোয়া", sub: "উদ্বেগ থেকে মুক্তির দোয়া", meaning: "তুমি ছাড়া কোনো মাবুদ নেই, তুমি পবিত্র। নিশ্চয়ই আমি জালেমদের অন্তর্ভুক্ত ছিলাম।" },
  },
  {
    id: 12, cat: "distress", icon: "⚖️", color: "amber",
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    transliteration: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana wansurna 'alal-qawmil-kafirin",
    source: "Quran 2:250",
    en: { name: "Dua for Patience", sub: "In times of difficulty", meaning: "Our Lord! Shower us with perseverance, make our steps firm, and give us victory over the disbelieving people." },
    bn: { name: "ধৈর্যের দোয়া", sub: "কঠিন সময়ে", meaning: "হে আমাদের রব! আমাদের উপর ধৈর্য ঢেলে দাও, আমাদের পা স্থির রাখো এবং কাফেরদের বিরুদ্ধে আমাদের সাহায্য করো।" },
  },
  {
    id: 13, cat: "sleep", icon: "🌙", color: "purple",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismikal-lahumma amutu wa ahya",
    source: "Bukhari",
    en: { name: "Before Sleeping", sub: "Night protection", meaning: "In Your name, O Allah, I die and I live." },
    bn: { name: "ঘুমানোর আগের দোয়া", sub: "রাতের সুরক্ষা", meaning: "হে আল্লাহ, তোমার নামেই আমি মরি এবং বাঁচি।" },
  },
  {
    id: 14, cat: "sleep", icon: "🌌", color: "blue",
    arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
    transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
    source: "Abu Dawud",
    en: { name: "Before Sleeping (2)", sub: "Protection on Judgment Day", meaning: "O Allah, protect me from Your punishment on the day You resurrect Your servants." },
    bn: { name: "ঘুমানোর আগের দোয়া (২)", sub: "কিয়ামতের আজাব থেকে সুরক্ষা", meaning: "হে আল্লাহ, যেদিন তুমি বান্দাদের পুনরুত্থিত করবে, সেদিন তোমার আজাব থেকে রক্ষা করো।" },
  },
  {
    id: 15, cat: "forgiveness", icon: "💚", color: "accent",
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullaha al-'adhim al-ladhi la ilaha illa huwal-hayyul-qayyum wa atubu ilayh",
    source: "Tirmidhi",
    en: { name: "Seeking Forgiveness", sub: "Istighfar", meaning: "I seek forgiveness from Allah the Magnificent, the Ever-Living, the Sustainer of all, and I turn to Him in repentance." },
    bn: { name: "ক্ষমা প্রার্থনার দোয়া", sub: "ইস্তেগফার", meaning: "আমি মহান আল্লাহর কাছে ক্ষমা চাই, যিনি চিরঞ্জীব, সর্বস্থায়ী। আমি তাঁর কাছে তওবা করছি।" },
  },
  {
    id: 16, cat: "forgiveness", icon: "🌿", color: "coral",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
    transliteration: "Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mastata't",
    source: "Bukhari",
    en: { name: "Sayyidul Istighfar", sub: "Master of forgiveness duas", meaning: "O Allah, You are my Lord, there is no deity except You. You created me and I am Your servant, and I uphold Your covenant and promise to the best of my ability." },
    bn: { name: "সাইয়্যেদুল ইস্তেগফার", sub: "ক্ষমার সেরা দোয়া", meaning: "হে আল্লাহ, তুমি আমার রব। তুমি ছাড়া কোনো মাবুদ নেই। তুমি আমাকে সৃষ্টি করেছো এবং আমি তোমার বান্দা। আমি সাধ্যমতো তোমার অঙ্গীকারে অবিচল।" },
  },
];

const DUA_CATEGORIES = [
  { key: "all",         tk: "duaCatAll"      },
  { key: "morning",     tk: "duaCatMorning"  },
  { key: "evening",     tk: "duaCatEvening"  },
  { key: "prayer",      tk: "duaCatPrayer"   },
  { key: "food",        tk: "duaCatFood"     },
  { key: "travel",      tk: "duaCatTravel"   },
  { key: "distress",    tk: "duaCatDistress" },
  { key: "sleep",       tk: "duaCatSleep"    },
  { key: "forgiveness", tk: "duaCatForgive"  },
];

// Maps color token → { bg, text } using your theme for "accent",
// or hardcoded ramp values for named colors
const duaColor = (colorKey, theme) => {
  const map = {
    accent: { bg: theme.accentBg,  text: theme.accent  },
    purple: { bg: "#EEEDFE",       text: "#534AB7"     },
    amber:  { bg: "#FAEEDA",       text: "#BA7517"     },
    blue:   { bg: "#E6F1FB",       text: "#185FA5"     },
    coral:  { bg: "#FAECE7",       text: "#993C1D"     },
    pink:   { bg: "#FBEAF0",       text: "#993556"     },
  };
  return map[colorKey] || map.accent;
};

// ── 4. Paste DuaSection inside your main component ────────────────────────────
//    (next to SettingsSection, PrayerSection, etc.)
//    It reads `theme`, `lang`, and `t` from your outer scope — no props needed.

const DuaSection = () => {
  const [activeCat, setActiveCat]   = React.useState("all");
  const [expandedId, setExpandedId] = React.useState(null);
  const [search, setSearch]         = React.useState("");

  const L = lang; // "en" | "bn"  ← from your outer useState

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return DUA_DATA.filter((d) => {
      const matchCat    = activeCat === "all" || d.cat === activeCat;
      const matchSearch =
        !q ||
        d[L].name.toLowerCase().includes(q) ||
        d[L].meaning.toLowerCase().includes(q) ||
        d.transliteration.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCat, search, L]);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>

      {/* ── Heading — mirrors SettingsSection exactly ── */}
      <h2
        style={{
          fontSize: 17, fontWeight: 600,
          color: theme.text, marginBottom: 4,
          fontFamily: "Cinzel, serif",
        }}
      >
        {t("duaTitle")}
      </h2>
      <p style={{ fontSize: 12.5, color: theme.textSec, marginBottom: 16 }}>
        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
      </p>

      {/* ── Search bar ── */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: theme.bgSec,
          border: `1px solid ${theme.border}`,
          borderRadius: 12, padding: "8px 12px",
          marginBottom: 14,
        }}
      >
        <span style={{ color: theme.textTer, display: "flex" }}>
          <Icons.Search />
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("duaSearch")}
          style={{
            flex: 1, border: "none", outline: "none",
            background: "transparent",
            fontSize: 13, color: theme.text,
          }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: theme.textTer, fontSize: 17, lineHeight: 1, padding: 0,
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* ── Category tabs — same pill style as your language buttons ── */}
      <div
        style={{
          display: "flex", gap: 6, overflowX: "auto",
          scrollbarWidth: "none", paddingBottom: 2, marginBottom: 16,
        }}
      >
        {DUA_CATEGORIES.map(({ key, tk }) => {
          const isActive = activeCat === key;
          return (
            <button
              key={key}
              onClick={() => { setActiveCat(key); setExpandedId(null); }}
              style={{
                padding: "5px 12px", borderRadius: 99,
                cursor: "pointer", whiteSpace: "nowrap",
                fontSize: 12, fontWeight: 600,
                border: `1px solid ${isActive ? theme.accent : theme.borderMed}`,
                background: isActive ? theme.accentBg : "transparent",
                color: isActive ? theme.accent : theme.textSec,
                transition: "all .18s",
              }}
            >
              {t(tk)}
            </button>
          );
        })}
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 ? (
        <div
          style={{
            background: theme.bgSec, borderRadius: 14,
            border: `1px solid ${theme.border}`,
            padding: "32px 20px", textAlign: "center",
          }}
        >
          <span style={{ fontSize: 13, color: theme.textTer }}>{t("duaEmpty")}</span>
        </div>
      ) : (

        /* ── Dua cards — same structure as SettingsSection group cards ── */
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((d) => {
            const isOpen = expandedId === d.id;
            const clr    = duaColor(d.color, theme);
            const info   = d[L];

            return (
              <div
                key={d.id}
                style={{
                  background: theme.bgSec,
                  borderRadius: 14,
                  border: `1px solid ${isOpen ? theme.accent : theme.border}`,
                  overflow: "hidden",
                  transition: "border-color .18s",
                }}
              >
                {/* Row header — identical layout to your settings rows */}
                <div
                  onClick={() => setExpandedId(isOpen ? null : d.id)}
                  style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12, padding: "13px 16px",
                    cursor: "pointer",
                    borderBottom: isOpen ? `1px solid ${theme.border}` : "none",
                  }}
                >
                  {/* Left side — icon + label/desc */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: clr.bg, flexShrink: 0,
                        display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 17,
                      }}
                    >
                      {d.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, color: theme.text, fontWeight: 500 }}>
                        {info.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: theme.textTer }}>
                        {info.sub}
                      </div>
                    </div>
                  </div>

                  {/* Chevron — same pattern as your accordions */}
                  <svg
                    width="15" height="15" viewBox="0 0 16 16"
                    fill="none" stroke={theme.textTer} strokeWidth="1.5"
                    style={{
                      flexShrink: 0, transition: "transform .2s",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div style={{ padding: "14px 16px 16px" }}>

                    {/* Arabic text */}
                    <div
                      style={{
                        fontSize: 21, lineHeight: 2.1,
                        textAlign: "right", direction: "rtl",
                        color: theme.text, fontWeight: 600,
                        fontFamily: "'Amiri','Arabic Typesetting','Traditional Arabic',serif",
                        letterSpacing: 0.4, marginBottom: 10,
                      }}
                    >
                      {d.arabic}
                    </div>

                    {/* Transliteration */}
                    <div
                      style={{
                        fontSize: 12.5, color: theme.textSec,
                        fontStyle: "italic", lineHeight: 1.7,
                        marginBottom: 12,
                      }}
                    >
                      {d.transliteration}
                    </div>

                    {/* Meaning box — bgTer card like your settings group header */}
                    <div
                      style={{
                        background: theme.bgTer,
                        border: `1px solid ${theme.border}`,
                        borderRadius: 10, padding: "10px 13px",
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10.5, fontWeight: 600,
                          color: theme.accent,
                          textTransform: "uppercase", letterSpacing: 0.7,
                          marginBottom: 5,
                        }}
                      >
                        {t("duaMeaning")}
                      </div>
                      <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.65 }}>
                        {info.meaning}
                      </div>
                    </div>

                    {/* Source badge — same pill style as language buttons */}
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: 11, padding: "3px 10px",
                        background: theme.accentBg,
                        color: theme.accent,
                        borderRadius: 99, fontWeight: 600,
                      }}
                    >
                      📖 {t("duaSource")}: {d.source}
                    </span>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── 5. Add Icons.Search (if not already in your Icons object) ─────────────────
//

/*
── USAGE EXAMPLES ────────────────────────────────────────────────────────────

1. English mode (default):
   <DuaSection lang="en" />

2. Bangla mode:
   <DuaSection lang="bn" />

3. With your app theme:
   <DuaSection
     lang={userLanguage}       // "en" | "bn"
     theme={{
       background: "#FFFFFF",
       surface:    "#F7F6F3",
       border:     "rgba(0,0,0,0.09)",
       text:       "#1A1A1A",
       textSec:    "#6B6B6B",
       textTer:    "#A3A3A3",
       accent:     "#0F6E56",
       accentBg:   "#E1F5EE",
     }}
   />

4. Dynamic language switching:
   const [lang, setLang] = useState("en");
   ...
   <DuaSection lang={lang} theme={theme} />

── PROPS ─────────────────────────────────────────────────────────────────────
  lang    "en" | "bn"     Language for names, subtitles, and meanings
  theme   object          Optional: your app's color tokens (see above)

── FEATURES ──────────────────────────────────────────────────────────────────
  • 16 essential duas across 8 categories
  • Full Arabic text (every dua)
  • Transliteration (every dua)
  • English & Bangla names, subtitles, and meanings
  • Category tab filtering
  • Live search (name, meaning, transliteration)
  • Tap-to-expand cards
  • Hadith / Quran source badge
  • Fully theme-able via props
*/

  const Sidebar = ({ setMessages }) => (
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
          <LangPill lang={lang} setLang={setLang} theme={theme} setMessages={setMessages} />
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

  {
    /* ── Footer ── */
  }

  const AboutSection = ({ theme, t }) => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
      if (!form.name || !form.email || !form.message) {
        setStatus("error");
        return;
      }
      setLoading(true);
      setStatus("");
      try {
        const res = await fetch("/contacts/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setStatus("success");
          setForm({ name: "", email: "", message: "" });
        } else throw new Error();
      } catch {
        setStatus("error");
      }
      setLoading(false);
    };

    const inputStyle = {
      width: "100%",
      boxSizing: "border-box",
      padding: "10px 14px",
      borderRadius: 8,
      border: `1px solid ${theme.border}`,
      background: theme.bgSec,
      color: theme.text,
      fontSize: 14,
      fontFamily: "inherit",
      outline: "none",
    };

    const tagStyle = {
      display: "inline-block",
      fontSize: 12,
      padding: "4px 10px",
      borderRadius: 99,
      margin: "3px 3px 3px 0",
      background: theme.bgTer,
      color: theme.textSec,
      border: `1px solid ${theme.border}`,
    };

    const sectionLabel = {
      fontSize: 11,
      color: theme.accent,
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    };

    const iconCircle = {
      width: 34,
      height: 34,
      borderRadius: "50%",
      background: theme.accentBg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    };

    const divider = {
      borderBottom: `1px solid ${theme.border}`,
      paddingBottom: 24,
      marginBottom: 24,
    };

    const devSkillTags = (skills) =>
      skills.map((s) => (
        <span key={s} style={tagStyle}>
          {s}
        </span>
      ));

    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 20px 48px" }}>
        {/* ── About the App ── */}
        <div style={divider}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={iconCircle}>
              <Icons.Chat />
            </div>
            <span style={sectionLabel}>{t("aboutLabel")}</span>
          </div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: theme.text,
              margin: "0 0 10px",
              fontFamily: "Cinzel, serif",
            }}
          >
            {t("aboutAppTitle")}
          </h2>
          <p style={{ fontSize: 14, color: theme.textSec, lineHeight: 1.75, margin: "0 0 14px" }}>
            {t("aboutAppDesc")}
          </p>
          <div>
            {t("aboutTags").map((tag) => (
              <span key={tag} style={tagStyle}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Developers ── */}
        <div style={divider}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={iconCircle}>
              <Icons.Profile />
            </div>
            <span style={sectionLabel}>{t("aboutDevsLabel")}</span>
          </div>
          <p style={{ fontSize: 13, color: theme.textTer, margin: "0 0 16px" }}>{t("aboutDevsSubtitle")}</p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[
              {
                initials: "AH",
                nameKey: "aboutDev1Name",
                roleKey: "aboutDev1Role",
                bioKey: "aboutDev1Bio",
                skillsKey: "aboutSkills1",
                avatarBg: theme.accentBg,
                avatarColor: theme.accent,
                avatarUrl:
                  "https://lh3.googleusercontent.com/a-/ALV-UjWw93hvXrYt1WhNueHLG0lQXyxpnExavnle9-AF7jh9kKOcN4o=s300-p-k-rw-no",
              },
              {
                initials: "RU",
                nameKey: "aboutDev2Name",
                roleKey: "aboutDev2Role",
                bioKey: "aboutDev2Bio",
                skillsKey: "aboutSkills2",
                avatarBg: "#5340b720",
                avatarColor: "#7f77dd",
                avatarUrl:
                  "https://lh3.googleusercontent.com/a/ACg8ocLJk_vtv_dHuJFyJPejdFG4YKuMsXUlz4iMaFSSjqy3aVWCsS8=s360-c-no",
              },
            ].map((dev) => (
              <div
                key={dev.initials}
                style={{
                  flex: 1,
                  minWidth: 200,
                  background: theme.bgSec,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 12,
                  padding: "1.25rem",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: dev.avatarBg,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  {dev.avatarUrl ? (
                    <img
                      src={dev.avatarUrl}
                      alt={t(dev.nameKey)}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ color: dev.avatarColor }}>{dev.initials}</span>
                  )}
                </div>
                <p style={{ fontSize: 16, fontWeight: 600, color: theme.text, margin: 0 }}>{t(dev.nameKey)}</p>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 99,
                    marginTop: 5,
                    background: dev.avatarBg,
                    color: dev.avatarColor,
                  }}
                >
                  {t(dev.roleKey)}
                </span>
                <p style={{ fontSize: 13, color: theme.textSec, margin: "10px 0", lineHeight: 1.65 }}>
                  {t(dev.bioKey)}
                </p>
                <div>{devSkillTags(t(dev.skillsKey))}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 16,
              background: theme.bgTer,
              border: `1px solid ${theme.border}`,
              borderRadius: 12,
              padding: "16px 18px",
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, margin: "0 0 6px" }}>{t("aboutWeDoTitle")}</p>
            <p style={{ fontSize: 13, color: theme.textSec, lineHeight: 1.75, margin: 0 }}>{t("aboutWeDoDesc")}</p>
          </div>
        </div>

        {/* ── Contact ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={iconCircle}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={theme.accent}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <span style={sectionLabel}>{t("aboutContactLabel")}</span>
          </div>
          <p style={{ fontSize: 13, color: theme.textTer, margin: "0 0 16px" }}>{t("aboutContactSubtitle")}</p>

          <a
            href="mailto:arfinhayet786@gmail.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: theme.accentBg,
              color: theme.accent,
              border: `1px solid ${theme.accent}40`,
              borderRadius: 10,
              padding: "11px 22px",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.accent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
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
              onChange={(e) => {
                setLang(e.target.value);
                setMessages((prev) => {
                  prev[0] = {
                    id: 0,
                    role: "assistant",
                    content: TRANSLATIONS[e.target.value].greeting,
                    streaming: false,
                  };
                  return [...prev];
                });
              }}
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
                    onClick={() => {
                      setLang(code);
                      setMessages((prev) => {
                        prev[0] = { id: 0, role: "assistant", content: TRANSLATIONS[code].greeting, streaming: false };
                        return [...prev];
                      });
                    }}
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
          // {
          //   icon: <Icons.Bell />,
          //   label: t("notifications"),
          //   desc: t("notificationsDesc"),
          //   control: (
          //     <label className="toggle-switch">
          //       <input
          //         type="checkbox"
          //         checked={settings.notifications}
          //         onChange={(e) => setSettings((s) => ({ ...s, notifications: e.target.checked }))}
          //       />
          //       <span className="toggle-slider" />
          //     </label>
          //   ),
          // },
        ],
      },
      // {
      //   title: t("groupIslamic"),
      //   items: [
      //     {
      //       icon: <Icons.Book />,
      //       label: t("madhab"),
      //       desc: t("madhabDesc"),
      //       control: (
      //         <select
      //           value={settings.madhab}
      //           onChange={(e) => setSettings((s) => ({ ...s, madhab: e.target.value }))}
      //           style={{
      //             background: theme.bgTer,
      //             border: `1px solid ${theme.borderMed}`,
      //             borderRadius: 8,
      //             padding: "5px 10px",
      //             fontSize: 12.5,
      //             color: theme.text,
      //             cursor: "pointer",
      //           }}
      //         >
      //           {["hanafi", "maliki", "shafii", "hanbali"].map((m) => (
      //             <option key={m} value={m}>
      //               {t("madhab" + m.charAt(0).toUpperCase() + m.slice(1))}
      //             </option>
      //           ))}
      //         </select>
      //       ),
      //     },
      //     {
      //       icon: <Icons.History />,
      //       label: t("saveHistory"),
      //       desc: t("saveHistoryDesc"),
      //       control: (
      //         <label className="toggle-switch">
      //           <input
      //             type="checkbox"
      //             checked={settings.saveHistory}
      //             onChange={(e) => setSettings((s) => ({ ...s, saveHistory: e.target.checked }))}
      //           />
      //           <span className="toggle-slider" />
      //         </label>
      //       ),
      //     },
      //   ],
      // },
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
  const MobileHeader = ({ setMessages }) => (
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
          <LangPill lang={lang} setLang={setLang} theme={theme} setMessages={setMessages} />
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
          <Sidebar setMessages={setMessages} />
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
            <MobileHeader setMessages={setMessages} />
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
            {section === "dua" && <DuaSection theme={theme}/>}
            {section === "about" && <AboutSection theme={theme} t={t} />}
            {/* {section === "profile" && <ProfileSection />} */}
            {section === "settings" && <SettingsSection setMessages={setMessages} />}
          </div>

          {isDesktop && (
            <footer
              className="desktop-only"
              style={{
                flexShrink: 0,
                borderTop: `1px solid ${theme.border}`,
                background: theme.headerBg,
                backdropFilter: "blur(10px)",
                padding: "10px 20px",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1d9e75, #0f6e56)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
          )}
        </main>
      </div>
    </>
  );
}
