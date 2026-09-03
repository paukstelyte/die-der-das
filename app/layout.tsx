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
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
        <FlashcardsProvider>
          <NavBar />
          <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
            {children}
          </main>
        </FlashcardsProvider>
      </body>
    </html>
  );
}
