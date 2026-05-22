import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pet Breed Encyclopedia | AI Pet Health",
  description: "Explore 266+ dog and cat breeds. Radar charts, health info, AI diagnosis, and pet product recommendations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">{children}</body>
    </html>
  );
}