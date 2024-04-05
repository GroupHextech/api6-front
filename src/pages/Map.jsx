import * as React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box"
import HeatMapChart from "../components/Maps/HeatMap";
import BaseLayout from "../layouts/BaseLayout";
import { Label } from "@mui/icons-material";

export default function Map() {
  return (
    <BaseLayout titulo="Map">
      <Box style={{display:"flex", flexDirection:"row"}}>
        
              <Paper          
          sx={{
            p: 2,
            display: "flex",
            flex: 0.2,
            flexDirection: "column",
            marginLeft: 3,
          }}>

        </Paper>

        <Box style={{flex: 0.8,display:"flex", flexDirection:"column", gap:10}}>
          <Paper sx={{marginLeft: 3}}>abacate</Paper>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flex: 1,
            flexDirection: "column",
            marginLeft: 3,
          }}
        >
          <HeatMapChart></HeatMapChart>
        </Paper>
        </Box>
      </Box>


    </BaseLayout>
  );
}
