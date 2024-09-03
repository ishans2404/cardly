import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cardly",
  description: "Flashcard SaaS App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClerkProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <body className={inter.className}>
            {children}
            <GoogleAnalytics gaId="G-FEP1TF34BN" />
          </body>
        </ThemeProvider>
      </ClerkProvider>
    </html>
  );
}
