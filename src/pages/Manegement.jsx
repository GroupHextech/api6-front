import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  Stack,
  TextField,
  IconButton,
  Paper
} from "@mui/material";
import { tokens } from "../theme";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import Header from "../components/Header";

const db = getFirestore();

export default function Management() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [deletionRequests, setDeletionRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      // Fetch users
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);

      // Fetch deletion requests
      const requestsCollection = collection(db, "deletionRequests");
      const requestsSnapshot = await getDocs(requestsCollection);
      const requestsList = requestsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDeletionRequests(requestsList);
    }

    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    await deleteDoc(doc(db, "users", userId));
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleDeleteRequest = async (requestId, userId) => {
    await deleteDoc(doc(db, "deletionRequests", requestId));
    handleDeleteUser(userId);
    setDeletionRequests(deletionRequests.filter((request) => request.id !== requestId));
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      // Update the status of the deletion request to "declined"
      const requestRef = doc(db, "deletionRequests", requestId);
      await updateDoc(requestRef, {
        status: "declined"
      });
      // Remove the declined request from the local state
      setDeletionRequests(deletionRequests.filter((request) => request.id !== requestId));
    } catch (error) {
      console.error("Error declining request:", error);
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
          {/* HEADER */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Header title="Management" />
          </Box>
        </Box>

        {/* CONTENT */}
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
              marginLeft: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Solicitações de Exclusão de Conta
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
                  <Typography variant="body1">{request.userName} ({request.userEmail}) - {request.requestedAt.toDate().toLocaleString()}</Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteRequest(request.id, request.userId)}
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
              <Typography variant="body1">Nenhuma solicitação de exclusão encontrada</Typography>
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
        </div>
      </Box>
    </Box>
  );
}
