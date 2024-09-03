"use client";
import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Container, Typography, Grid, Card, CardActionArea, CardContent, AppBar, Toolbar, Button, CircularProgress, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from "next/link";
import Script from "next/script";

export default function Flashcards() {
  const { user } = useUser();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcardSets() {
      if (!user) return;
      setIsLoading(true);
      try {
        const userDocRef = doc(db, "users", user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFlashcardSets(userData.flashcardSets || []);
        }
      } catch (error) {
        console.error("Error fetching flashcard sets:", error);
        alert("An error occurred while fetching your flashcard sets. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    getFlashcardSets();
  }, [user]);

  const handleCardClick = (setName) => {
    router.push(`/flashcard?id=${setName}`);
  };

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
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Cardly
            </Link>
          </Typography>
          <Typography variant="h7" sx={{ flexGrow: 0.01, marginLeft: '100px' }}>
            <Link href="/generate" style={{ color: 'inherit', textDecoration: 'none' }}>
              Generate    
            </Link>
          </Typography>
          {/* <Button color="inherit" component={Link} href="/generate">
            Generate
          </Button> */}
          <UserButton />
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>Your Flashcard Sets</Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {flashcardSets.map((setName, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(setName)}>
                    <CardContent>
                      <Typography variant="h6">{setName}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
