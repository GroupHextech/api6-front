import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import HeatMapChart from "../components/Maps/HeatMap";
import BaseLayout from "../layouts/BaseLayout";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

export default function Map() {
  const [activeMap, setActiveMap] = React.useState("Vendas (Geral)");
  const [selectedRegion, setSelectedRegion] = React.useState("Todas");
  const [activeStates, setActiveStates] = React.useState([
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
    "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ]);

  const regioesDoBrasil = {
    Todas: [
      "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
      "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ],
    Norte: ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
    Nordeste: ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
    CentroOeste: ["DF", "GO", "MT", "MS"],
    Sudeste: ["ES", "MG", "RJ", "SP"],
    Sul: ["PR", "RS", "SC"]
  };

  // Exemplo de acesso às siglas dos estados de uma região específica
  console.log("Siglas dos Estados da Região Nordeste:", regioesDoBrasil.Nordeste);

  const handleSelectRegionChange = (element) => {
    console.log('estados a serem exibidos', regioesDoBrasil[element.target.value])
    setSelectedRegion(element.target.value);
    setActiveStates(regioesDoBrasil[element.target.value]);
  }

  const handleStateRemove = (itemToRemove) => {
    setActiveStates((states) => states.filter((state) => state !== itemToRemove));
  }

  return (
    <Box style={{}}>
      <Box
        style={{ flex: 0.8, display: "flex", flexDirection: "column", gap: 10 }}
      >
        {/*  CABEÇALHO */}
        <div>
          <Paper
            sx={{
              marginLeft: 3,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <h1 style={{ textAlign: "center" }}>
              Dados Geográficos {activeMap}
            </h1>
          </Paper>
        </div>

        {/* CONTEUDO */}
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flex: 0.7,
              flexDirection: "column",
              marginLeft: 3,
              gap: 10,
            }}
          >
            {/* <Button variant="contained" onClick={setActiveMap}>
              Vendas Gerais
            </Button> */}
            <div>
              <div>
                <h2>Filtragem por sentimentos</h2>
                <div>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">Selecione os sentimentos que deseja analisar.</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                    >
                      <FormControlLabel value="todos" control={<Radio />} label="Todos" />
                      <FormControlLabel value="positivo" control={<Radio />} label="Positivo" />
                      <FormControlLabel value="neutro" control={<Radio />} label="Neutro" />
                      <FormControlLabel value="negativo" control={<Radio />} label="Negativo" />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
              <div>
                <h2>Região:</h2>
                <div>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">Selecione as regiões que você deseja analisar</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      onChange={handleSelectRegionChange}
                      value={selectedRegion}
                    >
                      <FormControlLabel value="Todas" control={<Radio />} label="Todas" />
                      <FormControlLabel value="Norte" control={<Radio />} label="Norte" />
                      <FormControlLabel value="Sul" control={<Radio />} label="Sul" />
                      <FormControlLabel value="Sudeste" control={<Radio />} label="Sudeste" />
                      <FormControlLabel value="Nordeste" control={<Radio />} label="Nordeste" />
                      <FormControlLabel value="CentroOeste" control={<Radio />} label="Centro-oeste" />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div>
                  <h2>Estados:</h2>
                  <h3>Se preferir, escolha por estado desejado no mapa ao lado</h3>
                  <div style={{ width: 550 }}>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {
                        activeStates.map(estado =>
                          <Chip size="small" label={estado} key={estado} variant="outlined" onDelete={() => handleStateRemove(estado)} />
                        )
                      }
                    </Stack>
                  </div>
                </div>
                <div>
                  <Button
                    variant="contained" size="medium" style={{ marginTop: '20px', marginRight: '20px' }}
                    endIcon={<CleaningServicesIcon style={{ color: '#70d8bd' }} />}
                  >
                    Clear
                  </Button>
                  <Button variant="contained" size="medium" style={{ marginTop: '20px' }}>
                    Buscar
                  </Button>
                </div>
              </div>

            </div>

          </Paper>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flex: 1,
              flexDirection: "column",
              marginLeft: 3,
            }}
          >
            <HeatMapChart selectedStates={activeStates} />
          </Paper>
        </div>
      </Box>
    </Box>
  );
}

const styles = {
  button: {
    backgroundColor: "#1976d2",
    borderRadius: 5,
    color: "#fff",
    borderColor: "transparent",
  },
};
