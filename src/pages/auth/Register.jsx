import React, { useState, useEffect } from "react";
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
import { doc, setDoc, collection, getDocs, query, orderBy, limit } from "@firebase/firestore";
import { useNavigate } from "react-router-dom";
import { serverTimestamp } from "@firebase/firestore";

import QRCodeService from "../../services/QRCodeService";
import TermsAndConditions from "../../components/register/TermsAndConditions";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
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
  const [showTermsAlert, setShowTermsAlert] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState({});
  const [showSecondForm, setShowSecondForm] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [employId, setEmployId] = useState("");
  const [token, setToken] = useState("");
  const [qrCode, setQRCode] = useState("");
  const [terms, setTerms] = useState([]);
  const [termsAcceptedDetails, setTermsAcceptedDetails] = useState([]);
  const [latestVersion, setLatestVersion] = useState(""); // Estado para armazenar a versão mais recente

  const navigate = useNavigate();

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  if (loading) {
    return <p>Carregando...</p>;
  }

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const termsCollection = collection(firestore, "VersaoTermo");
        const termsQuery = query(termsCollection, orderBy("version", "desc"), limit(1));
        const termsSnapshot = await getDocs(termsQuery);
        const latestTerms = termsSnapshot.docs[0].data().terms;
        const version = termsSnapshot.docs[0].data().version; // Obter a versão mais recente

        // Configurar o estado de termos aceitos
        const initialTermsAccepted = {};
        latestTerms.forEach(term => {
          initialTermsAccepted[term.type] = term.type === "USO"; // Marcar USO como obrigatório
        });

        setTerms(latestTerms);
        setTermsAccepted(initialTermsAccepted);
        setLatestVersion(version); // Armazenar a versão mais recente no estado
      } catch (error) {
        console.error("Erro ao buscar os termos:", error);
      }
    };

    fetchTerms();
  }, []);

  

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleSignUpClick = () => {
    setShowTermsAlert(true);
  };

  const handleAgreeTerms = () => {
    setShowTermsAlert(false);
  };

  const handleNextClick = async () => {
    if (!termsAccepted['USO']) {
      alert("Você deve aceitar os termos de uso para continuar.");
      return;
    }

    setShowSecondForm(true);
    try {
      const generatedQRCode = await QRCodeService.generateQRCode(email);
      if (generatedQRCode.startsWith("data:image/png;base64,")) {
        setQRCode(generatedQRCode);
      } else {
        console.error("Erro ao gerar o QR code: Formato inválido");
      }
    } catch (error) {
      console.error("Erro ao gerar o QR code:", error);
    }
  };

  const handleVerifyToken = async (token) => {
    try {
      const verificationResult = await QRCodeService.verifyToken(email, token);
      if (verificationResult === "Verified") {
        await registerUser();
      } else {
        alert("Token inválido. Por favor, insira um token válido.");
      }
    } catch (error) {
      console.error("Erro ao verificar o código do Google Authenticator:", error);
    }
  };

  const registerUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      if (user) {
        await updateAcceptedTermsDetails(); // Atualiza os detalhes dos termos aceitos
        await createUserDocument(user.uid); // Cria o documento do usuário
        navigate("/login");
      } else {
        console.error("Erro: usuário não foi criado.");
      }
    } catch (error) {
      console.error("Erro ao criar o usuário:", error);
    }
  };
  
  const updateAcceptedTermsDetails = async () => {
    const acceptedTermsDetails = terms.map((term) => ({
      type: term.type,
      version: term.version,
      accepted: termsAccepted[term.type] || false, // Verifica se o termo foi aceito, caso contrário, marca como false
      acceptedAt: termsAccepted[term.type] ? serverTimestamp() : null, // Timestamp de aceitação se o termo foi aceito
    }));
  
    setTermsAcceptedDetails(acceptedTermsDetails);
  };
  
  const createUserDocument = async (uid) => {
    const userCollectionRef = collection(firestore, "users");
    const userRef = doc(userCollectionRef, uid);
  
    try {
      await setDoc(userRef, {
        name,
        email,
        jobTitle,
        department,
        employId,
        phone,
        role: "USER",
        foto: "../../assets/user.png",
        createdAt: serverTimestamp(),
        version: {
          number: latestVersion, // Utilizar a versão mais recente aqui
          terms: terms.map(term => ({
            type: term.type,
            accepted: termsAccepted[term.type] || false, // Incluir se cada termo foi aceito ou não
          })),
        },
      });
      console.log("Usuário criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar o documento do usuário:", error);
    }
  };
  
  const handleTermChange = (type, checked) => {
    setTermsAccepted((prev) => ({
      ...prev,
      [type]: checked,
    }));
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
                color: "white",
                maxHeight: "50vh",
              }}
            >
              <Typography
                variant="h2"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Olá! É um prazer conhecê-lo.
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
                            alt="Dino Icon"
                          />
                        </div>
                        <Typography
                          component="h1"
                          variant="h5"
                          sx={{
                            justifyContent: "center",
                            display: "flex",
                          }}
                        >
                          Criar Conta
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
                                label="Nome"
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
                                label="Número de Registro"
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
                                label="Departamento"
                                name="department"
                                onChange={(e) => setDepartment(e.target.value)}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <TextField
                                required
                                fullWidth
                                id="jobTitle"
                                label="Título"
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
                                label="Endereço de Email"
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
                                label="Número de Telefone"
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
                                label="Senha"
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
                                label="Confirmar Senha"
                                type="password"
                                id="confirmationPassword"
                                autoComplete="new-password"
                                onChange={(e) =>
                                  setConfirmationPassword(e.target.value)
                                }
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                onClick={handleSignUpClick}
                              >
                                Ler os termos de uso
                              </Button>
                            </Grid>

                            {terms.map((term) => (
                              <Grid item xs={12} key={term.id}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      color="primary"
                                      checked={termsAccepted[term.type]}
                                      onChange={(e) =>
                                        handleTermChange(
                                          term.type,
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label={`Aceito os termos de ${term.type}`}
                                />
                              </Grid>
                            ))}

                            <Button
                              type="submit"
                              fullWidth
                              variant="contained"
                              sx={{ mt: 3, mb: 2 }}
                              disabled={!termsAccepted["USO"]}
                              onClick={handleNextClick}
                            >
                              Próximo
                            </Button>
                            <Grid container justifyContent="flex-end">
                              <Grid item>
                                <Link href="/login" variant="body2">
                                  Já tem uma conta? Faça login
                                </Link>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Typography
                          component="h1"
                          variant="h5"
                          sx={{
                            justifyContent: "center",
                            display: "flex",
                          }}
                        >
                          Verificar QR Code
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
                                <div
                                  style={{
                                    textAlign: "center",
                                    margin: "5px 0",
                                  }}
                                >
                                  <Button
                                    variant="outlined"
                                    disableElevation
                                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=pt_BR&gl=US"
                                  >
                                    Baixar Google Authenticator
                                  </Button>
                                  <img
                                    src={qrCode}
                                    alt="QR Code"
                                    style={{
                                      maxWidth: "100%",
                                      height: "auto",
                                    }}
                                  />
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
                            Finalizar
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
