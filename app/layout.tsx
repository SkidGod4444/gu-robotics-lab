import type { Metadata } from "next";
import { Archivo, Geist_Mono, Hanken_Grotesk } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Galgotias University: Building the Next Generation of Physical AI Engineers",
  description:
    "Don't just program robots. Build them. The Physical AI & Robotics Lab at Galgotias University — an open-source ecosystem where students engineer intelligent machines from first principles, from actuators to autonomy.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${hanken.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-ink font-body">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
