import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono, Hanken_Grotesk } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · Physical AI & Robotics Lab",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Physical AI & Robotics Lab",
  keywords: [
    "Physical AI",
    "robotics lab",
    "Galgotias University",
    "humanoid robotics",
    "open-source robotics",
    "NVIDIA DGX H200",
    "embodied AI",
    "robotics education India",
    "robotics research",
    "Greater Noida",
  ],
  authors: [{ name: "Physical AI & Robotics Lab, Galgotias University" }],
  creator: "Physical AI & Robotics Lab, Galgotias University",
  publisher: "Galgotias University",
  category: "education",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#121316",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  alternateName: "Physical AI & Robotics Lab",
  url: SITE_URL,
  logo: `${SITE_URL}/galgotias-logo.png`,
  description: SITE_DESCRIPTION,
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "Galgotias University",
    url: "https://www.galgotiasuniversity.edu.in",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot No. 2, Yamuna Expressway",
    addressLocality: "Greater Noida",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${hanken.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-ink font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
