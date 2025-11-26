import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitness Dashboard",
  description: "Track workouts, weights, and readiness",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-gray-50 dark:bg-gray-900">
      <body className="min-h-screen transition-colors">
        <main>{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}