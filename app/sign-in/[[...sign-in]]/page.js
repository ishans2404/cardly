// lets existing users use authentication
import React from "react";
import Script from "next/script";
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
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
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Cardly
          </Typography>
          <Button color="inherit">
            <Link
              href="/"
              passHref
              style={{ color: "inherit", textDecoration: "none" }}
            >
              HOME
            </Link>
          </Button>
          <Button color="inherit">
            <Link
              href="/sign-up"
              passHref
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Sign Up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      {/* Sign-In Section */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ textAlign: "center", my: 4 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Sign In
        </Typography>
        <SignIn />
      </Box>
    </>
  );
}