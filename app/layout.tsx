import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BestResume - AI Powered Resume Builder",
  description: "Create professional resumes in minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
