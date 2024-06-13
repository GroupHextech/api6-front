import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../services/firebaseConfig";

export default function TermosAtualizados() {
  const [termosAtualizados, setTermosAtualizados] = useState([]);
  const [showContent, setShowContent] = useState({});

  useEffect(() => {
    async function fetchTermosAtualizados() {
      try {
        const termsCollection = collection(firestore, "terms");
        const termsSnapshot = await getDocs(termsCollection);
        const termsList = termsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Agrupar termos por tipo e encontrar o mais recente de cada tipo
        const termosMaisRecentes = {};
        termsList.forEach(term => {
          if (!termosMaisRecentes[term.type] || termosMaisRecentes[term.type].version < term.version) {
            termosMaisRecentes[term.type] = term;
          }
        });

        // Converter o objeto em um array para exibição
        const termosAtualizadosArray = Object.values(termosMaisRecentes);

        setTermosAtualizados(termosAtualizadosArray);
      } catch (error) {
        console.error("Erro ao buscar termos atualizados:", error);
      }
    }

    fetchTermosAtualizados();
  }, []);

  const handleToggleContent = (termId) => {
    setShowContent(prevState => ({
      ...prevState,
      [termId]: !prevState[termId]
    }));
  };

  return (
    <Box>
      <Paper
        sx={{
          marginLeft: 3,
          justifyContent: "center",
          alignContent: "center",
          padding: 2,
        }}
      >
        <h1 style={{ textAlign: "center" }}>Termos Atualizados</h1>
      </Paper>

      {termosAtualizados.map(termo => (
        <Paper
          key={termo.id}
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            margin: "10px 0",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => handleToggleContent(termo.id)}
        >
          <div>Termo de {termo.type}</div>
          <div>Versão: {termo.version}</div>
          {showContent[termo.id] && (
            <div>Conteúdo: {termo.content}</div>
          )}
        </Paper>
      ))}
    </Box>
  );
}
