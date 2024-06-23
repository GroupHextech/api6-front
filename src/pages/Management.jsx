// imports
import React, { useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
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

import { handleRestore } from "../services/SalesService.js";
import { firestore } from "../services/firebaseConfig";

import { tokens } from "../theme";

import Header from "../components/Header";

import dayjs from "dayjs";

// função principal
export default function Management() {
    // variaveis da função
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const today = dayjs();
    const db = getFirestore();
    const versaoTermoCollection = collection(db, "VersaoTermo");
    const versionQuery = query(
        collection(firestore, "VersaoTermo"),
        orderBy("termo.principal.version", "desc"),
        limit(1)
    );
    

    // declaração de estados (variaveis mutaveis)
    // para collection users
    const [users, setUsers] = useState([]);

    // para collection versaoTermo
    const [versaoTermo, setVersaoTermo] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentTermVersion, setCurrentTermVersion] = useState("");
    const [newOptionalTerm, setOptionalTerm] = useState("");
    const [newMainTermText, setMainTermText] = useState("");

    const [selectedDate, setSelectedDate] = useState(dayjs());

    const handleDateChange = (newValue) => {
        setSelectedDate(newValue);
    };

    // pega as informações a serem exibidas
    useEffect(() => {
        async function fetchData() {
            try {
                // todos os usuarios
                const usersCollection = collection(db, "users");
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(usersList);

                // termo principal e opicionais
                versaoTermoCollection
                const versaoTermoSnapshot = await getDocs(versaoTermoCollection);
                const termsList = versaoTermoSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setVersaoTermo(termsList);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        }
        fetchData();
    }, []);

    // inicio visualização e deleção de usuario
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
    // fim visualização e deleção de usuario

    // inicio criação e atualização de termos
    const updateMainTerm = async (newMainTermText) => {
        try {
            // Query to fetch the latest version
            const versionQuery = query(
                collection(firestore, "VersaoTermo"),
                orderBy("termo.principal.version", "desc"),
                limit(1)
            );
            
            // Get the latest version document
            const versionSnapshot = await getDocs(versionQuery);
            const latestVersionDoc = versionSnapshot.docs[0];
            const latestData = latestVersionDoc.data();
            let opcionais = latestData.termo.opcionais;
    
            // Increment the version number
            const latestVersionDocToInt = parseInt(latestData.termo.principal.version, 10);
            const newVersion = latestVersionDocToInt + 1;
    
            // Create the new document with updated main term text
            await addDoc(collection(firestore, "VersaoTermo"), {
                date: new Date(), // Set current date
                termo: {
                    opcionais: opcionais,
                    principal: {
                        texto: newMainTermText,
                        version: newVersion
                    }
                }
            });
    
            // Update the current term version state
            setCurrentTermVersion(newVersion.toString());
        } catch (error) {
            console.error("Erro ao atualizar a versão do termo:", error);
        }
    };

    // Function to add a new optional term
    const addNewOptionalTerm = async (newOptionalKey, newOptionalValue) => {
        try {
            // Get the latest version document
            versionQuery
            const versionSnapshot = await getDocs(versionQuery);
            const latestVersionDoc = versionSnapshot.docs[0];
            const latestData = latestVersionDoc.data();
            let opcionais = latestData.termo.opcionais;

            // Add new key-value pair to opcionais
            opcionais[newOptionalKey] = newOptionalValue;

            // Increment the version number
            //const latestVersionDocToInt = parseInt(latestData.termo.principal.version, 10);
            //const newVersion = latestVersionDocToInt + 1;

            // Create the new document with updated opcionais
            await addDoc(collection(firestore, "VersaoTermo"), {
                date: new Date(), // Set current date
                termo: {
                    opcionais: opcionais,
                    principal: {
                        texto: latestData.termo.principal.texto, // Keep the existing main term text
                        version: latestData.termo.principal.version
                    }
                }
            });

            // Update the current term version state
            //setCurrentTermVersion(newVersion.toString());
        } catch (error) {
            console.error("Erro ao adicionar um novo termo opcional:", error);
        }
    };
    // fim criação e atualização de termos

    // html
    return (
        <Box>
            <Box
                style={{ flex: 0.8, display: "flex", flexDirection: "column", gap: 10 }}
            >
                {/* parte de cima */}
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
                    {/* inicio parte da esquerda */}
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
                        <TextField
                            label="Pesquisar Usuário"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {filteredUsers.length > 0 ? (filteredUsers.map((user) => (
                            <Box
                                key={user.id}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                width="100%"
                                p={1}
                                m={1}
                                bgcolor={colors.grey[900]}
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
                        ))) : (
                            <Typography variant="body1">Nenhum usuário encontrado</Typography>
                        )}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, margin: "10px" }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} locale="pt-BR">
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
                    {/* fim parte da esquerda */}

                    {/* inicio parte da direita */}
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
                        <Typography variant="h3" gutterBottom>
                            Versão do Termo: {currentTermVersion}
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
                                key={term.type}
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
                    {/* fim parte da direita */}
                </div>
            </Box>
        </Box>
    );
}
