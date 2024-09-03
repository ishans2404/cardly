"use client";

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Grid, Card, CardContent, Divider } from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { PayPalButton } from "react-paypal-button-v2";

import Script from 'next/script';


const subscriptionTiers = [
  {
    name: 'Basic',
    price: 9.99,
    features: ['100 AI-generated flashcards/month', 'Basic analytics', 'Web access'],
  },
  {
    name: 'Pro',
    price: 19.99,
    features: ['Unlimited AI-generated flashcards', 'Advanced analytics', 'Web & mobile access', 'Customizable templates'],
  },
  {
    name: 'Enterprise',
    price: 49.99,
    features: ['All Pro features', 'Team collaboration', 'API access', 'Dedicated support'],
  },
];

export default function Home() {
  const [selectedTier, setSelectedTier] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const addPaypalScript = () => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=ASxtiojaiZ7UB__tmUKRV72MKpxXQiVuqNhE-wqSkI7l128Q2JPgjfbbxC173wpyQ1WP6XnOO7s2qXFU`;
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    };
    addPaypalScript();
  }, []);

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

    <Box sx={{ bgcolor: '#f7f9fc', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#3a86ff' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Cardly
          </Typography>
          <SignedOut>
            <Button color="inherit" component={Link} href="/sign-in">
              Login
            </Button>
            <Button color="inherit" component={Link} href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
          <Typography variant="h7" sx={{ flexGrow: 0.01, marginLeft: '100px' }}>
            <Link href="/flashcards" style={{ color: 'inherit', textDecoration: 'none' }}>
            My Flashcards  
            </Link>
          </Typography>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ my: 8, textAlign: "center" }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#3a86ff' }}>
            Welcome to Cardly
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ color: '#4a4a4a' }}>
            Flashcards That Evolve With You
          </Typography>
          <SignedIn>
            <Button 
              variant="contained" 
              sx={{ 
                mt: 4, 
                bgcolor: '#3a86ff', 
                '&:hover': { bgcolor: '#2a75e0' } 
              }} 
              component={Link} 
              href="/generate"
            >
              Get Started
            </Button>
          </SignedIn>
          <SignedOut>
            <Button 
              variant="contained" 
              sx={{ 
                mt: 4, 
                bgcolor: '#3a86ff', 
                '&:hover': { bgcolor: '#2a75e0' } 
              }} 
              component={Link} 
              href="/sign-up"
            >
              Sign Up to Get Started
            </Button>
          </SignedOut>
        </Box>

        <Grid container spacing={4} sx={{ my: 8 }}>
          {subscriptionTiers.map((tier, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#3a86ff' }}>
                    {tier.name}
                  </Typography>
                  <Typography variant="h4" sx={{ mb: 2, color: '#4a4a4a' }}>
                    ${tier.price}/mo
                  </Typography>
                  {tier.features.map((feature, i) => (
                    <Typography key={i} sx={{ mb: 1 }}>
                      • {feature}
                    </Typography>
                  ))}
                </CardContent>
                <Button 
                  variant="contained" 
                  sx={{ 
                    m: 2, 
                    bgcolor: selectedTier === index ? '#2a75e0' : '#3a86ff',
                    '&:hover': { bgcolor: '#2a75e0' } 
                  }}
                  onClick={() => setSelectedTier(index)}
                >
                  {selectedTier === index ? 'Selected' : 'Select'}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>

        {selectedTier !== null && scriptLoaded && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <PayPalButton
              amount={subscriptionTiers[selectedTier].price}
              onSuccess={(details, data) => {
                console.log("Transaction completed:", details);
                // Handle successful payment
              }}
              options={{ 
                clientId: 'ASxtiojaiZ7UB__tmUKRV72MKpxXQiVuqNhE-wqSkI7l128Q2JPgjfbbxC173wpyQ1WP6XnOO7s2qXFU',
                vault: true,
              }}
              onError={(err) => {
                console.error("PayPal Error:", err);
                // Handle error
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
    </>
  );
}