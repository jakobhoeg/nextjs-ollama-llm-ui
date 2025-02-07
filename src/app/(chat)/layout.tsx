import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { dir } from "i18next"; // Get text direction (ltr/rtl)
import { languages, defaultLanguage } from "@/lib/i18n"; // i18n configuration
import { cookies } from "next/headers"; // Retrieve cookies on the server side

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ollama UI",
  description: "Ollama chatbot web interface",
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string }; // Dynamic locale
}>) {
  // Get current language (default to "en" if not set)
  const cookieStore = cookies();
  const lang = cookieStore.get("NEXT_LOCALE")?.value || defaultLanguage;

  return (
    <html lang={lang}>
      <body className={`antialiased tracking-tight ${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
