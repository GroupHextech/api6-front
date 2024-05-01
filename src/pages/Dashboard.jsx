import { useEffect, useState } from "react";
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
import { getFeeling } from "../services/SalesService";

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

  const [filter, setFilter] = useState({});
  const [feeling, setFeeling] = useState("");
  const [feelingData, setFeelingData] = useState({'total': 0, 'positive': 0, 'neutral': 0, 'negative': 0});
  const [chartType, setChartType] = useState("pie"); // Default chart type
  const [selectedRegions, setSelectedRegions] = useState(["Todas"]);
  const [selectedStates, setSelectedStates] = useState(["São Paulo"]);

  const regioesDoBrasil = {
    Todas: [
      "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
      "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
    ],
    Norte: ["Acre", "Amapá", "Amazonas", "Pará", "Rondônia", "Roraima", "Tocantins"],
    Nordeste: ["Alagoas", "Bahia", "Ceará", "Maranhão", "Paraíba", "Pernambuco", "Piauí", "Rio Grande do Norte", "Sergipe"],
    CentroOeste: ["Distrito Federal", "Goiás", "Mato Grosso", "Mato Grosso do Sul"],
    Sudeste: ["Espírito Santo", "Minas Gerais", "Rio de Janeiro", "São Paulo"],
    Sul: ["Paraná", "Rio Grande do Sul", "Santa Catarina"]
  };
  
  const stateAbbreviations = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
    "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  function getAbbreviation(fullStateName) {
    const index = regioesDoBrasil.Todas.indexOf(fullStateName);
    if (index !== -1) {
      return stateAbbreviations[index];
    } else {
      return null;
    }
  }

  useEffect(() => {
    async function handleFeelingData() {
      let feelingData;
      
      let regions = [];
      let states = [];

      if (selectedRegions.includes('Todas')) {
        regions = [];
      } else if (selectedRegions.length) {
        regions = selectedRegions;
      }

      if (!regions.length) {
        states = selectedStates.map(state => getAbbreviation(state));
      }

      try {
        if (states.length || regions.length) {
          feelingData = await getFeeling(states, regions);
        } else {
          feelingData = await getFeeling();
        }

        let finalFeelingData = {'total': 0, 'positive': 0, 'neutral': 0, 'negative': 0};

        feelingData.forEach(row => {
          finalFeelingData[row._id.toLowerCase()] = row.count;
          finalFeelingData['total'] += row.count;
        })

        setFeelingData(finalFeelingData);
        setFilter({states, regions});
      } catch (error) {
        console.error("Error fetching feeling data:", error.message);
      }
    }

    handleFeelingData();
  }, [selectedRegions, selectedStates])

  const handleChangeRegion = (event, child) => {
    let selectedOptions = event.target.value;

    if (child.props.value === 'Todas') {
      setSelectedRegions(Object.keys(regioesDoBrasil))
      return;
    }

    selectedOptions = selectedOptions.filter(item => item !== 'Todas')

    setSelectedRegions(
      typeof selectedOptions === 'string' ? selectedOptions.split(',') : selectedOptions,
    );
  };

  const handleChangeEstado = (event) => {
    const selectedOptions = event.target.value;
    setSelectedStates(
      typeof selectedOptions === 'string' ? selectedOptions.split(',') : selectedOptions,
    );
  };

  const handleFeelingClick = (value) => {
    console.log(value)
    setFeeling(value);
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            value="positivo"
            onClick={(event) => handleFeelingClick(event.target.value)}
            color="primary"
            endIcon={<EmojiEmotionsOutlinedIcon style={{ color: colors.greenAccent[600] }} />}
            sx={{
              padding: "10px 20px",
            }}
          >
            Positivo
          </Button>
          <Button
            variant="contained"
            value="neutro"
            onClick={(event) => handleFeelingClick(event.target.value)}
            color="primary"
            endIcon={<SentimentNeutralOutlinedIcon style={{ color: '#ffa927' }} />}
            sx={{
              padding: "10px 20px",
            }}
          >
            Neutro
          </Button>
          <Button
            variant="contained"
            value="negativo"
            onClick={(event) => handleFeelingClick(event.target.value)}
            color="primary"
            endIcon={<SentimentDissatisfiedOutlinedIcon style={{ color: '#E0115F' }} />}
            sx={{
              padding: "10px 20px",
            }}
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
            sx={{
              padding: "10px 20px",
            }}
          ><CleaningServicesIcon style={{ color: '#70d8bd' }}/></Button>


        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          ><DownloadOutlinedIcon /></Button>
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
            title={feelingData.total.toFixed()}
            subtitle="Total Reviews"
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
            title={feelingData.positive.toFixed()}
            subtitle="Positives"
            progress="1"
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
            title={feelingData.neutral.toFixed()}
            subtitle="Neutrals"
            progress="0.50"
            increase="+21%"
            icon={
              <SentimentNeutralOutlinedIcon
                sx={{ color: '#ffa927', fontSize: "26px" }}
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
            title={feelingData.negative.toFixed()}
            subtitle="Negatives"
            progress="0.30"
            increase="+5%"
            icon={
              <SentimentDissatisfiedOutlinedIcon
                sx={{ color: '#E0115F', fontSize: "26px" }}
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
          <GenderPieChart filter={filter} />
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
            <CategoriesPieAndBarChart chartType={chartType} />
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