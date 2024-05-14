import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
// import { getSales } from "../../services/SalesService";
import { ResponsiveBump } from "@nivo/bump";
import { getFeelingByMonth } from "../../services/SalesService";

export default function Chart({ filter, selectedSentiment }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [feelingData, setFeelingData] = useState([]);

  const sentimentColors = {
    Positive: colors.greenAccent[500], // Verde
    Neutral: "#ffa927", // Amarelo
    Negative: "#E0115F", // Vermelho
  };

  useEffect(() => {
    async function handleGetData() {
      try {
        const data = await getFeelingByMonth(
          filter.states,
          filter.regions,
          filter.feeling
        );

        // Mapeando os dados recebidos e reestruturando para o formato esperado pelo Nivo Bump Chart
        const formattedData = Object.keys(data[0])
          .filter((key) => key !== "_id")
          .map((key) => ({
            id: key,
            data: data.map((item) => ({
              x: item._id,
              y: item[key],
            })),
          }));

        setFeelingData(formattedData);
      } catch (error) {
        console.error("Error fetching feeling:", error.message);
      }
    }

    handleGetData();
  }, [filter]);

  const filteredData = selectedSentiment
    ? feelingData.filter((data) => data.id === selectedSentiment)
    : feelingData;

  if (true) {
    return (
      <>
        <ResponsiveBump
          data={filteredData.map((serie) => ({
            ...serie,
            data: serie.data.map((point) => ({ ...point, y: -point.y }))
          }))}
          keys={["Positive", "Neutral", "Negative"]}
          indexBy="_id"
          // indexScale={{ type: 'band', round: true }}
          colors={(data) => sentimentColors[data.id]}
          xPadding={0.4}
          activeLineWidth={3}
          inactiveLineWidth={0}
          inactiveOpacity={0.15}
          startLabelTextColor={{ theme: "background" }}
          endLabelTextColor={{ from: "color", modifiers: [] }}
          pointSize={4}
          inactivePointSize={0}
          pointColor={{ from: "serie.color", modifiers: [] }}
          pointBorderWidth={3}
          activePointBorderWidth={3}
          pointBorderColor={{ from: "serie.color" }}
          enableGridX={false}
          enableGridY={false}
          axisTop={false}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "",
            legendPosition: "middle",
            legendOffset: 32,
            truncateTickAt: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "",
            legendPosition: "middle",
            legendOffset: -40,
            scale: "linear", // Mantenha a escala linear
            format: (value) => Math.abs(value), // Formata a escala para números positivos
          }}
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          axisRight={null}
          theme={{
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
        />
      </>
    );
  }
}
