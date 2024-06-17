import React, { useState, useEffect, useContext } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { updateDoc, doc } from "firebase/firestore";
import { firestore } from "../services/firebaseConfig";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { AuthContext } from "../services/authContext";
import { useNavigate } from "react-router-dom";

export default function UserData() {
  const { userData, currentUser } = useContext(AuthContext);
  const [latestTerms, setLatestTerms] = useState([]);
  const [termsToUpdate, setTermsToUpdate] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showDeleteFieldsDialog, setShowDeleteFieldsDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      if (userData.terms && userData.terms.length > 0) {
        const sortedTerms = getLatestTerms(userData.terms);
        setLatestTerms(sortedTerms);
        // Inicializa termsToUpdate com os termos atuais do usuário
        setTermsToUpdate(sortedTerms.map(term => ({ type: term.type, accepted: term.accepted })));
      }
    };

    loadUserData();
  }, [userData]);

  const getLatestTerms = (termsArray) => {
    const sortedTerms = [...termsArray].sort((a, b) => {
      if (a.type === "USO") return -1;
      if (b.type === "USO") return 1;
      return 0;
    });

    const latestTermsObject = sortedTerms.reduce((latest, current) => (
      parseInt(current.version) > parseInt(latest.version) ? current : latest
    ));

    return latestTermsObject.terms.map(term => ({
      ...term,
      type: term.type,
      externalVersion: latestTermsObject.version
    }));
  };

  const handleCheckboxChange = (termType, accepted) => {
    // Atualiza o estado local termsToUpdate com a alteração do checkbox
    setTermsToUpdate(prevTerms =>
      prevTerms.map(term =>
        term.type === termType ? { ...term, accepted } : term
      )
    );
  };

  const handleSaveChanges = async () => {
    try {
      const updatedTerms = latestTerms.map(term => {
        const updatedTerm = termsToUpdate.find(t => t.type === term.type);
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
      alert("Erro ao salvar alterações. Por favor, tente novamente mais tarde.");
    }
  };

  const handleDeleteRequest = async () => {
    try {
      // Implementar a lógica para solicitar a exclusão da conta
    } catch (error) {
      console.error("Erro ao enviar solicitação de exclusão:", error);
    }
  };

  const handleDeleteFields = async () => {
    try {
      // Implementar a lógica para excluir campos da conta
    } catch (error) {
      console.error("Erro ao excluir campos e enviar solicitação:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Implementar a lógica para excluir permanentemente a conta do usuário
    } catch (error) {
      console.error("Erro ao excluir a conta do usuário:", error);
    }
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
            {/* Renderização dos termos */}
            {latestTerms.map(term => (
              <Paper key={term.type} style={{ padding: 4, display: "flex", justifyContent: "space-between", width: "40%" }}>
                <div>{term.type === "USO" ? `Termo de USO - Versão: ${term.externalVersion}` : `Termo de ${term.type}`}</div>
                {term.type === "USO" ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => console.log("Botão USO clicado")}
                  >
                    {term.accepted ? 'Aceito' : 'Não Aceito'}
                  </Button>
                ) : (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={termsToUpdate.find(t => t.type === term.type)?.accepted || false}
                        onChange={(event) => handleCheckboxChange(term.type, event.target.checked)}
                        color="primary"
                      />
                    }
                    label={termsToUpdate.find(t => t.type === term.type)?.accepted ? 'Aceito' : 'Não Aceito'}
                  />
                )}
              </Paper>
            ))}

            {/* Botão Salvar Alterações */}
            <Paper style={{ padding: 4, display: "flex", justifyContent: "center", width: "40%" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
              >
                Salvar Alterações
              </Button>
            </Paper>

            {/* Botão Deletar Conta com Dialog de Confirmação */}
            <Paper style={{ padding: 4, display: "flex", justifyContent: "center", width: "40%" }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => setShowConfirmationDialog(true)}
              >
                Deletar Conta
              </Button>
            </Paper>

            {/* Dialog de Confirmação para Deletar Conta */}
            <ConfirmationDialog
              open={showConfirmationDialog}
              onClose={() => setShowConfirmationDialog(false)}
              onConfirm={handleDeleteRequest}
              title="Deletar Conta"
              content="Esta ação enviará uma solicitação de exclusão de sua conta para o administrador. Você será notificado quando a solicitação for processada."
            />

            {/* Dialog de Confirmação para Deletar Campos */}
            <ConfirmationDialog
              open={showDeleteFieldsDialog}
              onClose={() => setShowDeleteFieldsDialog(false)}
              onConfirm={handleDeleteFields}
              title="Deletar Campos"
              content="Esta ação excluirá todos os campos da conta e a conta também. Deseja confirmar?"
            />
          </Paper>
        </div>
      </Box>
    </Box>
  );
}
