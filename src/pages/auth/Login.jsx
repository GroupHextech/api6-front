import * as React from "react";
import { useState, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebaseConfig";
import { AuthContext } from "../../services/authContext";
import { useNavigate } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        HexTech
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(email, password);
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (user) {
    console.log("Esse é o usuário:", user);
    setAuthenticated(true);
    navigate("/");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Grid container sx={{ height: "100vh" }}>
        <Grid
          item
          xs={12}
          sx={{
            height: { md: "50vh", sm: "33vh", xs: "33vh" }, // Gradient background height
            background:
              "linear-gradient(to right, rgba(0,0,0,1) 25%, rgba(0,0,255,0.5) 100%)",
          }}
        >
          <Grid container sx={{ height: "50%" }}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                color: "white", // Text color over gradient
                maxHeight: "50vh",
              }}
            >
              <Typography
                variant="h2"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Welcome back to HexAnalytics
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent", // Background for login form
              }}
            >
              {/* Login form content here */}
              <Box
                sx={{
                  margin: "auto",
                  width: "100%",
                  maxWidth: "800px",
                }}
              >
                <Box
                  sx={{
                    minHeight: { md: "100vh", xs: "33vh"},
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      maxWidth: "800px", // Defina a largura máxima do modal aqui
                      padding: "20px",
                      backgroundColor: "#fff",
                      border: "1px solid rgba(0, 0, 0, 0.2)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                    }}
                  >
                    <Box>
                      <div style={{width:"100%", justifyContent:"center", display:"flex"}}>
                        <img src="../../assets/dino-icon.svg" width={"80px"} />{" "}
                      </div>
                      <Typography component="h1" variant="h5" sx={{justifyContent:"center", display:"flex"}}>
                        Sign in
                      </Typography>
                      <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 3 }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              required
                              fullWidth
                              id="email"
                              label="Email Address"
                              name="email"
                              autoComplete="email"
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              required
                              fullWidth
                              name="password"
                              label="Password"
                              type="password"
                              id="password"
                              autoComplete="new-password"
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </Grid>
                        </Grid>
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                          onClick={handleSignIn}
                        >
                          Sign In
                        </Button>
                        <Grid container justifyContent="flex-end">
                          <Grid item>
                            <Link href="/register" variant="body2">
                              I don't have account yet
                            </Link>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                    {/* <Copyright /> */}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
