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
        <AllProviders>{children}</AllProviders>
      </body>
    </html>
  );
}
