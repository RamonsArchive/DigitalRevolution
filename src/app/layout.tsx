import type { Metadata } from "next";
import LocalFont from "next/font/local";
import "./globals.css";

const localFont = LocalFont({
  src: [
    {
      path: "../fonts/CourierPrime-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/CourierPrime-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/CourierPrime-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/CourierPrime-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-courier-prime",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Digital Revolution - Expanding Access to Technology for All",
  description:
    "Join the Digital Revolution! We're expanding access to technology, STEM education, and digital literacy for underserved communities. Shop our mission-driven merchandise, donate to our cause, or partner with us to create digital equity worldwide.",
  keywords: [
    "digital revolution",
    "digital equity",
    "STEM education",
    "digital literacy",
    "technology access",
    "digital divide",
    "community technology",
    "educational technology",
    "social impact",
    "mission-driven",
    "digital inclusion",
    "technology for all",
    "STEM outreach",
    "digital rights",
    "community empowerment",
    "educational access",
    "technology education",
    "digital transformation",
    "social justice technology",
    "inclusive technology",
  ],
  authors: [
    { name: "Digital Revolution", url: "https://digitalrevolution.shop" },
  ],
  creator: "Digital Revolution",
  publisher: "Digital Revolution",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://digitalrevolution.shop"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Digital Revolution - Expanding Access to Technology for All",
    description:
      "Join the Digital Revolution! We're expanding access to technology, STEM education, and digital literacy for underserved communities. Shop our mission-driven merchandise, donate to our cause, or partner with us.",
    url: "https://digitalrevolution.shop",
    siteName: "Digital Revolution",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Digital Revolution - Expanding Access to Technology for All",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Revolution - Expanding Access to Technology for All",
    description:
      "Join the Digital Revolution! We're expanding access to technology, STEM education, and digital literacy for underserved communities.",
    images: ["/og-image.jpg"],
    creator: "@digitalrevolution",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/site.webmanifest",
  category: "technology",
  classification: "Social Impact Technology",
  other: {
    "DC.title": "Digital Revolution - Expanding Access to Technology",
    "DC.creator": "Digital Revolution",
    "DC.subject":
      "Digital Equity, STEM Education, Technology Access, Social Impact",
    "DC.description":
      "Expanding access to technology, STEM education, and digital literacy for underserved communities worldwide",
    "DC.publisher": "Digital Revolution",
    "DC.contributor": "Digital Revolution",
    "DC.date": "2025",
    "DC.type": "Organization",
    "DC.format": "text/html",
    "DC.identifier": "https://digitalrevolution.shop",
    "DC.language": "en",
    "DC.coverage": "Global",
    "DC.rights": "Copyright 2025 Digital Revolution",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Digital Revolution",
    description:
      "Expanding access to technology, STEM education, and digital literacy for underserved communities worldwide",
    url: "https://digitalrevolution.shop",
    logo: "https://digitalrevolution.shop/Assets/Logos/lightDRLogo.svg",
    foundingDate: "2025",
    founder: {
      "@type": "Person",
      name: "Ramon McDargh-Mitchell",
      jobTitle: "Founder & CEO",
      description: "Digital Rights Advocate and STEM Education Champion",
    },
    mission:
      "To expand access to technology, STEM education, and digital literacy for underserved communities worldwide",
    areaServed: {
      "@type": "Place",
      name: "Global",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digital Revolution Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "STEM Education Programs",
            description:
              "Digital literacy and STEM education programs for underserved communities",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Digital Infrastructure Access",
            description:
              "Providing reliable internet connectivity and modern computing resources",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Community Technology Training",
            description:
              "Teaching essential computer skills and internet safety",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Mission-Driven Merchandise",
            description:
              "Apparel and products that support digital equity and STEM education",
          },
        },
      ],
    },
    sameAs: [
      "https://github.com/digitalrevolution",
      "https://linkedin.com/company/digitalrevolution",
      "https://twitter.com/digitalrevolution",
      "https://instagram.com/digitalrevolution",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "General Inquiry",
      email: "info@digitalrevolution.shop",
      availableLanguage: "English",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    knowsAbout: [
      "Digital Equity",
      "STEM Education",
      "Digital Literacy",
      "Technology Access",
      "Community Development",
      "Educational Technology",
      "Social Impact",
      "Digital Rights",
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Donation Opportunities",
          description:
            "Support our mission through one-time or recurring donations",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Partnership Programs",
          description:
            "Partner with us to expand digital equity in your community",
        },
      },
    ],
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Digital Revolution",
    url: "https://digitalrevolution.shop",
    description:
      "Expanding access to technology, STEM education, and digital literacy for underserved communities",
    publisher: {
      "@type": "Organization",
      name: "Digital Revolution",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://digitalrevolution.shop/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://digitalrevolution.shop",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: "https://digitalrevolution.shop/about",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Shop",
        item: "https://digitalrevolution.shop/shop",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Donate",
        item: "https://digitalrevolution.shop/donate",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Partners",
        item: "https://digitalrevolution.shop/partners",
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Viewport and mobile optimization */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta name="theme-color" content="#1e293b" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData),
          }}
        />

        {/* Favicon and icons - Multiple formats for cross-browser compatibility */}
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#1e293b" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Additional SEO meta tags */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />

        {/* Language and region */}
        <meta name="language" content="English" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />

        {/* Social media optimization */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Digital Revolution" />
        <meta property="article:author" content="Digital Revolution" />

        {/* Twitter Card optimization */}
        <meta name="twitter:site" content="@digitalrevolution" />
        <meta name="twitter:creator" content="@digitalrevolution" />

        {/* Performance hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={`${localFont.variable} antialiased`}>{children}</body>
    </html>
  );
}
