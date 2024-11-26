import { ButtonIcon } from "@/ui";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { Search } from "./components/search";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Read",
  description: "Đọc sách Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        id="app-container"
        suppressHydrationWarning={false}
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <header id="app-header">
          <Link href={"/"}>
            <ButtonIcon icon="home" />
          </Link>

          <Search />
        </header>
        {children}
      </body>
    </html>
  );
}
