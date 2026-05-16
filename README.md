# Noor AI — Islamic Chatbot

![Noor AI preview](public/favicon-social.png)

Noor AI is a bilingual Islamic AI assistant built to help Muslims ask questions, explore daily duas, check prayer-time information, and learn from Quran- and Hadith-oriented guidance in English and Bangla.

The app is designed as a focused Islamic knowledge companion: fast to open, mobile-friendly, installable as a PWA, and organized around common daily needs like Salah, duas, reminders, and general Islamic questions.

> Noor AI provides educational Islamic information. For personal religious rulings, always consult a qualified scholar, mufti, or local imam.

## Live App

Production URL: [https://www.noorai.online](https://www.noorai.online)

## Features

- **AI Islamic chat**: Ask questions about Quran, Hadith, Salah, Ramadan, Zakat, duas, Islamic manners, and daily practice.
- **Streaming responses**: Assistant answers stream into the chat interface for a faster, more natural experience.
- **Markdown rendering**: AI responses support structured Markdown with headings, lists, quotes, tables, and code-style formatting.
- **English and Bangla support**: Switch the UI language between English and Bangla.
- **Daily duas**: Browse and search duas by category, with Arabic text, transliteration, source, and English/Bangla meanings.
- **Prayer times**: View daily prayer-time information with a live clock, countdown, and madhab selector.
- **Responsive app shell**: Desktop sidebar, mobile drawer, mobile header, and centered chat layout.
- **Dark mode**: Theme support with persisted user preference.
- **PWA-ready**: Includes manifest and service worker registration.
- **SEO-friendly public files**: Includes sitemap, robots.txt, and llms.txt for crawlers and AI agents.

## App Sections

| Route | Purpose |
| --- | --- |
| `/` | Redirects users into the app experience |
| `/chat` | Main AI chat interface |
| `/prayer` | Prayer times, clock, countdown, and Hijri date display |
| `/dua` | Searchable daily dua collection |
| `/about` | App and developer information |
| `/settings` | Language and display preferences |

## How It Works

Noor AI is a Next.js frontend that talks to a backend chat API. When a user sends a question, the app creates a user message, starts an assistant placeholder message, and reads the response stream from the API. Incoming chunks are parsed and displayed progressively in the chat.

The chat UI then normalizes and renders the assistant response as Markdown, so long answers can be shown with readable sections, lists, Hadith quotes, and references.

The dua section uses local structured JSON data from `lib/dua-data.json`, making the dua browser fast and available without extra API calls.

## Tech Stack

- **Framework**: Next.js 15
- **UI**: React 19
- **Styling**: Inline component styles with shared app-shell CSS
- **Icons**: PrimeIcons and local icon components
- **Markdown**: `react-markdown` with `remark-gfm`
- **PWA assets**: Manifest, service worker, favicons
- **SEO assets**: Sitemap, robots.txt, llms.txt, Open Graph metadata

## Project Structure

```txt
app/
  chat/        Main AI chat route
  dua/         Daily duas route
  prayer/      Prayer times route
  about/       About route
  settings/    Settings route
components/
  AppShell.jsx Shared app layout, sidebar, headers, footer
  ui/          Reusable UI pieces
context/
  ChatContext.jsx
  LocaleContext.jsx
  ThemeContext.jsx
  UiContext.jsx
lib/
  dua-data.json
  translations.js
public/
  sitemap.xml
  robots.txt
  llms.txt
  manifest.json
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Deployment

This project is intended to deploy as a **Next.js** app on Vercel.

Recommended Vercel settings:

```txt
Framework Preset: Next.js
Build Command: npm run build
Output Directory: Next.js default
Install Command: npm install
Root Directory: repository root
```

Do not configure the output directory as `dist`; Next.js builds to `.next`.

## SEO and Crawlability

The app includes:

- `public/sitemap.xml`
- `public/robots.txt`
- `public/llms.txt`
- absolute Open Graph image URLs
- route-level metadata for major pages
- Google site verification file

After deployment, submit the sitemap in Google Search Console:

```txt
https://www.noorai.online/sitemap.xml
```

## Notes

Noor AI is an educational assistant. Islamic answers can include generated content and should be verified against qualified scholarship for personal rulings, fatwas, or sensitive religious matters.
