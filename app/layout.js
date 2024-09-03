import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cardly",
  description: "Flashcard SaaS App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <body className={inter.className}>{children}</body>
        </ThemeProvider>
      </html>
    </ClerkProvider>
  );
}