import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "./components/header";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "THREEDITRON | 3D Printing Services",
//   description: "Professional 3D Printing, Prototyping and Engineering Solutions.",
// };

export const metadata = {
  title: {
    default:
      "THREEDITRON | Online 3D Printing Services in India",
    template: "%s | THREEDITRON",
  },

  description:
    "Professional Online 3D Printing Services in India. Upload your STL file, get instant quotes, rapid prototyping, product development, FDM printing, engineering models, and custom manufacturing.",
  keywords: [
    "3D Printing",
    "3D Printing India",
    "Online 3D Printing",
    "Rapid Prototyping",
    "STL Printing",
    "PLA Printing",
    "ABS Printing",
    "PETG Printing",
    "Engineering Prototype",
    "Product Development",
    "Custom 3D Printing",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "THREEDITRON | 3D Printing Services",

    description:
      "Professional 3D Printing and Rapid Prototyping Solutions.",

    url: "https://threeditron.com",
    alternates: {
      canonical: "https://threeditron.com",
    },

    siteName: "THREEDITRON",
    metadataBase: new URL("https://threeditron.com"),

    images: [
      {
        url: "/images/main-logo.png",
        width: 1200,
        height: 630,
      },
    ],
    authors: [
      {
        name: "THREEDITRON",
      },
    ],
    creator: "THREEDITRON",
    publisher: "THREEDITRON",

    locale: "en_IN",
    type: "website",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "THREEDITRON",
              url: "https://threeditron.com",
              logo: "https://threeditron.com/images/main-logo.png",
              telephone: "+917209827299",
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
                addressLocality: "Jamshedpur",
                addressRegion: "Jharkhand",
                // "@type": "831003, shop no. 158, Krishna road, near T.O.P, Sidhgora, Jamshedpur, Jharkhand",
                streetAddress: "shop no. 158, Krishna road, near T.O.P, Sidhgora",
                postalCode: "831003",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <Header />
        <Toaster position="top-center" toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #eab308",
          },
        }} reverseOrder={false} />
        <div className="max-w-[1200px] mx-auto">{children}</div>

        <Footer />

      </body>
    </html>
  );
}
