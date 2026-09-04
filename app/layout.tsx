import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FlashcardsProvider } from "@/lib/flashcards/context";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "die·der·das — German article flashcards",
  description:
    "A flashcard game for learning and practicing German noun articles.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col text-zinc-900">
        <FlashcardsProvider>
          <NavBar />
          <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-8 sm:py-12 print:max-w-none print:p-0">
            {children}
          </main>
        </FlashcardsProvider>
      </body>
    </html>
  );
}
