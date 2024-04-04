import * as React from "react";
import Paper from "@mui/material/Paper";
import HeatMapChart from "../components/Maps/HeatMap";
import BaseLayout from "../layouts/BaseLayout";

export default function Home() {
  return (
    <BaseLayout titulo="Home">
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
    </BaseLayout>
  );
}
