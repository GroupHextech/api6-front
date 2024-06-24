import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
    Box,
    Typography,
    useTheme,
    TextField,
    IconButton,
    Button,
    MenuItem,
} from "@mui/material";
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
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

export default function Management() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const today = dayjs();
    const db = firestore;
    const versionQuery = query(
        collection(db, "VersaoTermo"),
        orderBy("date", "desc"),
        limit(1)
    );

    const [users, setUsers] = useState([]);
    const [latestTerm, setLatestTerm] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentTermVersion, setCurrentTermVersion] = useState("");
    const [newOptionalKey, setNewOptionalKey] = useState("");
    const [newOptionalValue, setNewOptionalValue] = useState("");
    const [newMainTermText, setNewMainTermText] = useState("");
    const [selectedTermType, setSelectedTermType] = useState("");

    const [selectedDate, setSelectedDate] = useState(dayjs());

    const handleDateChange = (newValue) => {
        setSelectedDate(newValue);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const usersCollection = collection(db, "users");
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersList);

                const versionSnapshot = await getDocs(versionQuery);
                if (!versionSnapshot.empty) {
                    const latestDoc = versionSnapshot.docs[0];
                    setLatestTerm(latestDoc.data());
                    setCurrentTermVersion(
                        latestDoc.data().termo.principal.version.toString()
                    );
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        }
        fetchData();
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            await deleteDoc(doc(firestore, "users", userId));
            const blacklistRef = collection(firestore, "blacklist");
            await addDoc(blacklistRef, { userId, timestamp: Timestamp.now() });
            setUsers(users.filter((user) => user.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const updateMainTerm = async () => {
        try {
            const versionSnapshot = await getDocs(versionQuery);
            const latestVersionDoc = versionSnapshot.docs[0];
            const latestData = latestVersionDoc.data();
            const newVersion = parseInt(latestData.termo.principal.version, 10) + 1;

            await addDoc(collection(firestore, "VersaoTermo"), {
                date: new Date(),
                termo: {
                    opcionais: latestData.termo.opcionais, // Preserve existing opcionais
                    principal: {
                        texto: newMainTermText,
                        version: newVersion,
                    },
                },
            });

            setCurrentTermVersion(newVersion.toString());
            setLatestTerm((prevTerm) => ({
                ...prevTerm,
                termo: {
                    ...prevTerm.termo,
                    principal: {
                        texto: newMainTermText,
                        version: newVersion,
                    },
                },
            }));
        } catch (error) {
            console.error("Erro ao atualizar a versão do termo:", error);
        }
    };

    const addNewOptionalTerm = async () => {
        try {
            const versionSnapshot = await getDocs(versionQuery);
            const latestVersionDoc = versionSnapshot.docs[0];
            const latestData = latestVersionDoc.data();
            const opcionais = {
                ...latestData.termo.opcionais,
                [newOptionalKey]: newOptionalValue,
            };
            const newVersion = parseInt(latestData.termo.principal.version, 10);

            await addDoc(collection(firestore, "VersaoTermo"), {
                date: new Date(),
                termo: {
                    opcionais: opcionais,
                    principal: {
                        texto: latestData.termo.principal.texto,
                        version: newVersion,
                    },
                },
            });

            setCurrentTermVersion(newVersion.toString());
            setLatestTerm((prevTerm) => ({
                ...prevTerm,
                termo: {
                    ...prevTerm.termo,
                    opcionais: opcionais,
                },
            }));
        } catch (error) {
            console.error("Erro ao adicionar um novo termo opcional:", error);
        }
    };

    const handleTermTypeChange = (event) => {
        setSelectedTermType(event.target.value);
    };

    const handleAddNewTerm = () => {
        if (selectedTermType === "main") {
            updateMainTerm();
        } else {
            addNewOptionalTerm();
        }
    };

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
                        <TextField
                            label="Pesquisar Usuário"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {users.length > 0 ? (
                            users.map((user) => (
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
                            ))
                        ) : (
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
                            <MenuItem value="main">Atualizar Termo Principal</MenuItem>
                            <MenuItem value="optional">Novo Termo Opcional</MenuItem>
                        </TextField>
                        {selectedTermType === "optional" && (
                            <>
                                <TextField
                                    label="Chave do Termo Opcional"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={newOptionalKey}
                                    onChange={(e) => setNewOptionalKey(e.target.value)}
                                />
                                <TextField
                                    label="Valor do Termo Opcional"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={newOptionalValue}
                                    onChange={(e) => setNewOptionalValue(e.target.value)}
                                />
                            </>
                        )}
                        {selectedTermType === "main" && (
                            <TextField
                                label="Conteúdo do Termo Principal"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                multiline
                                rows={4}
                                value={newMainTermText}
                                onChange={(e) => setNewMainTermText(e.target.value)}
                            />
                        )}
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
                        {latestTerm && (
                            <>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    width="100%"
                                    p={1}
                                    m={1}
                                    bgcolor={colors.primary[500]}
                                    borderRadius={2}
                                >
                                    <Typography variant="body1">
                                        {latestTerm.termo.principal.texto}
                                    </Typography>
                                </Box>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    width="100%"
                                    p={1}
                                    m={1}
                                    bgcolor={colors.primary[500]}
                                    borderRadius={2}
                                >
                                    {latestTerm.termo.opcionais &&
                                        Object.keys(latestTerm.termo.opcionais).map((key) => (
                                            <Typography variant="body2" key={key}>
                                                {key}
                                            </Typography>
                                        ))}
                                </Box>
                            </>
                        )}
                    </Box>
                </div>
            </Box>
        </Box>
    );
}
