import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
// import { getSales } from "../../services/SalesService";
import { dados } from "./MockSentimentos";
import { ResponsiveBar } from '@nivo/bar';
import { BarChart } from "@mui/x-charts";

export default function Chart() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    if (true) {
        return <>
            <ResponsiveBar
                data={dados}
                keys={[
                    'positivo',
                    'negativo'
                ]}
                indexBy="_id"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'dark2' }}
                fill={[
                    {
                        match: {
                            id: 'fries'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'sandwich'
                        },
                        id: 'lines'
                    }
                ]}
                borderColor={{ theme: "background" }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Months',
                    legendPosition: 'middle',
                    legendOffset: 32,
                    truncateTickAt: 0
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Sales',
                    legendPosition: 'middle',
                    legendOffset: -40,
                    truncateTickAt: 0
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.6
                        ]
                    ]
                }}
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
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'top-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                role="application"
                ariaLabel="Nivo bar chart demo"
                barAriaLabel={e => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
            />
        </>
    }
}
