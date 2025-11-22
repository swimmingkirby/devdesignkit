import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dev Design Kit",
  description: "Next.js project with shadcn/ui and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

