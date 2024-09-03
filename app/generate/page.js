"use client";

import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  CircularProgress,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Script from "next/script";

// Create a custom theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#01C38D',
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
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent uppercase transformation
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1E1E1E", // Custom background for cards
        },
      },
    },
  },
});

export default function Generate() {
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useUser();

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }
      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/save-flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, setName, flashcards }),
      });

      if (!response.ok) {
        throw new Error("Failed to save flashcards");
      }

      alert("Flashcards saved successfully!");
      setDialogOpen(false);
      setSetName("");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    } finally {
      setSaving(false);
    }
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
    <ThemeProvider theme={theme}>
      <SignedIn>
        <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}>
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
          
          <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
            <Typography variant="h4" gutterBottom align="center" color="text.primary">
              Generate Flashcards
            </Typography>
            
            <Card sx={{ mt: 4, p: 3, boxShadow: 3 }}>
              <CardContent>
                <TextField
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  label="Enter text"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Generate Flashcards"
                  )}
                </Button>
              </CardContent>
            </Card>

            {flashcards.length > 0 && (
              <Box sx={{ mt: 6 }}>
                <Typography variant="h5" gutterBottom color="text.primary">
                  Generated Flashcards
                </Typography>
                <Grid container spacing={3}>
                  {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 3 } }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" gutterBottom color="text.secondary">
                            Front:
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {flashcard.front}
                          </Typography>
                          <Typography variant="subtitle1" gutterBottom color="text.secondary">
                            Back:
                          </Typography>
                          <Typography variant="body2">
                            {flashcard.back}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setDialogOpen(true)}
                    sx={{ py: 1.5, px: 4 }}
                  >
                    Save Flashcards
                  </Button>
                </Box>
              </Box>
            )}

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
              <DialogTitle>Save Flashcard Set</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please enter a name for your flashcard set.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Set Name"
                  type="text"
                  fullWidth
                  value={setName}
                  onChange={(e) => setSetName(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)} color="primary">
                  Cancel
                </Button>
                <Button onClick={saveFlashcards} color="primary" disabled={saving}>
                  {saving ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
        </Box>
      </SignedIn>
    </ThemeProvider>
    </>
  );
}
