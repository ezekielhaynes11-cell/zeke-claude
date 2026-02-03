import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forthner's Body Shop | Heidelberg's Standard for Collision Excellence",
  description: "40+ years of precision collision repair and restoration. Expert painting, precision bodywork, and OEM parts. Serving Jasper County with strict safety protocols since 1984.",
  keywords: "collision repair, body shop, auto body, Heidelberg MS, car restoration, frame straightening, auto painting",
  openGraph: {
    title: "Forthner's Body Shop | Collision Excellence",
    description: "Heidelberg's trusted name in precision collision repair for over 40 years.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#1a1a1a] text-white font-sans">
        {children}
      </body>
    </html>
  );
}
