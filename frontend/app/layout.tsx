import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Aura Finance - Dashboard",
  description: "Controle financeiro pessoal inteligente com design premium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark h-full antialiased">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body
        className={`${hankenGrotesk.variable} font-hanken min-h-full bg-background text-foreground selection:bg-tertiary/30 selection:text-tertiary relative overflow-x-hidden`}
      >
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        {children}
      </body>
    </html>
  );
}
