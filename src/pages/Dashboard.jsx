import { useState } from "react";
import { Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from "@mui/material";

import { Box, Button, Typography, useTheme, Stack } from "@mui/material";
import { tokens } from "../theme";

// COMPONENTS:
import Header from "../components/Header";
import StatBox from "../components/StatBox";

// CHARTS:
import GenderPieChart from "../components/charts/GenderPieChart";
import SalesBarChart from "../components/charts/SalesBarChart";
import MonthlyPeriodChart from "../components/charts/MonthlyPeriodChart";

// ICONS:
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ReviewsOutlinedIcon from "@mui/icons-material/ReviewsOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import SentimentNeutralOutlinedIcon from "@mui/icons-material/SentimentNeutralOutlined";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import CategoriesPieAndBarChart from "../components/charts/CategoriesPieAndBarChart";
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import { SystemUpdateRounded } from "@mui/icons-material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [chartType, setChartType] = useState("pie"); // Default chart type
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);

  const regioesDoBrasil = {
    "Todas": [
      "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
      "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ],
    "norte": ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
    "nordeste": ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
    "centro-oeste": ["DF", "GO", "MT", "MS"],
    "sudeste": ["ES", "MG", "RJ", "SP"],
    "sul": ["PR", "RS", "SC"]
  };
  

  const handleChangeRegion = (event, child) => {
    const selectedRegions = event.target.value;
    let selectedStates = [];
  
    // Se a opção 'Todas' estiver selecionada, limpar todas as seleções de região
    if (selectedRegions.includes('Todas')) {
      setSelectedRegions(['Todas']);
      return; // Não é necessário enviar parâmetros de região
    }
  
    // Obter a lista de estados correspondentes a todas as regiões selecionadas
    selectedRegions.forEach(region => {
      selectedStates = selectedStates.concat(regioesDoBrasil[region]);
    });
  
    // Atualizar os estados selecionados e enviar apenas os estados para o backend
    setSelectedRegions(selectedRegions);
    setSelectedStates(selectedStates);
  };

  const handleChangeEstado = (event) => {
    const selectedOptions = event.target.value;
    setSelectedStates(selectedOptions);
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<EmojiEmotionsOutlinedIcon style={{ color: '#98FF98' }} />}
          >
            Positivo
          </Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={<SentimentNeutralOutlinedIcon style={{ color: '#FFFF99' }} />}
          >
            Neutro
          </Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={<SentimentDissatisfiedOutlinedIcon style={{ color: '#E0115F' }} />}
          >
            Negativo
          </Button>
        </Stack>

        <div>
          <FormControl sx={{ m: 1, width: 300 }} size="small">
            <InputLabel id="regiao-multiple-checkbox-label">Região</InputLabel>
            <Select
              labelId="regiao-multiple-checkbox-label"
              id="regiao-multiple-checkbox"
              multiple
              value={selectedRegions}
              onChange={handleChangeRegion}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.includes('Todas') ? 'Todas as regiões' : selected.join(', ')}
              MenuProps={MenuProps}
            >
              {Object.keys(regioesDoBrasil).map((region) => (
                <MenuItem key={region} value={region}>
                  <Checkbox checked={selectedRegions.indexOf(region) > -1} />
                  <ListItemText primary={region} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div>
          <FormControl sx={{ m: 1, width: 300 }} size="small">
            <InputLabel id="estado-multiple-checkbox-label">Estado</InputLabel>
            <Select
              labelId="estado-multiple-checkbox-label"
              id="estado-multiple-checkbox"
              multiple
              value={selectedStates}
              onChange={handleChangeEstado}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {regioesDoBrasil.Todas.map((state) => (
                <MenuItem key={state} value={state}>
                  <Checkbox checked={selectedStates.indexOf(state) > -1} />
                  <ListItemText primary={state} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

          <Button
            variant="contained"
            color="primary"
            endIcon={<CleaningServicesIcon style={{ color: '#70d8bd' }} />}
          >
            Clear
          </Button>


        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        {/*   REVIEWS */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="1,325,134"
            subtitle="Reviews"
            progress="0.80"
            increase="+43%"
            icon={
              <ReviewsOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        {/*   POSITIVE */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="12,361"
            subtitle="Positives"
            progress="0.75"
            increase="+14%"
            icon={
              <EmojiEmotionsOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        {/*   NEUTRAL */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="431,225"
            subtitle="Neltrals"
            progress="0.50"
            increase="+21%"
            icon={
              <SentimentNeutralOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        {/*   NEGATIVE */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="32,441"
            subtitle="Negatives"
            progress="0.30"
            increase="+5%"
            icon={
              <SentimentDissatisfiedOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        {/* ROW 2 */}
        {/*   -- INSERT ROW 2 CONTENT HERE -- */}
        {/* ROW 3 */}
        {/*   GENDER */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          display="flex"
          flexDirection="column"
        // mt="25px"
        >
          <Typography variant="h5" fontWeight="600">
            Gender
          </Typography>
          <GenderPieChart />
        </Box>
        {/* SALES BY PERIOD */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          display="flex"
          flexDirection="column"
        // mt="25px"
        >
          <Typography variant="h5" fontWeight="600">
            Sales by period
          </Typography>
          <SalesBarChart />
        </Box>
        {/*   REVIEWS BY CATEGORY  */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        // mt="25px"
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h5" fontWeight="600">
                Reviews by category
              </Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                onClick={() =>
                  setChartType((prevChartType) =>
                    prevChartType === "pie" ? "bar" : "pie"
                  )
                } // Use a seta para chamar a função
              >
                Alternar Gráfico
              </Button>
            </Box>
          </Box>
          <Box height="250px" m="0 0 0 0">
            <CategoriesPieAndBarChart chartType={chartType} selectedStates={selectedStates} />
          </Box>
        </Box>
        {/* MONTHLY PERIOD CHART */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          display="flex"
          flexDirection="column"
        // mt="25px"
        >
          <Typography variant="h5" fontWeight="600">
            Number of sales per month
          </Typography>
          <Box height="250px" m="0 0 0 0">
            <MonthlyPeriodChart />
          </Box>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {/* Chart */}
        {/* Recent Deposits */}
        {/* Recent Orders */}
        {/* <Grid item xs={6}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Orders />
            </Paper>
          </Grid> */}
      </Grid>
    </Box>
  );
}

export default Dashboard;