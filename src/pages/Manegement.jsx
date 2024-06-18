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
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import Header from "../components/Header";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { handleRestore } from "../services/SalesService.js";
import { firestore } from "../services/firebaseConfig";

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
  const [currentTermVersion, setCurrentTermVersion] = useState("");

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const today = dayjs();

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

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
        const termsList = termsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((term) => term.active);

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

        // Fetch current term version
        const versionQuery = query(
          collection(firestore, "VersaoTermo"),
          orderBy("version", "desc"),
          limit(1)
        );
        const versionSnapshot = await getDocs(versionQuery);
        const latestVersion = versionSnapshot.docs[0]?.data().version || "1.0";
        setCurrentTermVersion(latestVersion);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
  }, []);

  const updateTermVersion = async () => {
    try {
      const versionQuery = query(
        collection(firestore, "VersaoTermo"),
        orderBy("version", "desc"),
        limit(1)
      );
      const versionSnapshot = await getDocs(versionQuery);
      const latestVersionDoc = versionSnapshot.docs[0];
      let newVersion = 1; // Default version as an integer

      if (latestVersionDoc) {
        const latestVersion = parseInt(latestVersionDoc.data().version, 10);
        newVersion = latestVersion + 1;
      }

      // Fetch all active terms
      const termsCollection = collection(firestore, "terms");
      const termsSnapshot = await getDocs(termsCollection);
      const activeTerms = termsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((term) => term.active);

      // Create a new version document with the new version and active terms
      await addDoc(collection(firestore, "VersaoTermo"), {
        version: newVersion,
        terms: activeTerms,
      });

      setCurrentTermVersion(newVersion.toString());
    } catch (error) {
      console.error("Erro ao atualizar a versão do termo:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(firestore, "users", userId));
      const blacklistRef = collection(firestore, "blacklist");
      await addDoc(blacklistRef, { userId, timestamp: Timestamp.now() });
      setUsers(users.filter((user) => user.id !== userId));
      await updateTermVersion();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteRequest = async (requestId, userId) => {
    try {
      const requestRef = doc(firestore, "deletionRequests", requestId);
      await updateDoc(requestRef, { userEmail: "" });
      await deleteDoc(requestRef);
      await handleDeleteUser(userId);
      setDeletionRequests(
        deletionRequests.filter((request) => request.id !== requestId)
      );
      await updateTermVersion();
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const requestRef = doc(firestore, "deletionRequests", requestId);
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
      const termType =
        selectedTermType === "new" ? newTermType : selectedTermType;

      // Check if a term with the same type and version already exists
      const termsCollection = collection(firestore, "terms");
      const termsSnapshot = await getDocs(termsCollection);
      const termsList = termsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const duplicateTerm = termsList.find(
        (term) =>
          term.type === termType &&
          term.version === parseInt(newTermVersion, 10)
      );
      if (duplicateTerm) {
        alert("Um termo com o mesmo tipo e versão já existe.");
        return;
      }

      // Inactivate the previous term of the same type
      if (selectedTermType !== "new") {
        const previousTerm = termsList.find(
          (term) => term.type === termType && term.active
        );
        if (previousTerm) {
          await updateDoc(doc(firestore, "terms", previousTerm.id), {
            active: false,
          });
        }
      }

      // Add new term
      await addDoc(collection(firestore, "terms"), {
        type: termType,
        version: parseInt(newTermVersion, 10), // Convert version to integer
        content: newTermContent,
        createdAt: Timestamp.now(),
        active: true, // Set the new term as active
      });

      alert("Novo termo adicionado com sucesso!");

      // Fetch updated terms
      const updatedTermsSnapshot = await getDocs(termsCollection);
      const updatedTermsList = updatedTermsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const uniqueTermTypes = [
        ...new Set(updatedTermsList.map((term) => term.type)),
      ].map((type) => ({
        type,
        latestVersion: Math.max(
          ...updatedTermsList
            .filter((term) => term.type === type)
            .map((term) => parseInt(term.version, 10))
        ),
      }));

      setTermTypes(uniqueTermTypes);

      setSelectedTermType("");
      setNewTermType("");
      setNewTermVersion("");
      setNewTermContent("");
      await updateTermVersion();
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
      await updateTermVersion();
    } catch (error) {
      console.error("Erro ao inativar termo:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <Header title="MANAGEMENT" subtitle="Manage users, restore backups and add new terms" />
            </Box>
          </Box>

          <Box m="20px">
            <Box
              display="grid"
              gridTemplateColumns="repeat(12, 1fr)"
              gap="20px"
            >
              {/* First Column */}
              <Box
                gridColumn="span 6"
                p="20px"
                backgroundColor={colors.primary[400]}
              >
                <Box>
                  <Typography
                    variant="h3"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    Deletion Request
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
                        bgcolor={colors.blueAccent[900]}
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
                    <Typography variant="body1">
                      Nenhum usuário encontrado
                    </Typography>
                  )}
                  <Typography
                    variant="h3"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ marginTop: "30px" }}
                    margin="normal"
                  >
                    Restore Backup
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      marginTop: "20px",
                    }}
                  >
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      locale="pt-BR"
                    >
                      <DatePicker
                        label="Select date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        maxDate={today}
                        slotProps={{ textField: { variant: "outlined" } }}
                        format="DD/MM/YYYY"
                      />
                    </LocalizationProvider>
                    {selectedDate && (
                      <div>
                        <Button
                          variant="contained"
                          onClick={() => handleRestore(selectedDate)}
                        >
                          Restore Backup
                        </Button>
                      </div>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Second Column */}
              <Box
                gridColumn="span 6"
                p="20px"
                backgroundColor={colors.primary[400]}
              >
                <Box>
                  <Typography
                    variant="h3"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    Term Version: {currentTermVersion}
                  </Typography>
                  <Typography variant="h6" align="top">
                    Add a new term
                  </Typography>
                  <TextField
                    label="Tipo de Sub-Termo"
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
                    <MenuItem value="new">Create new type</MenuItem>
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
                    Create
                  </Button>
                  <Typography variant="h4" gutterBottom sx={{ marginTop: "30px", }}>
                    Active terms
                  </Typography>
                  {termTypes.map((term) => (
                    <Box
                      key={term.type}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      width="100%"
                      p={1}
                      m={1}
                      bgcolor={colors.blueAccent[900]}
                      borderRadius={2}
                    >
                      <Typography variant="body1">
                        {term.type} - Versão {term.latestVersion}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
