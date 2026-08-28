import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import { ThemeColorSync } from "@/components/theme-color-sync";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "SorteioFut",
  description: "Sorteador pra peladas de baixo nível",
};

export const viewport: Viewport = {
  themeColor: "oklch(0.9934 0.0017 174.535)",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${poppins.variable} h-dvh overflow-hidden antialiased`}
    >
      <body className="flex h-dvh flex-col overflow-hidden">
        <ThemeProvider>
          <ThemeColorSync />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
