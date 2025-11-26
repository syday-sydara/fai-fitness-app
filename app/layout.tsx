import { Toaster } from "react-hot-toast";
import "./globals.css"; // import global styles
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-gray-50 dark:bg-gray-900">
      <head>
        <title>Fitness Dashboard</title>
        <meta name="description" content="Track workouts, weights, and readiness" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} min-h-screen transition-colors`}>
        <main>{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}