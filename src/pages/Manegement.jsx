import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Stack,
  TextField,
  IconButton,
  Button,
  MenuItem,
} from "@mui/material";
import { tokens } from "../theme";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import Header from "../components/Header";
import { getAuth, deleteUser } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

export default function Management() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [deletionRequests, setDeletionRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [termTypes, setTermTypes] = useState([]);
  const [selectedTermType, setSelectedTermType] = useState("");
  const [newTermType, setNewTermType] = useState("");
  const [newTermVersion, setNewTermVersion] = useState("");
  const [newTermContent, setNewTermContent] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch users
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.role !== "ADMIN"); // Filter out ADMIN users
        setUsers(usersList);

        // Fetch deletion requests and filter out declined requests
        const requestsCollection = collection(db, "deletionRequests");
        const requestsSnapshot = await getDocs(requestsCollection);
        const requestsList = requestsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((request) => request.status !== "declined"); // Filter out declined requests

        setDeletionRequests(requestsList);

        // Fetch term types
        const termsCollection = collection(db, "terms");
        const termsSnapshot = await getDocs(termsCollection);
        const termsList = termsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })).filter(term => term.active);

        const uniqueTermTypes = [
          ...new Set(termsList.map((term) => term.type)),
        ].map((type) => ({
          type,
          latestVersion: Math.max(
            ...termsList
              .filter((term) => term.type === type)
              .map((term) => parseFloat(term.version))
          ),
        }));

        setTermTypes(uniqueTermTypes);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      const blacklistRef = collection(db, "blacklist");
      await addDoc(blacklistRef, { userId, timestamp: Timestamp.now() });
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteRequest = async (requestId, userId) => {
    try {
      const requestRef = doc(db, "deletionRequests", requestId);
      await updateDoc(requestRef, { userEmail: "" });
      await deleteDoc(requestRef);
      await handleDeleteUser(userId);
      setDeletionRequests(
        deletionRequests.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const requestRef = doc(db, "deletionRequests", requestId);
      await updateDoc(requestRef, {
        status: "declined",
        userEmail: "",
      });
      setDeletionRequests(
        deletionRequests.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  const handleAddNewTerm = async () => {
    try {
      const termType = selectedTermType === "new" ? newTermType : selectedTermType;

      // Inactivate the previous term of the same type
      if (selectedTermType !== "new") {
        const termsCollection = collection(db, "terms");
        const termsSnapshot = await getDocs(termsCollection);
        const termsList = termsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const previousTerm = termsList.find((term) => term.type === termType && term.active);
        if (previousTerm) {
          await updateDoc(doc(db, "terms", previousTerm.id), {
            active: false,
          });
        }
      }

      await addDoc(collection(db, "terms"), {
        type: termType,
        version: newTermVersion,
        content: newTermContent,
        createdAt: Timestamp.now(),
        active: true, // Set the new term as active
      });

      alert("Novo termo adicionado com sucesso!");

      const termsCollection = collection(db, "terms");
      const termsSnapshot = await getDocs(termsCollection);
      const termsList = termsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const uniqueTermTypes = [
        ...new Set(termsList.map((term) => term.type)),
      ].map((type) => ({
        type,
        latestVersion: Math.max(
          ...termsList
            .filter((term) => term.type === type)
            .map((term) => parseFloat(term.version))
        ),
      }));

      setTermTypes(uniqueTermTypes);

      setSelectedTermType("");
      setNewTermType("");
      setNewTermVersion("");
      setNewTermContent("");
    } catch (error) {
      console.error("Erro ao adicionar novo termo:", error);
    }
  };

  const handleTermTypeChange = (event) => {
    const selectedType = event.target.value;
    setSelectedTermType(selectedType);

    if (selectedType !== "new") {
      const termType = termTypes.find((term) => term.type === selectedType);
      if (termType) {
        setNewTermVersion((termType.latestVersion + 1.0).toFixed(1));
      }
    } else {
      setNewTermVersion("");
      setNewTermType("");
    }
  };

  const handleInactivateTerm = async (termId) => {
    try {
      console.log("Inactivating term with ID:", termId);
      if (!termId) {
        throw new Error("Term ID is undefined");
      }

      const termRef = doc(db, "terms", termId);
      await updateDoc(termRef, {
        active: false,
      });

      alert("Termo inativado com sucesso!");

      const termsCollection = collection(db, "terms");
      const termsSnapshot = await getDocs(termsCollection);
      const termsList = termsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const uniqueTermTypes = [
        ...new Set(termsList.map((term) => term.type)),
      ].map((type) => ({
        type,
        latestVersion: Math.max(
          ...termsList
            .filter((term) => term.type === type)
            .map((term) => parseFloat(term.version))
        ),
      }));

      setTermTypes(uniqueTermTypes);
    } catch (error) {
      console.error("Erro ao inativar termo:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box
        style={{ flex: 0.8, display: "flex", flexDirection: "column", gap: 10 }}
      >
        <Box m="20px">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Header title="Management" />
          </Box>
        </Box>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              p: 2,
              display: "flex",
              flex: 1,
              flexDirection: "column",
              marginRight: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Solicitações de Exclusão
            </Typography>
            {deletionRequests.length > 0 ? (
              deletionRequests.map((request) => (
                <Box
                  key={request.id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  p={1}
                  m={1}
                  bgcolor={colors.primary[500]}
                  borderRadius={2}
                >
                  <Typography variant="body1">
                    {request.userName} ({request.userEmail}) -{" "}
                    {request.requestedAt.toDate().toLocaleString()}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      color="secondary"
                      onClick={() =>
                        handleDeleteRequest(request.id, request.userId)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeclineRequest(request.id)}
                    >
                      <BlockIcon />
                    </IconButton>
                  </Stack>
                </Box>
              ))
            ) : (
              <Typography variant="body1">
                Nenhuma solicitação de exclusão encontrada
              </Typography>
            )}
            <TextField
              label="Pesquisar Usuário"
              variant="outlined"
              fullWidth
              margin="normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Box
                  key={user.id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  p={1}
                  m={1}
                  bgcolor={colors.primary[500]}
                  borderRadius={2}
                >
                  <Typography variant="body1">{user.name}</Typography>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))
            ) : (
              <Typography variant="body1">Nenhum usuário encontrado</Typography>
            )}
          </Box>

          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              p: 2,
              display: "flex",
              flex: 1,
              flexDirection: "column",
              marginLeft: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Adicionar Novo Termo
            </Typography>
            <TextField
              label="Tipo de Termo"
              variant="outlined"
              fullWidth
              margin="normal"
              value={selectedTermType}
              onChange={handleTermTypeChange}
              select
            >
              {termTypes.map((term) => (
                <MenuItem key={term.type} value={term.type}>
                  {term.type}
                </MenuItem>
              ))}
              <MenuItem value="new">Criar Novo Tipo</MenuItem>
            </TextField>
            {selectedTermType === "new" && (
              <TextField
                label="Novo Tipo de Termo"
                variant="outlined"
                fullWidth
                margin="normal"
                value={newTermType}
                onChange={(e) => setNewTermType(e.target.value)}
              />
            )}
            <TextField
              label="Versão"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newTermVersion}
              onChange={(e) => setNewTermVersion(e.target.value)}
              disabled={selectedTermType !== "new"} // Disable version input if not creating a new type
            />
            <TextField
              label="Conteúdo"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={newTermContent}
              onChange={(e) => setNewTermContent(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddNewTerm}
            >
              Adicionar Termo
            </Button>
            <Typography variant="h6" gutterBottom>
              Termos Ativos
            </Typography>
            {termTypes.map((term) => (
              <Box
                key={term.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                p={1}
                m={1}
                bgcolor={colors.primary[500]}
                borderRadius={2}
              >
                <Typography variant="body1">
                  {term.type} - Versão {term.latestVersion}
                </Typography>
    
              </Box>
            ))}
          </Box>
        </div>
      </Box>
    </Box>
  );
}
