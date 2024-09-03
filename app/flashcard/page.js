"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { 
  Button, Container, Typography, Grid, Card, CardActionArea, CardContent, 
  Box, AppBar, Toolbar, ThemeProvider, createTheme, CssBaseline, Zoom, Grow, Switch, FormControlLabel
} from "@mui/material";
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import Script from "next/script";

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#132D46',
    },
    secondary: {
      main: '#03DAC6',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
});

export default function Flashcard() {
  const { user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(true);
  const searchParams = useSearchParams();
  const setName = searchParams.get("id");

  useEffect(() => {
    async function getFlashcards() {
      if (!setName || !user) return;
      const setDocRef = doc(db, "users", user.id, "flashcardSets", setName);
      const docSnap = await getDoc(setDocRef);
      if (docSnap.exists()) {
        setFlashcards(docSnap.data().flashcards);
      }
    }
    getFlashcards();
  }, [setName, user]);

  const handleCardClick = (index) => {
    setFlipped(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleNextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  };

  const handleSwitchChange = (event) => {
    setShowAll(event.target.checked);
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                Cardly
              </Link>
            </Typography>
            <Button color="inherit" component={Link} href="/flashcards">
              My Flashcards  
            </Button>
            <UserButton />
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 4 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>{setName}</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={showAll}
                onChange={handleSwitchChange}
                color="secondary"
              />
            }
            label={showAll ? "Show All" : "Show One at a Time"}
            sx={{ mb: 4 }}
          />
          {showAll ? (
            <Grid container spacing={3}>
              {flashcards.map((flashcard, index) => (
                <Grow in={true} key={index} timeout={300 * (index + 1)}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card 
                      raised
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: (theme) => theme.shadows[10],
                        },
                      }}
                    >
                      <CardActionArea 
                        onClick={() => handleCardClick(index)}
                        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                      >
                        <CardContent>
                          <Typography variant="body1" align="center">
                            {flipped[index] ? flashcard.back : flashcard.front}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                </Grow>
              ))}
            </Grid>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Zoom in={true} key={currentIndex}>
                <Card 
                  raised
                  sx={{
                    width: '100%',
                    maxWidth: 400,
                    height: 250,
                    display: 'flex',
                    mb: 4,
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <CardActionArea 
                    onClick={() => handleCardClick(currentIndex)}
                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  >
                    <CardContent>
                      <Typography variant="body1" align="center">
                        {flipped[currentIndex] ? flashcards[currentIndex]?.back : flashcards[currentIndex]?.front}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Zoom>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button onClick={handlePrevCard} variant="contained" color="primary">Previous</Button>
                <Button onClick={handleNextCard} variant="contained" color="primary">Next</Button>
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
    </>
  );
}
