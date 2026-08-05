import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import DevelopmentScreen from "@/components/DevelopmentScreen";
import { isDevelopmentMode } from "@/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Serif untuk judul dan isi artikel. Inilah yang memberi kesan terbitan
// sastra, sementara Geist tetap dipakai untuk teks antarmuka.
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
      <body className="min-h-full flex flex-col">
        {isDevelopmentMode ? (
          <DevelopmentScreen />
        ) : (
          <>
            {children}
            <Toast />
            <ConfirmModal />
          </>
        )}
      </body>
    </html>
  );
}
