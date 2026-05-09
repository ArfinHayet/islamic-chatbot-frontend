import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import { AllProviders } from "@/components/providers/AllProviders";
import "./globals.css";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Link from "next/link";

export const metadata = {
  title: "Noor AI — Islamic Chatbot",
  description: "Bilingual Islamic knowledge assistant powered by AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>
        <ServiceWorkerRegistrar />
        <AllProviders>
          <header style={{ padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
                Home
              </Link>
              <Link href="/chat" style={{ color: "inherit", textDecoration: "none" }}>
                Chat
              </Link>
              <Link href="/about" style={{ color: "inherit", textDecoration: "none" }}>
                About
              </Link>
            </nav>
          </header>
          {children}
        </AllProviders>
      </body>
    </html>
  );
}
