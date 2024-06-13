import React, { useState, useEffect, useContext } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { updateDoc, doc, deleteDoc, collection, addDoc } from "firebase/firestore";
import { firestore, storage } from "../services/firebaseConfig";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { AuthContext } from "../services/authContext";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref } from "firebase/storage";
import TypingEffect from "../components/TypingFunc/Typing";
import { deleteUser } from "@firebase/auth";

export default function UserData() {
  const { userData, currentUser } = useContext(AuthContext);
  const [latestTerms, setLatestTerms] = useState([]);
  const [termsToUpdate, setTermsToUpdate] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showDeleteFieldsDialog, setShowDeleteFieldsDialog] = useState(false);
  const [audio, setAudio] = useState(null);
  const [musicUrl, setMusicUrl] = useState(null);

  const texts = ["Obrigado Mineda"];
  const navigate = useNavigate();

  useEffect(() => {
    setLatestTerms(userData.terms || []);
  }, [userData]);

  useEffect(() => {
    if (userData.name === "Mineda") {
      playMusicFromStorage();
    }
  }, [userData]);

  const playMusicFromStorage = async () => {
    try {
      const musicStorageRef = ref(storage, 'musica.mp3');
      const url = await getDownloadURL(musicStorageRef);
      setMusicUrl(url);
    } catch (error) {
      console.error("Erro ao reproduzir a música:", error);
    }
  };

  const handleCheckboxChange = (termType, accepted, version) => {
    const updatedTerms = latestTerms.map(term => {
      if (term.type === termType) {
        return { ...term, accepted };
      }
      return term;
    });
    setLatestTerms(updatedTerms);

    const updatedTermsToUpdate = termsToUpdate.filter(term => term.type !== termType);
    updatedTermsToUpdate.push({ type: termType, accepted, version });
    setTermsToUpdate(updatedTermsToUpdate);
  };

  const handleShowConfirmation = () => {
    setShowConfirmationDialog(true);
  };

  const handleShowExclude = () => {
    setShowDeleteFieldsDialog(true);
  };

  const handleSaveChanges = async () => {
    try {
      const userRef = doc(firestore, "users", currentUser.uid);
      await updateDoc(userRef, {
        terms: latestTerms.map(term => ({
          ...term,
          accepted: termsToUpdate.find(t => t.type === term.type)?.accepted || term.accepted,
          timestamp: new Date(),
        }))
      });
      alert("Alterações salvas com sucesso!");
      setTermsToUpdate([]);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      await addDoc(collection(firestore, "deletionRequests"), {
        userId: currentUser.uid,
        userName: userData.name,
        userEmail: currentUser.email,
        requestedAt: new Date(),
        status: "pending",
      });
      setShowConfirmationDialog(false);
      alert("Solicitação de exclusão enviada ao administrador.");
    } catch (error) {
      console.error("Erro ao enviar solicitação de exclusão:", error);
    }
  };

  const handleDeleteFields = async () => {
    try {
      const userRef = doc(firestore, "users", currentUser.uid);
      await updateDoc(userRef, {
        phone: "",
        name: "inactive",
      });
      await addDoc(collection(firestore, "deletionRequests"), {
        userId: currentUser.uid,
        userName: userData.name,
        userEmail: currentUser.email,
        requestedAt: new Date(),
        status: "pending",
      });
      setShowDeleteFieldsDialog(false);
      alert("Solicitação de exclusão de campos enviada ao administrador.");
    } catch (error) {
      console.error("Erro ao excluir campos e enviar solicitação:", error);
    }
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
  

  // Filtrar os termos mais recentes por tipo (type)
  const filterLatestTermsByType = () => {
    const filteredTerms = latestTerms.reduce((acc, term) => {
      const existingTerm = acc.find(t => t.type === term.type);
      if (!existingTerm) {
        acc.push(term);
      } else {
        if (term.version > existingTerm.version) {
          acc = acc.filter(t => t.type !== term.type);
          acc.push(term);
        }
      }
      return acc;
    }, []);
    return filteredTerms;
  };

  // Obter os termos mais recentes por tipo (type)
  const latestTermsFiltered = filterLatestTermsByType();

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
              <Paper style={{ padding: 4, display: "flex", justifyContent: "space-between", width: "40%" }}>
                <TypingEffect texts={texts} />
              </Paper>
            )}
            <Paper style={{ padding: 4, display: "flex", justifyContent: "space-between", width: "40%" }}>
              <div>Name :</div>
              <div>{userData.name}</div>
            </Paper>

            <Paper style={{ padding: 4, display: "flex", justifyContent: "space-between", width: "40%" }}>
              <div>Email :</div>
              <div>{userData.email}</div>
            </Paper>

            <Paper style={{ padding: 4, display: "flex", justifyContent: "space-between", width: "40%" }}>
              <div>Employ Identification :</div>
              <div>{userData.employId}</div>
            </Paper>

            <Paper style={{ padding: 4, display: "flex", justifyContent: "space-between", width: "40%" }}>
              <div>Department :</div>
              <div>{userData.department}</div>
            </Paper>

            <Paper style={{ padding: 4, display: "flex", justifyContent: "space-between", width: "40%" }}>
              <div>Job Title :</div>
              <div>{userData.jobTitle}</div>
            </Paper>

            <Paper style={{ padding: 4, display: "flex", justifyContent: "space-between", width: "40%" }}>
              <div>Phone :</div>
              <div>{userData.phone}</div>
            </Paper>

            <Paper style={{ padding: 4, display: "flex", justifyContent: "space-between", width: "40%" }}>
              <div>User Role :</div>
              <div>{userData.role}</div>
            </Paper>

            {latestTermsFiltered.map(term => (
              <Paper key={term.type} style={{ padding: 4, display: "flex", justifyContent: "space-between", width: "40%" }}>
                <div>Termo de {term.type} :</div>
                <div>Versão: {term.version}</div>
                <div>
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
                          checked={term.accepted}
                          onChange={(event) => handleCheckboxChange(term.type, event.target.checked, term.version)}
                          color="primary"
                        />
                      }
                      label={term.accepted ? 'Aceito' : 'Não Aceito'}
                    />
                  )}
                </div>
              </Paper>
            ))}

            <Paper style={{ padding: 4, display: "flex", justifyContent: "center", width: "40%" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </Paper>

            <Paper style={{ padding: 4, display: "flex", justifyContent: "center", width: "40%" }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => setShowConfirmationDialog(true)}
              >
                Delete Account
              </Button>
            </Paper>

            <ConfirmationDialog
              open={showConfirmationDialog}
              onClose={() => setShowConfirmationDialog(false)}
              onConfirm={handleDeleteRequest}
              title="Delete account"
              content="Esta ação enviará uma solicitação de exclusão de sua conta para o administrador. Você será notificado quando a solicitação for processada."
            />

            <ConfirmationDialog
              open={showDeleteFieldsDialog}
              onClose={() => setShowDeleteFieldsDialog(false)}
              onConfirm={handleDeleteAccount}
              title="EDIT"
              content="Esta ação excluirá sua conta e todos os dados correnspondentes a ela, deseja confirmar?."
            />
          </Paper>
        </div>
      </Box>
    </Box>
  );
}
