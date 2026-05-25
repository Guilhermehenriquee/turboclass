import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://turboclass.com.br"),
  title: {
    default: "TurboClass - Marketplace de carros turbo e preparados",
    template: "%s | TurboClass",
  },
  description:
    "Compre, venda e anuncie carros turbo, preparados, swaps, esportivos, premium e projetos especiais no marketplace gearhead da TurboClass.",
  icons: {
    icon: [
      { url: "/icon/turboclass-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon/turboclass-64.png", sizes: "64x64", type: "image/png" },
      { url: "/icon/turboclass.ico", sizes: "any" },
      { url: "/logo/turboclass.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon/turboclass.ico",
    apple: "/icon/turboclass-180.png",
  },
  openGraph: {
    title: "TurboClass",
    description: "Marketplace automotivo premium para carros turbo, preparados, swaps e projetos especiais.",
    url: "https://turboclass.com.br",
    siteName: "TurboClass",
    images: [
      {
        url: "/hero-performance.png",
        width: 1536,
        height: 864,
        alt: "Carro premium em estrada",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
