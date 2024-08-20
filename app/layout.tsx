import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeArt - Create Stunning Social Images for Your Open Source Projects",
  description: "Enhance your open source packages with CodeArt, the ultimate tool for generating beautiful social images. Boost your project's visibility on social media platforms with custom visuals that capture attention and showcase your code. Effortlessly create and share eye-catching images tailored to your open source projects with CodeArt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
