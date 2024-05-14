import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { getGender } from "../../services/SalesService";

const GenderPieChart = ({filter}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [genderData, setGenderData] = useState([]);

  useEffect(() => {
    async function handleGenderData() {
      try {
        const data = await getGender(filter.states, filter.regions, filter.feeling);
        setGenderData(data);
      } catch (error) {
        console.error("Error fetching genders:", error.message);
      }
    }

    handleGenderData();
  }, [filter]);

  if (genderData?.length)
    return (
      <ResponsivePie
        data={[
          {
            id: genderData[1]?._id ?? 'F',
            value: genderData[1]?.count ?? 0,
            label: "Mulheres",
          },
          {
            id: genderData[0]?._id ?? 'M',
            value: genderData[0]?.count ?? 0,
            label: "Homens",
          },
        ]}
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
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={{ scheme: 'category10' }}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={colors.grey[100]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        enableArcLabels={false}
        arcLabelsRadiusOffset={0.4}
        arcLabelsSkipAngle={7}
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
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    );
};

export default GenderPieChart;
