/* eslint-disable @next/next/no-sync-scripts */
/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { NavbarDemo } from "@/components/NavbarDemo";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Landing/Footer";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { cn } from "@/lib/utils";
// import { Pointer } from "@/components/ui/pointer";

import { SpeedInsights } from "@vercel/speed-insights/next";
import DisableRightClickAndDrag from "@/components/DisableRightClickAndDrag";

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "VirtiLearn - Top Courses & Internships for Students",
    template: "%s | VirtiLearn",
  },
  description:
    "VirtiLearn is the #1 platform for students to learn and grow with top-rated online courses and internships. Master programming, web development, AI/ML, data science, and more. Get hands-on experience and boost your career with VirtiLearn.",
  keywords: [
    "VirtiLearn",
    "online courses",
    "internships",
    "programming courses",
    "web development courses",
    "AI ML courses",
    "data science courses",
    "full stack development",
    "engineering internships",
    "coding bootcamp",
    "student career growth",
    "learn programming online",
    "software engineering courses",
  ],
  authors: [{ name: "VirtiLearn Team", url: defaultUrl }],
  creator: "VirtiLearn",
  publisher: "VirtiLearn",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: defaultUrl,
  },
  icons: {
    icon: "/images/Favicon.png",
    shortcut: "/images/Favicon.png",
    apple: "/images/Favicon.png",
  },
  openGraph: {
    title: "VirtiLearn - Learn Programming, Web Dev & AI with Internships",
    description:
      "VirtiLearn helps students master coding, web development, AI/ML, and secure internships. Learn by doing with hands-on projects and boost your career opportunities.",
    url: defaultUrl,
    siteName: "VirtiLearn",
    images: [
      {
        url: "/images/OG_card.png",
        width: 1200,
        height: 630,
        alt: "VirtiLearn - Best Courses & Internships for Students",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VirtiLearn - Courses & Internships for Students",
    description:
      "Learn programming, web development, AI/ML, and secure internships with VirtiLearn. Join today and level up your career.",
    images: ["/images/twitter_card.png"],
  },
  category: "education",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* Vime default CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@vime/core@^5/themes/default.css"
        />
        {/* Vime JS */}
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/@vime/core@^5/dist/vime/vime.esm.js"
        ></script>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "VirtiLearn",
              url: defaultUrl,
              logo: `${defaultUrl}/logo.svg`,
              sameAs: [
                "https://www.facebook.com/skillveta",
                "https://twitter.com/skillveta",
              ],
              course: [
                {
                  "@type": "Course",
                  name: "C Programming Course",
                  description:
                    "Learn C programming from beginner to advanced with practical projects.",
                  provider: {
                    "@type": "Organization",
                    name: "VirtiLearn",
                    sameAs: defaultUrl,
                  },
                },
                {
                  "@type": "Course",
                  name: "Python for Beginners",
                  description:
                    "Learn Python with hands-on examples and projects.",
                  provider: {
                    "@type": "Organization",
                    name: "VirtiLearn",
                    sameAs: defaultUrl,
                  },
                },
              ],
            }),
          }}
        />
        <meta name="theme-color" content="#ff6a00" />
      </head>

      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NavbarDemo />
          {/* <DisableRightClickAndDrag /> */}

          <SpeedInsights />
          {children}
          <div className="relative flex size-full items-center justify-center overflow-hidden rounded-lg border-none bg-background py-20 md:mt-12 mt-8 ">
            <GridPattern
              width={60}
              height={60}
              x={-1}
              y={-1}
              strokeDasharray={"4 2"}
              className={cn(
                "[mask-image:linear-gradient(to_top_left,white,transparent,transparent)]"
              )}
            />
            <Footer />
          </div>
        </ThemeProvider>
        <Toaster />
        {/* <Pointer className="fill-orange-500" /> Global Blue Pointer */}
      </body>
    </html>
  );
}
