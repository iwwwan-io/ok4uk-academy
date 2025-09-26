import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Azeret_Mono, Inter } from "next/font/google";
import { Toaster } from "sonner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "OK4UK Academy",
  description: `OK4UK Academy is committed to delivering accessible, accredited
              qualifications and modern learning methods to help individuals
              advance in their careers. We believe education should be flexible,
              practical, and empowering.`,
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = Azeret_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
