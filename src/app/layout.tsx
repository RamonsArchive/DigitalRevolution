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
  title: "Digital Revolution",
  description: "Expanding access to techonlogy for all",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${localFont.variable} antialiased`}>{children}</body>
    </html>
  );
}
