import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { inter } from "./fonts";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  icon: "/logo.svg",

  title: "Cinescope Dashboard",
  description: "Movie Database and Management Dashboard",
};

import { ThemeProvider } from "@/components/theme-provider";
import Providers from "./providers";

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en" className="light" suppressHydrationWarning>
        <head />
        <body className={`${inter.className} antialiased`}>
          <Providers>
            <Analytics />
            <SpeedInsights />
            <NextTopLoader color="primary" />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </Providers>
        </body>
      </html>
    </>
  );
}
