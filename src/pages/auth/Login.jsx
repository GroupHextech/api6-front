import * as React from "react";
import { useState, useContext } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../services/authContext";
import { handleGoogleLoginSuccess } from "../../services/authService";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import QRCodeService from "../../services/QRCodeService";
import Alert from "@mui/material/Alert";

function LoadingAnimation() {
  return (
    <img
      src="../../assets/loading.png"
      alt="Loading..."
      style={{
        width: "500px", // Defina a largura da imagem
        height: "500px", // Defina a altura da imagem
        position: "absolute", // Posição absoluta para centralizar
        top: "50%", // Alinhe a parte superior a 50% da tela
        left: "50%", // Alinhe a esquerda a 50% da tela
        transform: "translate(-50%, -50%)", // Translação para centralizar
        animation: "shake 0.5s infinite alternate", // Adiciona uma animação CSS para fazer o shake
      }}
    />
  );
}

const defaultTheme = createTheme();

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setAuthenticated, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Estado para controlar a etapa do formulário
  const [googleAuthCode, setGoogleAuthCode] = useState(""); // Estado para o código do Google Authenticator
  const [verifying, setVerifying] = useState(false); // Estado para atrasar a verificação do formulário
  const [showErrorAlert, setShowErrorAlert] = useState(false); // estado para controlar a exibição do alerta de erro
  const [tempUserData, setTempUserData] = useState(null); // Estado para armazenar os dados do usuário temporariamente
  const [userEmail, setUserEmail] = useState(""); // Estado para armazenar o e-mail do usuário

  const handleSignInWithGoogle = async () => {
    setSignInLoading(true);
    setError(null);

    try {
      const { user, userData } = await handleGoogleLoginSuccess();
      if (user) {
        setUserEmail(user.email); // Armazena o e-mail do usuário
        setTempUserData(userData); // Armazena os dados do usuário temporariamente
        setStep(2); // Muda para a etapa 2 se o login inicial for bem-sucedido
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setError("Failed to sign in with Google.");
    } finally {
      setSignInLoading(false);
    }
  };

  const handleVerifyGoogleAuthCode = async (e) => {
    e.preventDefault();
    setVerifying(true); // Ativa o estado de verificação
    setLoading(true);
    setError(null);

    try {
      const verificationResult = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(QRCodeService.verifyToken(userEmail, googleAuthCode));
        }, 1000); // Simula um tempo de espera de 1 seg
      });
      if (verificationResult === "Verified") {
        setUserData(tempUserData); // Define os dados do usuário após a verificação bem-sucedida
        setAuthenticated(true);
        localStorage.setItem("isAuthenticated", true);
        navigate("/");
      } else {
        setError("Invalid Google Authenticator code.");
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error("Error verifying Google Authenticator code:", error);
      setError("Error verifying Google Authenticator code.");
      setShowErrorAlert(true); // Exibir o alerta de erro
    } finally {
      setLoading(false);
      setVerifying(false); // Desativa o estado de verificação
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

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
                    {step === 1 ? (
                      <Box>
                        <div
                          style={{
                            width: "100%",
                            justifyContent: "center",
                            display: "flex",
                          }}
                        >
                          <img
                            src="../../assets/dino-icon.svg"
                            width={"80px"}
                          />{" "}
                        </div>
                        <Typography
                          component="h1"
                          variant="h5"
                          sx={{ justifyContent: "center", display: "flex" }}
                        >
                          Sign in
                        </Typography>
                        <Box align="center" sx={{ mt: 3 }}>
                          <button
                            className="gsi-material-button"
                            onClick={handleSignInWithGoogle}
                          >
                            <div className="gsi-material-button-state"></div>
                            <div className="gsi-material-button-content-wrapper">
                              <div className="gsi-material-button-icon">
                                <svg
                                  version="1.1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 48 48"
                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                  style={{ display: "block" }}
                                >
                                  <path
                                    fill="#EA4335"
                                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                  ></path>
                                  <path
                                    fill="#4285F4"
                                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                  ></path>
                                  <path
                                    fill="#FBBC05"
                                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                  ></path>
                                  <path
                                    fill="#34A853"
                                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                  ></path>
                                  <path fill="none" d="M0 0h48v48H0z"></path>
                                </svg>
                              </div>
                              <span className="gsi-material-button-contents">
                                Sign in with Google
                              </span>
                              <span style={{ display: "none" }}>
                                Sign in with Google
                              </span>
                            </div>
                          </button>
                          {signInLoading && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <CircularProgress
                                size={24}
                                sx={{
                                  color: green[500],
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  marginTop: "-12px",
                                  marginLeft: "-12px",
                                }}
                              />
                            </Box>
                          )}
                          {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                              {error}
                            </Alert>
                          )}
                          <Grid container justifyContent="flex-end">
                            <Grid item>
                              <Link href="/register" variant="body2">
                                I don't have account yet
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
                          Enter Google Authenticator Code
                        </Typography>
                        <Box
                          component="form"
                          noValidate
                          onSubmit={handleVerifyGoogleAuthCode}
                          sx={{ mt: 3 }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextField
                                required
                                fullWidth
                                id="googleAuthCode"
                                label="Google Authenticator Code"
                                name="googleAuthCode"
                                autoComplete="off"
                                autoFocus={step === 2}
                                onChange={(e) =>
                                  setGoogleAuthCode(e.target.value)
                                }
                                inputProps={{ maxLength: 6 }} // Restringe a 6 dígitos
                              />
                            </Grid>
                          </Grid>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={googleAuthCode.length !== 6} // Desabilita se não tiver 6 dígitos
                          >
                            Verify Code
                          </Button>
                          {showErrorAlert && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                              {error}
                            </Alert>
                          )}
                        </Box>
                      </Box>
                    )}
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