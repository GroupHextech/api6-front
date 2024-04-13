import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import HeatMapChart from "../components/Maps/HeatMap";
import BaseLayout from "../layouts/BaseLayout";

export default function Map() {

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
            <Button variant="contained" onClick={setActiveMap}>Vendas Gerais</Button>
      
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

        <HeatMapChart/>
            </Paper>
          </div>

        </Box>
      </Box>


    </BaseLayout>
  );
}

const styles = {

  button:{
    backgroundColor:"#1976d2",
    borderRadius:5,
    color:"#fff",
    borderColor:"transparent"
  }
}