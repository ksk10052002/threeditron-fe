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

export const metadata: Metadata = {
  title: "THREEDITRON | 3D Printing Services",
  description: "Professional 3D Printing, Prototyping and Engineering Solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
