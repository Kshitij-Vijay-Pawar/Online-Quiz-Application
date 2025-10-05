import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QuizProvider } from '@/contexts/QuizContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Online Quiz App",
  description: "Take a quiz and test your knowledge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QuizProvider>
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <a href="/" className="text-xl font-bold text-gray-900">
                    🧠 Quiz App
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  <a
                    href="/admin"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    🔧 Admin Panel
                  </a>
                </div>
              </div>
            </div>
          </nav>
          {children}
        </QuizProvider>
      </body>
    </html>
  );
}
