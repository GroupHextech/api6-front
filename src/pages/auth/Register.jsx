import * as React from "react";
import { useState } from "react";
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
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../services/firebaseConfig";
import { doc, setDoc, addDoc, collection } from "@firebase/firestore";
import { useNavigate } from "react-router-dom";
import { serverTimestamp } from "@firebase/firestore";

import QRCodeService from "../../services/QRCodeService";

import TermsAndConditions from "../../components/register/TermsAndConditions";

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

export default function Register() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [name, setName] = useState("");
  const [termOfEmail, setTermOfEmail] = useState(true);
  const [termOfSms, setTermOfSms] = useState(true);
  const [showTermsAlert, setShowTermsAlert] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showSecondForm, setShowSecondForm] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [employId, setEmployId] = useState("");

  const [token, setToken] = useState("");
  const [qrCode, setQRCode] = useState("");

  const navigate = useNavigate();

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  if (loading) {
    return <p>Carregando...</p>;
  }

  const userCollectionRef = collection(firestore, "users");

  async function createUser(uid) {
    const userRef = doc(userCollectionRef, uid);
    try {
      await setDoc(userRef, {
        useTerm: true,
        name,
        email,
        jobTitle,
        department,
        employId,
        phone,
        termOfEmail,
        termOfSms,
        role: "USER",
        foto: "../../assets/user.png",
        createdAt: serverTimestamp(),
      });
      console.log("User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  };

  const handleSignUpClick = () => {
    setShowTermsAlert(true);
  };

  const handleAgreeTerms = () => {
    setTermsAccepted(true);
    setShowTermsAlert(false);
  };

  const handleNextClick = async () => {
    setShowSecondForm(true);
    try {
      const generatedQRCode = await QRCodeService.generateQRCode(email);
      if (generatedQRCode.startsWith("data:image/png;base64,")) {
        setQRCode(generatedQRCode);
      } else {
        console.error("Error generating QR code: Invalid format");
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleVerifyToken = async (token) => {
    try {
      const verificationResult = await QRCodeService.verifyToken(email, token);
      if (verificationResult === "Verified") {
        createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            const userUid = user.uid;
            createUser(userUid);
            navigate("/");
          })
          .catch((error) => {
            console.error("Error creating user:", error);
          });
      } else {
        alert("Invalid token. Please enter a valid token.");
      }
    } catch (error) {
      console.error("Error verifying Google Authenticator code:", error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Grid container sx={{ height: "100vh" }}>
        <Grid
          item
          xs={12}
          sx={{
            height: { md: "50vh", sm: "33vh", xs: "33vh" },
            background: "linear-gradient(to right, rgba(0,0,0,1) 25%, rgba(0,0,255,0.5) 100%)",
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
                color: "white",
                maxHeight: "50vh",
              }}
            >
              <Typography
                variant="h2"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Hello! It's great to meet you.
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
                backgroundColor: "transparent",
              }}
            >
              <Box
                sx={{
                  margin: "auto",
                  width: "100%",
                  maxWidth: "800px",
                }}
              >
                <Box
                  sx={{
                    minHeight: { md: "100vh", xs: "33vh" },
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
                      maxWidth: "800px",
                      padding: "20px",
                      backgroundColor: "#fff",
                      border: "1px solid rgba(0, 0, 0, 0.2)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                    }}
                  >
                    {!showSecondForm ? (
                      <Box>
                        <div style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                          <img src="../../assets/dino-icon.svg" width={"80px"} />
                        </div>
                        <Typography
                          component="h1"
                          variant="h5"
                          sx={{ justifyContent: "center", display: "flex" }}
                        >
                          Create Account
                        </Typography>
                        <Box
                          component="form"
                          noValidate
                          onSubmit={handleSubmit}
                          sx={{ mt: 3 }}
                        >
                          <Grid container spacing={1}>
                            <Grid item xs={8}>
                              <TextField
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                name="name"
                                autoComplete="name"
                                onChange={(e) => setName(e.target.value)}
                              />
                            </Grid>

                            <Grid item xs={4}>
                              <TextField
                                required
                                fullWidth
                                id="employId"
                                label="Registration Number"
                                name="employId"
                                autoComplete="employId"
                                onChange={(e) => setEmployId(e.target.value)}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <TextField
                                required
                                fullWidth
                                id="department"
                                label="Department"
                                name="department"
                                onChange={(e) => setDepartment(e.target.value)}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <TextField
                                required
                                fullWidth
                                id="jobTitle"
                                label="Title"
                                name="jobTitle"
                                autoComplete="jobTitle"
                                onChange={(e) => setJobTitle(e.target.value)}
                              />
                            </Grid>

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
                                id="phone"
                                label="Phone Number"
                                name="phone"
                                autoComplete="phone"
                                onChange={(e) => setPhone(e.target.value)}
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

                            <Grid item xs={12}>
                              <TextField
                                required
                                fullWidth
                                name="confirmationPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmationPassword"
                                autoComplete="new-password"
                                onChange={(e) => setConfirmationPassword(e.target.value)}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                onClick={handleSignUpClick}
                              >
                                Read the terms of use
                              </Button>
                            </Grid>

                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="primary"
                                    required
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                  />
                                }
                                label="I accept the terms of use"
                              />
                            </Grid>
                          </Grid>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!termsAccepted}
                            onClick={handleNextClick}
                          >
                            Next
                          </Button>
                          <Grid container justifyContent="flex-end">
                            <Grid item>
                              <Link href="/login" variant="body2">
                              Already have an account? Sign in
                              </Link>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Typography
                          component="h1"
                          variant="h5"
                          sx={{ justifyContent: "center", display: "flex" }}
                        >
                          Verify QR Code
                        </Typography>
                        <Box
                          component="form"
                          noValidate
                          onSubmit={handleSubmit}
                          sx={{ mt: 3 }}
                        >
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              {qrCode && (
                                <div style={{ textAlign: "center", margin: "5px 0" }}>
                                  <Button variant="outlined" disableElevation href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=pt_BR&gl=US">
                                    Download Google Authenticator
                                  </Button>
                                  <img src={qrCode} alt="QR Code" style={{ maxWidth: "100%", height: "auto" }}/>
                                </div>
                              )}
                            </Grid>

                            <Grid item xs={12}>
                              <TextField
                                required
                                fullWidth
                                id="token"
                                label="Token"
                                name="token"
                                autoComplete="off"
                                onChange={(e) => setToken(e.target.value)}
                              />
                            </Grid>
                          </Grid>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => handleVerifyToken(token)}
                          >
                            Finish
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <TermsAndConditions open={showTermsAlert} onAgree={handleAgreeTerms} />
    </ThemeProvider>
  );
}
