import * as React from "react";
import { useState } from "react";
import { PieChart, BarChart } from "@mui/x-charts";
import { dados } from "./Mocks.jsx";
import { Typography, Box, Button } from "@mui/material";

function processarDados(dados) {
  const categorias = {};

  dados.forEach((produto) => {
    const categoriaLv1 = produto.site_category_lv1;
    const categoriaLv2 = produto.site_category_lv2;

    if (!categorias[categoriaLv1]) {
      categorias[categoriaLv1] = {
        categoriaLv1,
        categoriaLv2: {},
        contagem: 0,
        // totalRating: 0,
      };
    }

    if (!categorias[categoriaLv1].categoriaLv2[categoriaLv2]) {
      categorias[categoriaLv1].categoriaLv2[categoriaLv2] = 0;
    }

    categorias[categoriaLv1].categoriaLv2[categoriaLv2]++;
    categorias[categoriaLv1].contagem++;
    // categorias[categoriaLv1].totalRating += parseInt(produto.overall_rating, 10);
  });

  return Object.values(categorias);
}

function mapearDadosCategoriasLv1(categorias) {
  return categorias.map((categoria) => ({
    label: categoria.categoriaLv1,
    value: categoria.contagem,
    // averageRating: categoria.totalRating / categoria.contagem,
  }));
}

function mapearDadosCategoriasLv2(categorias) {
  return Object.values(categorias).reduce((acc, categoria) => {
    return acc.concat(
      Object.entries(categoria.categoriaLv2).map(([labelLv2, contagem]) => ({
        label: `${categoria.categoriaLv1} - ${labelLv2}`,
        value: contagem,
      }))
    );
  }, []);
}

const dadosProcessados = processarDados(dados);
const dataForBarChart = mapearDadosCategoriasLv1(dadosProcessados);

const data1 = mapearDadosCategoriasLv1(dadosProcessados);
const data2 = mapearDadosCategoriasLv2(dadosProcessados);

const ChartCategories = () => {
  const [chartType, setChartType] = useState("pie"); // Use useState inside the component

  const toggleChartType = () => {
    setChartType((prevChartType) => (prevChartType === "pie" ? "bar" : "pie"));
  };

  return (
    <>
      <Typography variant="button" display="block" gutterBottom>
        Quantidade por Categoria
      </Typography>
      <Box display="flex" flexWrap="wrap" justifyContent="space-between">
        {chartType === "pie" && (
          <PieChart
          series={[
            {
              innerRadius: 0,
              outerRadius: 60,
              data: data1,
              cornerRadius: 3,
            },
            {
              innerRadius: 60,
              outerRadius: 100,
              data: data2,
              cornerRadius: 4,
              highlightScope: { faded: "global", highlighted: "item" },
            },
          ]}
            width={250}
            height={290}
            slotProps={{
              legend: { hidden: true },
            }}
          />
        )}
        {chartType === "bar" && (
          <BarChart
            dataset={dataForBarChart}
            yAxis={[{ scaleType: "band", dataKey: "label" }]}
            series={[{ dataKey: "value", label: "Total" }]}
            layout="horizontal"
            width={250}
            height={290}
          />
        )}
      </Box>
      <Button onClick={toggleChartType}>Alternar Gráfico</Button>
    </>
  );
};

export default ChartCategories;
