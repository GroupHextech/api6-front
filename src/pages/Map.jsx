import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box"
import HeatMapChart from "../components/Maps/HeatMap";
import BaseLayout from "../layouts/BaseLayout";
import Chart from "../components/Maps/chart";

export default function Map() {

  const [selectedState, setSelectedState] = useState(null);

  const handleStateClick = (stateId) => {
    setSelectedState(stateId);
  };

  const [activeMap, setActiveMap] = React.useState("Vendas (Geral)");

  return (
    <BaseLayout titulo="Map">
      <Box style={{}}>
        


        <Box style={{flex: 0.8,display:"flex", flexDirection:"column", gap:10}}>
          <div>
            <Paper sx={{marginLeft: 3, justifyContent:"center", alignContent:"center"}}>
              <h1 style={{textAlign:"center"}}>Dados Geográficos {activeMap}</h1>
            </Paper>
          </div>         
          <div style={{display:"flex", flexDirection:"row"}}>
          <Paper          
          sx={{
            p: 2,
            display: "flex",
            flex: 0.2,
            flexDirection: "column",
            marginLeft: 3,
            gap:10
          }}>
            <button><p>Vendas gerais</p></button>
            <button><p>Vendas com piramede dataria</p></button>
            <button><p>Teste</p></button>
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
        <Chart state={selectedState} />

        <HeatMapChart onStateClick={handleStateClick} />
            </Paper>
          </div>

        </Box>
      </Box>


    </BaseLayout>
  );
}
