import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import { AllProviders } from "@/components/providers/AllProviders";
import "./globals.css";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

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
          <header style={{padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.06)'}}>
            <nav style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
              <a href="/" style={{color: 'inherit', textDecoration: 'none'}}>Home</a>
              <a href="/chat" style={{color: 'inherit', textDecoration: 'none'}}>Chat</a>
              <a href="/about" style={{color: 'inherit', textDecoration: 'none'}}>About</a>
            </nav>
          </header>
          {children}
        </AllProviders>
      </body>
    </html>
  );
}
