import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-gray-50 dark:bg-gray-900">
      <head>
        <title>Fitness Dashboard</title>
        <meta name="description" content="Track workouts, weights, and readiness" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen transition-colors">
        <main>{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}