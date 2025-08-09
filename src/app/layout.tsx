import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { RouterLoading } from "@/components/ui/RouterLoading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GarapaCRM - Sistema de Gestão",
  description: "Sistema CRM completo com gestão de clientes, tarefas, helpdesk, WhatsApp e email",
  keywords: ["CRM", "GarapaCRM", "gestão", "clientes", "tarefas", "helpdesk", "WhatsApp", "email"],
  authors: [{ name: "GarapaCRM Team" }],
  openGraph: {
    title: "GarapaCRM",
    description: "Sistema CRM completo com gestão de clientes, tarefas, helpdesk, WhatsApp e email",
    url: "https://seu-dominio.com",
    siteName: "GarapaCRM",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GarapaCRM",
    description: "Sistema CRM completo com gestão de clientes, tarefas, helpdesk, WhatsApp e email",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <RouterLoading />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
