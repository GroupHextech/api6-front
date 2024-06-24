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
  setDoc,
  collection,
  deleteDoc,
  query,
  orderBy,
  limit,
  getDocs,
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
    const fetchLatestTerms = async () => {
      try {
        const termsRef = collection(firestore, "VersaoTermo");
        const termsQuery = query(termsRef, orderBy("date", "desc"), limit(1));

        const querySnapshot = await getDocs(termsQuery);
        if (!querySnapshot.empty) {
          const latestTerm = querySnapshot.docs[0].data();
          const principalText = latestTerm.termo.principal.texto;
          const opcionais = latestTerm.termo.opcionais || {};

          const terms = [
            {
              type: "principal",
              text: principalText,
              version: latestTerm.termo.principal.version,
            },
            ...Object.keys(opcionais).map((key) => ({
              type: key,
              value: opcionais[key],
            })),
          ];

          setLatestTerms(terms);

          // Initialize termsToUpdate with current user terms
          setTermsToUpdate(
            terms.map((term) => ({
              type: term.type,
              accepted: term.type === "principal" ? userData.terms.principal : userData.terms[term.type],
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching latest terms:", error);
      }
    };

    if (userData) {
      fetchLatestTerms();
    }
  }, [userData]);

  const handleCheckboxChange = (termType, accepted) => {
    // Update local state termsToUpdate with checkbox change
    setTermsToUpdate((prevTerms) =>
      prevTerms.map((term) => (term.type === termType ? { ...term, accepted } : term))
    );
  };

  const handleDeleteAccount = async () => {
    try {
      // Add document to 'blacklist' collection
      await addDoc(collection(firestore, "blacklist"), {
        userId: currentUser.uid,
        timestamp: new Date(),
      });

      // Delete user document
      const userRef = doc(firestore, "users", currentUser.uid);
      await deleteDoc(userRef);

      // Delete the user
      await deleteUser(currentUser);

      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Error deleting user account:", error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Prepare data for the new userTermo document
      const termsData = termsToUpdate.reduce((acc, term) => {
        acc[term.type] = term.accepted || false;
        return acc;
      }, {});

      // Get the current term version
      const principalTerm = latestTerms.find((t) => t.type === "principal");
      const currentTermVersion = principalTerm ? principalTerm.version : 0;

      const userTermoData = {
        date: new Date(),
        termos: {
          principal: termsData["principal"] || false,
          versao: termsData["principal"] ? currentTermVersion : 0,
          ...termsData,
        },
        user: doc(firestore, "users", currentUser.uid),
      };

      console.log("Setting new userTermo data:", userTermoData);

      // Add new document to 'userTermo' collection
      await addDoc(collection(firestore, "userTermo"), userTermoData);

      alert("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      alert("Erro ao salvar alterações. Por favor, tente novamente mais tarde.");
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
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Header title="YOUR DATA" subtitle="" />
            </Box>
          </Box>

          <Box m="20px">
            {/* CONTENT */}
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
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
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography>Name:</Typography>
                      <Typography>{userData.name}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography>Email:</Typography>
                      <Typography>{userData.email}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography>Employ Identification:</Typography>
                      <Typography>{userData.employId}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography>Department:</Typography>
                      <Typography>{userData.department}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography>Job Title:</Typography>
                      <Typography>{userData.jobTitle}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography>Phone:</Typography>
                      <Typography>{userData.phone}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography>Role:</Typography>
                      <Typography>{userData.role}</Typography>
                    </Box>
                  </Box>

                  {/* Display Terms */}
                  {latestTerms.map((term) => (
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
                        {term.type === "principal"
                          ? `Termo Principal`
                          : `${term.type}`}
                      </Typography>
                      {term.type === "principal" ? (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                termsToUpdate.find((t) => t.type === "principal")?.accepted || false
                              }
                              onChange={(event) =>
                                handleCheckboxChange("principal", event.target.checked)
                              }
                              color="primary"
                            />
                          }
                          label={
                            termsToUpdate.find((t) => t.type === "principal")?.accepted
                              ? "Aceito"
                              : "Não Aceito"
                          }
                        />
                      ) : (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                termsToUpdate.find((t) => t.type === term.type)?.accepted || false
                              }
                              onChange={(event) =>
                                handleCheckboxChange(term.type, event.target.checked)
                              }
                              color="primary"
                            />
                          }
                          label={
                            termsToUpdate.find((t) => t.type === term.type)?.accepted
                              ? "Aceito"
                              : "Não Aceito"
                          }
                        />
                      )}
                    </Box>
                  ))}

                  {/* Save Changes Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveChanges}
                    sx={{ marginTop: 2 }}
                  >
                    Salvar Alterações
                  </Button>

                  {/* Delete Account Button */}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setShowDeleteFieldsDialog(true)}
                    sx={{ marginTop: 2 }}
                  >
                    Deletar Conta
                  </Button>

                  {/* Confirmation Dialogs */}
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
