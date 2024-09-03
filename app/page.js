"use client";

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Grid, Card, CardContent, Divider, useTheme } from "@mui/material";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { PayPalButton } from "react-paypal-button-v2";
import { useRouter } from 'next/navigation';

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
  const [hasPaid, setHasPaid] = useState(false);
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const theme = useTheme();

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

    // Check if user has paid
    if (isSignedIn && user) {
      // Here you would typically check with your backend if the user has an active subscription
      // For this example, we'll just use localStorage
      const userHasPaid = localStorage.getItem(`user_${user.id}_paid`) === 'true';
      setHasPaid(userHasPaid);
    }
  }, [isSignedIn, user]);

  const handlePaymentSuccess = (details, data) => {
    console.log("Transaction completed:", details);
    if (isSignedIn && user) {
      localStorage.setItem(`user_${user.id}_paid`, 'true');
      setHasPaid(true);
    }
    router.push('/generate');
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0}>
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
        <Box sx={{ my: 8, textAlign: "center" }} className="fade-in">
          <Typography variant="h1" gutterBottom sx={{ color: 'primary.main' }}>
            Welcome to Cardly
          </Typography>
          <Typography variant="h3" gutterBottom sx={{ color: 'text.secondary' }}>
            Flashcards That Evolve With You
          </Typography>
          <SignedIn>
            <Button 
              variant="contained" 
              sx={{ 
                mt: 4, 
                bgcolor: 'primary.main', 
                '&:hover': { bgcolor: 'primary.dark' } 
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
                bgcolor: 'primary.main', 
                '&:hover': { bgcolor: 'primary.dark' } 
              }} 
              component={Link} 
              href="/sign-up"
            >
              Sign Up to Get Started
            </Button>
          </SignedOut>
        </Box>

        {isSignedIn && !hasPaid && (
          <Grid container spacing={4} sx={{ my: 8 }}>
            {subscriptionTiers.map((tier, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    bgcolor: 'background.paper',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                      {tier.name}
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 2, color: 'text.primary' }}>
                      ${tier.price}/mo
                    </Typography>
                    {tier.features.map((feature, i) => (
                      <Typography key={i} sx={{ mb: 1, color: 'text.secondary' }}>
                        • {feature}
                      </Typography>
                    ))}
                  </CardContent>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      m: 2, 
                      bgcolor: selectedTier === index ? 'primary.dark' : 'primary.main',
                      '&:hover': { bgcolor: 'primary.dark' } 
                    }}
                    onClick={() => setSelectedTier(index)}
                  >
                    {selectedTier === index ? 'Selected' : 'Select'}
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {isSignedIn && !hasPaid && selectedTier !== null && scriptLoaded && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <PayPalButton
              amount={subscriptionTiers[selectedTier].price}
              onSuccess={handlePaymentSuccess}
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

        {isSignedIn && hasPaid && (
          <Box sx={{ textAlign: 'center', my: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              Thank you for your subscription!
            </Typography>
            <Button 
              variant="contained" 
              sx={{ 
                mt: 4, 
                bgcolor: 'primary.main', 
                '&:hover': { bgcolor: 'primary.dark' } 
              }} 
              component={Link} 
              href="/generate"
            >
              Start Creating Flashcards
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}