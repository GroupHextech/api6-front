import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import {
  updateDoc,
  doc,
  addDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../services/firebaseConfig";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { AuthContext } from "../services/authContext";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "@firebase/auth";

import Header from "../components/Header";
import { tokens } from "../theme";

export default function UserData() {
  const { userData, currentUser } = useContext(AuthContext);
  const [latestTerms, setLatestTerms] = useState([]);
  const [termsToUpdate, setTermsToUpdate] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showDeleteFieldsDialog, setShowDeleteFieldsDialog] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      if (userData && userData.terms && userData.terms.length) {
        const sortedTerms = getLatestTerms(userData.terms);
        setLatestTerms(sortedTerms);
        // Initialize termsToUpdate with current user terms
        setTermsToUpdate(
          sortedTerms.map((term) => ({
            type: term.type,
            accepted: term.accepted,
          }))
        );
      }
    };

    if (userData) {
      loadUserData();
    }
  }, [userData]);

  const getLatestTerms = (termsArray) => {
    if (!termsArray || termsArray.length === 0) {
      return [];
    }

    const sortedTerms = [...termsArray].sort((a, b) => {
      if (a.type === "USO") return -1;
      if (b.type === "USO") return 1;
      return 0;
    });

    const latestTermsObject = sortedTerms.reduce((latest, current) =>
      parseInt(current.version) > parseInt(latest.version) ? current : latest
    );

    return latestTermsObject.terms.map((term) => ({
      ...term,
      type: term.type,
      externalVersion: latestTermsObject.version,
    }));
  };

  const handleCheckboxChange = (termType, accepted) => {
    // Atualiza o estado local termsToUpdate com a alteração do checkbox
    setTermsToUpdate((prevTerms) =>
      prevTerms.map((term) =>
        term.type === termType ? { ...term, accepted } : term
      )
    );
  };

  const handleDeleteAccount = async () => {
    try {
      // Adicionar documento na coleção 'blacklist'
      await addDoc(collection(firestore, "blacklist"), {
        userId: currentUser.uid,
        timestamp: new Date(),
      });

      // Excluir o documento do usuário
      const userRef = doc(firestore, "users", currentUser.uid);
      await deleteDoc(userRef);

      // Excluir o usuário
      await deleteUser(currentUser);

      // Navegar para a página de login
      navigate("/login");
    } catch (error) {
      console.error("Erro ao excluir a conta do usuário:", error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedTerms = latestTerms.map((term) => {
        const updatedTerm = termsToUpdate.find((t) => t.type === term.type);
        return {
          ...term,
          accepted: updatedTerm.accepted,
          timestamp: new Date(),
        };
      });

      const userRef = doc(firestore, "users", currentUser.uid);
      await updateDoc(userRef, {
        terms: updatedTerms,
      });

      alert("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      alert(
        "Erro ao salvar alterações. Por favor, tente novamente mais tarde."
      );
    }
  };

  const handleShowExclude = () => {
    setShowDeleteFieldsDialog(true);
  };

  return (
    <>
      <Box>
        <Box
          style={{
            flex: 0.8,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box m="20px">
            {/* HEADER */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Header title="YOUR DATA" subtitle="" />
            </Box>
          </Box>

          <Box m="20px">
            {/* CONTENT */}
            <Box
              display="grid"
              gridTemplateColumns="repeat(12, 1fr)"
              gap="20px"
            >
              <Box gridColumn="span 12" p="20px" backgroundColor={colors.primary[400]}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <img
                    alt="profile-user"
                    width="200px"
                    height="200px"
                    src={userData.foto}
                    style={{ borderRadius: "50%" }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      width: "30%",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Name:</Typography>
                      <Typography>{userData.name}</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Email:</Typography>
                      <Typography>{userData.email}</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Employ Identification:</Typography>
                      <Typography>{userData.employId}</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Department:</Typography>
                      <Typography>{userData.department}</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Job Title:</Typography>
                      <Typography>{userData.jobTitle}</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Phone:</Typography>
                      <Typography>{userData.phone}</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>Role:</Typography>
                      <Typography>{userData.role}</Typography>
                    </Box>
                  </Box>

                  {[
                    ...latestTerms.filter((term) => term.type === "USO"),
                    ...latestTerms.filter((term) => term.type !== "USO"),
                  ].map((term) => (
                    <Box
                      key={term.type}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "50%",
                        padding: 1,
                        border: "1px solid #ccc",
                        borderRadius: 1,
                        marginTop: 1,
                      }}
                    >
                      <Typography>
                        {term.type === "USO"
                          ? `Termo de USO - Versão: ${term.externalVersion}`
                          : `Termo de ${term.type}`}
                      </Typography>
                      {term.type === "USO" ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleShowExclude}
                        >
                          Rejeitar
                        </Button>
                      ) : (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                termsToUpdate.find((t) => t.type === term.type)
                                  ?.accepted || false
                              }
                              onChange={(event) =>
                                handleCheckboxChange(
                                  term.type,
                                  event.target.checked
                                )
                              }
                              color="primary"
                            />
                          }
                          label={
                            termsToUpdate.find((t) => t.type === term.type)
                              ?.accepted
                              ? "Aceito"
                              : "Não Aceito"
                          }
                        />
                      )}
                    </Box>
                  ))}

                  {/* Botão Salvar Alterações */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveChanges}
                    sx={{ marginTop: 2 }}
                  >
                    Salvar Alterações
                  </Button>

                  {/* Botão Deletar Conta */}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setShowDeleteFieldsDialog(true)}
                    sx={{ marginTop: 2 }}
                  >
                    Deletar Conta
                  </Button>

                  <ConfirmationDialog
                    open={showConfirmationDialog}
                    onClose={() => setShowConfirmationDialog(false)}
                    onConfirm={handleDeleteAccount}
                    title="Deletar Conta"
                    content="Esta ação enviará uma solicitação de exclusão de sua conta para o administrador. Você será notificado quando a solicitação for processada."
                  />

                  <ConfirmationDialog
                    open={showDeleteFieldsDialog}
                    onClose={() => setShowDeleteFieldsDialog(false)}
                    onConfirm={handleDeleteAccount}
                    title="Rejeitar os Termos de Uso"
                    content="Você tem certeza? Esta ação excluirá todos os dados e sua conta. Deseja confirmar?"
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
