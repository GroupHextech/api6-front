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
import { Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

export default function Map() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [feeling, setFeeling] = React.useState("todos");
  const [activeMap, setActiveMap] = React.useState("Vendas (Geral)");
  const [selectedRegion, setSelectedRegion] = React.useState("Todas");
  const [activeStates, setActiveStates] = React.useState([
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
    "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ]);
  const [filter, setFilter] = useState({activeStates, feeling});


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
    const newActiveStates = regioesDoBrasil[element.target.value];

    setSelectedRegion(element.target.value);
    setActiveStates(newActiveStates);
    const newFilter = {...filter, activeStates: newActiveStates};
    setFilter(newFilter);
  }

  const handleStateRemove = (itemToRemove) => {
    const newActiveStates = activeStates.filter((state) => state !== itemToRemove);
    setActiveStates(newActiveStates);
    const newFilter = {...filter, activeStates: newActiveStates};
    setFilter(newFilter);
  }

  const handleFeelingChange = (event) => {
    setFeeling(event.target.value);
    const newFilter = {...filter, feeling: event.target.value};
    setFilter(newFilter)
  }

  const handleClearFilters = () => {
    // Limpa os filtros selecionados
    setSelectedRegion("Todas"); // Define a região como "Todas"
    
    const newActiveStates = regioesDoBrasil["Todas"];
    setActiveStates(newActiveStates);
    setFeeling('todos')

    const newFilter = {activeStates, feeling};
    setFilter(newFilter);
  };
  

  return (
    <Box style={{}}>
      <Box
        style={{ flex: 0.8, display: "flex", flexDirection: "column", gap: 10 }}
      >
        {/*  CABEÇALHO */}
        <div>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              marginLeft: 3,
              justifyContent: "start",
              alignContent: "center",
            }}
          >
            <Typography
              variant="h2"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ m: "20px 0 20px 15px" }}
            >
              Dados Geográficos {activeMap}
            </Typography>
          </Box>
        </div>

        {/* CONTEUDO */}
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
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Filtragem por sentimentos
                </Typography>
                <div>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">Selecione os sentimentos que deseja analisar.</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={feeling}
                      onChange={handleFeelingChange}
                    >
                      <FormControlLabel value="todos" control={
                      <Radio  
                        sx={{
                          color: colors.grey[300],
                          '&.Mui-checked': {
                            color: colors.blueAccent[500],
                          },
                        }}/>
                      } label="Todos" />
                      <FormControlLabel value="Positive" control={
                      <Radio  
                        sx={{
                          color: colors.grey[300],
                          '&.Mui-checked': {
                            color: colors.blueAccent[500],
                          },
                        }}/>
                      } label="Positivo" />
                      <FormControlLabel value="Neutral" control={
                      <Radio  
                        sx={{
                          color: colors.grey[300],
                          '&.Mui-checked': {
                            color: colors.blueAccent[500],
                          },
                        }}/>
                      } label="Neutro" />
                      <FormControlLabel value="Negative" control={
                      <Radio  
                        sx={{
                          color: colors.grey[300],
                          '&.Mui-checked': {
                            color: colors.blueAccent[500],
                          },
                        }}/>
                      } label="Negativo" />
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
                      <FormControlLabel value="Todas" control={
                      <Radio  
                        sx={{
                          color: colors.grey[300],
                          '&.Mui-checked': {
                            color: colors.blueAccent[500],
                          },
                        }}/>
                      } label="Todas" />
                      <FormControlLabel value="Norte" control={
                      <Radio  
                        sx={{
                          color: colors.grey[300],
                          '&.Mui-checked': {
                            color: colors.blueAccent[500],
                          },
                        }}/>
                      } label="Norte" />
                      <FormControlLabel value="Sul" control={
                      <Radio  
                        sx={{
                          color: colors.grey[300],
                          '&.Mui-checked': {
                            color: colors.blueAccent[500],
                          },
                        }}/>
                      } label="Sul" />
                      <FormControlLabel value="Sudeste" control={
                      <Radio  
                        sx={{
                          color: colors.grey[300],
                          '&.Mui-checked': {
                            color: colors.blueAccent[500],
                          },
                        }}/>
                      } label="Sudeste" />
                      <FormControlLabel value="Nordeste" control={
                      <Radio  
                        sx={{
                          color: colors.grey[300],
                          '&.Mui-checked': {
                            color: colors.blueAccent[500],
                          },
                        }}/>
                      } label="Nordeste" />
                      <FormControlLabel value="CentroOeste" control={
                      <Radio  
                        sx={{
                          color: colors.grey[300],
                          '&.Mui-checked': {
                            color: colors.blueAccent[500],
                          },
                        }}/>
                      } label="Centro-oeste" />
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
                    endIcon={<CleaningServicesIcon style={{ color: '#70d8bd' }} onClick={handleClearFilters}/>}
                  >
                    Clear
                  </Button>
                  <Button variant="contained" size="medium" style={{ marginTop: '20px' }}>
                    Buscar
                  </Button>
                </div>
              </div>

            </div>

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
            <HeatMapChart filter={filter} />
          </Box>
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
