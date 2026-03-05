import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PPM Dashboard",
  description: "Tableau de bord de gestion de portefeuille de projets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
