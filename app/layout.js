import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme';
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cardly",
  description: "Flashcard SaaS App",
};

export default function RootLayout({ children }) {
  return (
    <>
    <Script
      id='gtm'
      strategy='afterInteractive'
      dangerouslySetInnerHtml={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-TGPKWNC2');`
      }}
    />
    <ClerkProvider>
      <html lang="en">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <body className={inter.className}>{children}</body>
        </ThemeProvider>
      </html>
    </ClerkProvider>
    </>
  );
}