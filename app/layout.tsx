import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Randevum Barber — Premium Berber Deneyimi",
  description: "Modern berber salonu yönetim sistemi. Randevu alın, hizmetlerimizi keşfedin.",
  keywords: "berber, randevu, saç kesimi, sakal, barbershop, kuaför",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
