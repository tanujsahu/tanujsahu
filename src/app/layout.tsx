import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/utils";
import { GameProvider } from "@/context/GameContext";
import "./globals.css";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const display = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const description = `${profile.name} is a ${profile.title} based in Jaipur. ${profile.introduction}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s · ${profile.name}`,
  },
  description,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name }],
  keywords: [
    "Tanuj Sahu",
    "Full Stack Developer",
    "Team Lead",
    "Next.js",
    "MERN",
    "MEAN",
    "Microservices",
    "AWS",
    "Jaipur",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${profile.name} — ${profile.title}`,
    description: profile.tagline,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: profile.tagline,
  },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  email: profile.email,
  telephone: "+91-7651953660",
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Malviya Nagar",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    addressCountry: "IN",
  },
  sameAs: [profile.github],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "CSJM University, Kanpur",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-cyan-200 focus:px-4 focus:py-2 focus:text-slate-950"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
