import React, { useState, useEffect, useContext } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
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

export default function UserData() {
  const { userData, currentUser } = useContext(AuthContext);
  const [latestTerms, setLatestTerms] = useState([]);
  const [termsToUpdate, setTermsToUpdate] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showDeleteFieldsDialog, setShowDeleteFieldsDialog] = useState(false);

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
    <Box>
      <Box
        style={{
          flex: 0.8,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginRight: 20,
        }}
      >
        <div>
          <Paper
            sx={{
              marginLeft: 3,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <h1 style={{ textAlign: "center" }}>Your Data</h1>
          </Paper>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flex: 1,
              flexDirection: "column",
              marginLeft: 3,
              justifyContent: "center",
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
            {userData.name === "Mineda" && (
              <Paper
                style={{
                  padding: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "40%",
                }}
              >
                <TypingEffect texts={texts} />
              </Paper>
            )}
            <Paper
              style={{
                padding: 4,
                display: "flex",
                justifyContent: "space-between",
                width: "40%",
              }}
            >
              <div>Name :</div>
              <div>{userData.name}</div>
            </Paper>

            <Paper
              style={{
                padding: 4,
                display: "flex",
                justifyContent: "space-between",
                width: "40%",
              }}
            >
              <div>Email :</div>
              <div>{userData.email}</div>
            </Paper>

            <Paper
              style={{
                padding: 4,
                display: "flex",
                justifyContent: "space-between",
                width: "40%",
              }}
            >
              <div>Employ Identification :</div>
              <div>{userData.employId}</div>
            </Paper>

            <Paper
              style={{
                padding: 4,
                display: "flex",
                justifyContent: "space-between",
                width: "40%",
              }}
            >
              <div>Department :</div>
              <div>{userData.department}</div>
            </Paper>

            <Paper
              style={{
                padding: 4,
                display: "flex",
                justifyContent: "space-between",
                width: "40%",
              }}
            >
              <div>Job Title :</div>
              <div>{userData.jobTitle}</div>
            </Paper>

            <Paper
              style={{
                padding: 4,
                display: "flex",
                justifyContent: "space-between",
                width: "40%",
              }}
            >
              <div>Phone :</div>
              <div>{userData.phone}</div>
            </Paper>

            <Paper
              style={{
                padding: 4,
                display: "flex",
                justifyContent: "space-between",
                width: "40%",
              }}
            >
              <div>Role :</div>
              <div>{userData.role}</div>
            </Paper>

            {[
              ...latestTerms.filter((term) => term.type === "USO"),
              ...latestTerms.filter((term) => term.type !== "USO"),
            ].map((term) => (
              <Paper
                key={term.type}
                style={{
                  padding: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "40%",
                }}
              >
                <div>
                  {term.type === "USO"
                    ? `Termo de USO - Versão: ${term.externalVersion}`
                    : `Termo de ${term.type}`}
                </div>
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
              </Paper>
            ))}

            {/* Botão Salvar Alterações */}
            <Paper
              style={{
                padding: 4,
                display: "flex",
                justifyContent: "center",
                width: "40%",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
              >
                Salvar Alterações
              </Button>
            </Paper>

            <Paper
              style={{
                padding: 4,
                display: "flex",
                justifyContent: "center",
                width: "40%",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => setShowDeleteFieldsDialog(true)}
              >
                Deletar Conta
              </Button>
            </Paper>

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
              title="Reijeitar os Termos de Uso"
              content="Você tem certeza? Esta ação excluirá todos os dados e sua conta. Deseja confirmar?"
            />
          </Paper>
        </div>
      </Box>
    </Box>
  );
}
