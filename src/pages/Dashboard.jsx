import * as React from "react";
import { Grid, Paper } from "@mui/material";
import ChartGender from "../components/ChartGender";
import ChartSales from "../components/ChartSales";
import ChartCategories from "../components/ChartCategories";
import Orders from "../components/Orders";
import BaseLayout from "../layouts/BaseLayout";
import { maxHeight } from "@mui/system";

export default function Dashboard() {
  return (
    <BaseLayout titulo="Dashboard">
        <Grid container spacing={2} >
          {/* Chart */}
          <Grid item xs={12} md={12} lg={6} >
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 300,
              }}
            >
              <ChartGender />
            </Paper>
          </Grid>
          <Grid item xs={12} md={12} lg={6} >
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 300,
              }}
            >
              <ChartSales />
            </Paper>
          </Grid>
          {/* Recent Deposits */}
          <Grid item xs={12} md={12} lg={6}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: maxHeight,
              }}
            >
              <ChartCategories />
            </Paper>
          </Grid>
          {/* Recent Orders */}
          {/* <Grid item xs={6}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Orders />
            </Paper>
          </Grid> */}
        </Grid>
    </BaseLayout>
  );
}
