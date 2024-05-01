import { useState } from "react";
import { PieChart, BarChart } from "@mui/x-charts";
import { useTheme } from "@mui/material";
import { useEffect } from "react";
import { getCategories } from "../../services/SalesService.js";
import { ResponsiveBarCanvas } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../theme.js";

function processarDados(dados) {
  const categorias = {};

  dados.forEach((produto) => {
    const categoriaLv1 = produto._id; // Assuming _id directly contains the category

    if (!categorias[categoriaLv1]) {
      categorias[categoriaLv1] = {
        categoriaLv1,
        contagem: produto.count, // Use 'count' from the data directly
      };
    } else {
      categorias[categoriaLv1].contagem += produto.count;
    }
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

const CategoriesPieAndBarChart = ({ chartType, selectedStates }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [categoriesData1, setCategoriesData1] = useState([]);
  const [dataForBarChart, setDataForBarChart] = useState([]);

  useEffect(() => {
    async function handleCategoriesData() {
      try {
        const data = await getCategories(selectedStates);

        const dadosProcessados = processarDados(data);
        const formattedData = dadosProcessados.map((categoria) => ({
          id: categoria.categoriaLv1,
          label: categoria.categoriaLv1,
          value: categoria.contagem,
        }));
        setDataForBarChart(mapearDadosCategoriasLv1(dadosProcessados));

        setCategoriesData1(formattedData);

        setCategoriesData2(mapearDadosCategoriasLv2(dadosProcessados));
      } catch (error) {
        console.error("Error fetching genders:", error.message);
      }
    }

    handleCategoriesData();
  }, [selectedStates]);

  return (
    <>
      {chartType === "pie" && (
        <>
          <ResponsivePie
            data={categoriesData1}
            theme={{
              tooltip: {
                container: {
                  background: "#fff", // cor de fundo do tooltip
                  color: "#000", // cor do texto do tooltip
                },
              },
            }}
            margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
            sortByValue={true}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.2]],
            }}
            enableArcLinkLabels={false}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color", modifiers: [] }}
            enableArcLabels={false}
            arcLabel="value"
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: "color",
              modifiers: [["darker", 2]],
            }}
            defs={[
              {
                id: "dots",
                type: "patternDots",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)",
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: "lines",
                type: "patternLines",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)",
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
            fill={[
              {
                match: {
                  id: "ruby",
                },
                id: "dots",
              },
              {
                match: {
                  id: "c",
                },
                id: "dots",
              },
              {
                match: {
                  id: "go",
                },
                id: "dots",
              },
              {
                match: {
                  id: "python",
                },
                id: "dots",
              },
              {
                match: {
                  id: "scala",
                },
                id: "lines",
              },
              {
                match: {
                  id: "lisp",
                },
                id: "lines",
              },
              {
                match: {
                  id: "elixir",
                },
                id: "lines",
              },
              {
                match: {
                  id: "javascript",
                },
                id: "lines",
              },
            ]}
            legends={[]}
          />
        </>
      )}
      {chartType === "bar" && (
        <>
          <ResponsiveBarCanvas
            data={dataForBarChart}
            theme={{
              // added
              tooltip: {
                container: {
                  background: "#fff", // cor de fundo do tooltip
                  color: "#000", // cor do texto do tooltip
                },
              },
              axis: {
                domain: {
                  line: {
                    stroke: colors.grey[100],
                  },
                },
                legend: {
                  text: {
                    fill: colors.grey[100],
                  },
                },
                ticks: {
                  line: {
                    stroke: colors.grey[100],
                    strokeWidth: 1,
                  },
                  text: {
                    fill: colors.grey[100],
                  },
                },
              },
              legends: {
                text: {
                  fill: colors.grey[100],
                },
              },
            }}
            keys={["value"]}
            indexBy="label"
            margin={{ top: 20, right: 30, bottom: 30, left: 150 }}
            padding={0.3}
            layout="horizontal"
            colors={{ scheme: "dark2" }}
            colorBy="indexValue"
            defs={[
              {
                id: "dots",
                type: "patternDots",
                background: "inherit",
                color: "#38bcb2",
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: "lines",
                type: "patternLines",
                background: "inherit",
                color: "#eed312",
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
            fill={[
              {
                match: {
                  id: "fries",
                },
                id: "dots",
              },
              {
                match: {
                  id: "sandwich",
                },
                id: "lines",
              },
            ]}
            borderColor={{ theme: "background" }}
            axisTop={null}
            axisRight={null}
            axisBottom={null}
            enableGridY={false}
            enableLabel={true}
            enableTotals={true}
          />
        </>
      )}
    </>
  );
};

export default CategoriesPieAndBarChart;
