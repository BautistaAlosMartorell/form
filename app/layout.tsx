import type { Metadata } from "next";
import { Red_Hat_Text, Roboto } from "next/font/google";
import "./globals.css";


const redHatText = Red_Hat_Text({
  subsets: ["latin"],
  variable: "--font-red-hat", // Variable CSS para usar en Tailwind u otros estilos
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "---roboto", // Variable CSS para usar en Tailwind u otros estilos
});

export const metadata: Metadata = {
  title: "Encuesta para Alumnos - Instituto Comercial Pío X",
  description: "Comparte tu opinión.",
  icons:"/logopio.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${redHatText.variable} ${roboto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
