import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Serif untuk judul dan isi artikel. Geist tetap untuk teks antarmuka.
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SASMITA.COM, Platform Literasi Digital",
    template: "%s | SASMITA.COM",
  },
  description:
    "Platform Literasi Digital Karya Sastra dan Akademik Mahasiswa, Prodi Sastra Indonesia, Universitas Pamulang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} h-full antialiased`}
    >
      {/* Mode pengembangan ditangani src/middleware.ts, bukan di sini. */}
      <body className="min-h-full flex flex-col">
        {children}
        <Toast />
        <ConfirmModal />
      </body>
    </html>
  );
}
