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


import TermsAndConditions from "../../components/register/TermsAndConditions";
import { Navigate } from "react-router-dom";
import { Image } from "@mui/icons-material";

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
  const [phone , setPhone] = useState("")
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [name, setName] = useState("");
  const [termOfEmail, setTermOfEmail] = useState(true);
  const [termOfSms, setTermOfSms] = useState(true);
  const [showTermsAlert, setShowTermsAlert] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [employId, setEmployId] = useState("");

  const navigate = useNavigate();

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  if (loading) {
    return <p>Carregando...</p>;
  }

  //nome, email, cargo, departamento, registro 
  const userCollectionRef = collection(firestore, "users");

  async function createUser(uid) {
    const userRef = doc(userCollectionRef, uid); // Referência ao documento usando o uid como id
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
        role: "user",
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

  const handleCheckboxEmailChange = (event) => {
    setTermOfEmail(event.target.checked);
  };
  const handleCheckboxSmsChange = (event) => {
    setTermOfSms(event.target.checked); 
  };

const handleAgreeTerms = (e) => {
  e.preventDefault();
  if (password.length < 6) {
    alert("The password must have at least 6 characters.");
    return;
  }
  if (password !== confirmationPassword) {
    alert("Passwords do not match. Please enter matching passwords in both fields.");
    return;
  }
  setShowTermsAlert(false);


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
                backgroundColor: "transparent", // Background for login form
              }}
            >
              {/* Register form content here */}
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
                      <Typography component="h1" variant="h5">
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
                              label="Job Title"
                              name="job"
                              onChange={(e) => setJobTitle(e.target.value)}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
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
                          <Grid item xs={12} sm={6}>
                            <TextField                     
                              fullWidth
                              id="phone"
                              label="Phone Number"
                              name="phone"
                              autoComplete="phone"
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={6}>
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
                          <Grid item xs={6}>
                            <TextField
                              required
                              fullWidth
                              name="Confirm"
                              label="Confirm Password"
                              type="password"
                              id="confirmPassword"
                              autoComplete="new-password"
                              onChange={(e) => setConfirmationPassword(e.target.value)}

                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  value="allowExtraEmails"
                                  color="primary"
                                  checked={termOfEmail}
                                  onChange={handleCheckboxEmailChange}
                                />
                              }
                              label="I want to receive inspiration, marketing promotions and updates via email."
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  value="allowExtraSms"
                                  color="primary"
                                  checked={termOfSms}
                                  onChange={handleCheckboxSmsChange}
                                />
                              }
                              label="I want to receive updates via SMS."
                            />
                          </Grid>
                        </Grid>
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                          onClick={handleSignUpClick}
                        >
                          Sign Up
                        </Button>
                        {showTermsAlert && (
                          <TermsAndConditions
                            open={showTermsAlert}
                            handleClose={() => setShowTermsAlert(false)}
                            handleAgree={handleAgreeTerms}
                          />
                        )}
                        <Grid container justifyContent="flex-end">
                          <Grid item>
                            <Link href="/login" variant="body2">
                              Already have an account? Sign in
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
