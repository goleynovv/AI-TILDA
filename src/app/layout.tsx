import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI-Tilda - Создайте лендинг с помощью ИИ",
  description:
    "Пройдите короткое интервью, и наш ИИ-помощник создаст для вас продающий лендинг",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
