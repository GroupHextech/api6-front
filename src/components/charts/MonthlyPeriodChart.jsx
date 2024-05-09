import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
// import { getSales } from "../../services/SalesService";
import { dados } from "./MockSentimentos";
import { ResponsiveBump } from "@nivo/bump";
import { getFeelingByMonth } from "../../services/SalesService";

export default function Chart({ filter }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [feelingData, setFeelingData] = useState([]);

  useEffect(() => {
    const handleGetData = async () => {
      const data = await getFeelingByMonth(
        filter.states,
        filter.regions,
        filter.feeling
      );

      // Mapeando os dados recebidos e reestruturando para o formato esperado pelo Nivo Bump Chart
      const formattedData = Object.keys(data[0]).filter(key => key !== "_id").map((key) => ({
        id: key,
        data: data.map(item => ({
          x: item._id,
          y: item[key]
        }))
      }));

      setFeelingData(formattedData);
    };

    handleGetData();
  }, [filter]);

  if (true) {
    return (
      <>
        <ResponsiveBump
          data={feelingData}
          keys={["Positive", "Neutral", "Negative"]}
          indexBy="_id"
          xPadding={0.4}
          colors={{ scheme: "set1" }}
          activeLineWidth={3}
          inactiveLineWidth={3}
          inactiveOpacity={0.15}
          startLabelTextColor={{ theme: "background" }}
          endLabelTextColor={{ from: "color", modifiers: [] }}
          pointSize={4}
          inactivePointSize={0}
          pointColor={{ from: "serie.color", modifiers: [] }}
          pointBorderWidth={3}
          activePointBorderWidth={3}
          pointBorderColor={{ from: "serie.color" }}
          axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "",
            legendPosition: "middle",
            legendOffset: -36,
            truncateTickAt: 0,
          }}
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
            truncateTickAt: 0,
          }}
          margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
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
