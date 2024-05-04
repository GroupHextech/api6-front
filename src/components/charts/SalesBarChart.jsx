import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import { getSales } from "../../services/SalesService";
import { ResponsiveBarCanvas } from "@nivo/bar";

function determinarPeriodo(horario) {
  // Extrair apenas a parte do horário
  const horarioSplit = horario.split(" ")[1];
  const [hora, minuto, segundo] = horarioSplit.split(":").map(Number);

  // Determinar o período com base nas horas
  if (hora >= 6 && hora < 12) {
    return "Morning";
  } else if (hora >= 12 && hora < 18) {
    return "Afternoon";
  } else {
    return "Night";
  }
}

function agruparVendasPorPeriodo(dados) {
  const vendasPorPeriodo = {};

  // Iterando sobre cada item dos dados
  dados.forEach((item) => {
    // Criando uma chave no formato "YYYY-MM" para representar o período
    const periodo = determinarPeriodo(item._id);

    // Inicializando o contador de vendas para o período, se necessário
    if (!vendasPorPeriodo[periodo]) {
      vendasPorPeriodo[periodo] = 0;
    }

    // Incrementando o contador de vendas para o período
    vendasPorPeriodo[periodo] = vendasPorPeriodo[periodo] + item.count;
  });

  // Convertendo o objeto em um array de objetos para o BarChart
  const vendasPorPeriodoArray = Object.entries(vendasPorPeriodo).map(
    ([periodo, quantidade]) => ({
      periodo,
      qtde: quantidade,
    })
  );

  return vendasPorPeriodoArray;
}

export default function Chart({filter}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    async function handleSalesData() {
      try {
        const data = await getSales(filter.states, filter.regions, filter.feeling);
        setSalesData(agruparVendasPorPeriodo(data));
      } catch (error) {
        console.error("Error fetching sales:", error.message);
      }
    }

    handleSalesData();
  }, [filter]);

  if (salesData?.length) {
    return (
      <ResponsiveBarCanvas
        data={salesData}
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
        keys={["qtde"]}
        indexBy="periodo"
        margin={{ top: 30, right: 0, bottom: 30, left: 50 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        enableLabel={false}
        enableTotals={true}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ theme: 'grid.line.stroke' }}
        role="application"
        isFocusable={true}
      />
    );
  }
}
