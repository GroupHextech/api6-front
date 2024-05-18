import React, { useEffect, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4geodata_brazilLow from '@amcharts/amcharts4-geodata/brazilLow';
import { dados } from "../Mocks";
import { getStates } from "../../services/SalesService.js";

am4core.useTheme(am4themes_animated);

const HeatMapChart = ({filter}) => {
  const [stateData, setStateData] = useState([]);

  useEffect(() => {

    async function handleStatesData() {
      console.log('atualização de filtros do heatmap', filter);
      const feeling = filter.feeling === 'todos' ? undefined : filter.feeling
      try {
        // Obtendo os dados calculados
        const data = await getStates(filter.activeStates, null, feeling);
        console.log('dados calculados', data);

        // Convertendo os dados calculados para o formato necessário para o mapa de calor
        const formattedStateData = [];
        for (let i = 0; i < data.length; i++) {
          const state = data[i];

          if (filter.activeStates.includes(state._id)) {
            formattedStateData.push({
              id: `BR-${state._id}`, // Formato necessário para os identificadores dos estados
              name: state._id,
              value: state.count
            });
          }
        }
        
        setStateData(formattedStateData);
      } catch (error) {
        console.error('Error fetching states:', error.message);
      }
    }

    handleStatesData();
  }, [filter]);

  useEffect(() => {
    let chart = am4core.create('heatmap-chart', am4maps.MapChart);
    chart.geodata = am4geodata_brazilLow;
    chart.projection = new am4maps.projections.Miller();

    // Desabilitando arrasto do mapa
    chart.seriesContainer.draggable = false;
    chart.seriesContainer.resizable = false;
    chart.chartContainer.wheelable = false;
    chart.chartContainer.draggable = false;

    let polygonSeries = new am4maps.MapPolygonSeries();
    polygonSeries.useGeodata = true;
    chart.series.push(polygonSeries);

    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = '{name}: {value}';
    polygonTemplate.fill = am4core.color('#CCCCCC');

    // Determinar as cores com base no sentimento do filtro
    const getHeatColors = (feeling) => {
      switch(feeling) {
        case 'Positive':
          return {
            min: am4core.color('#C5E1A5'), // Verde claro
            max: am4core.color('#388E3C')  // Verde escuro
          };
        case 'Neutral':
          return {
            min: am4core.color('#fff081'), // Amarelo claro
            max: am4core.color('#FBC02D')  // Amarelo escuro
          };
        case 'Negative':
          return {
            min: am4core.color('#EF9A9A'), // Vermelho claro
            max: am4core.color('#D32F2F')  // Vermelho escuro
          };
        default:
          return {
            min: am4core.color('#9fb2c4'), // Azul claro
            max: am4core.color('#032e59')  // Azul escuro
          };
      }
    };

    // Aplicar as cores apropriadas
    const heatColors = getHeatColors(filter.feeling);

    polygonSeries.heatRules.push({
      property: 'fill',
      target: polygonSeries.mapPolygons.template,
      min: heatColors.min,
      max: heatColors.max,
    });

    // Dados dos estados
    polygonSeries.data = stateData;

    // Ocultando ícone do amCharts
    chart.logo.disabled = true;

    chart.homeZoomLevel = 1;
    chart.minZoomLevel = 1;
    chart.maxZoomLevel = 1;

    // Desativar interação com o mapa
    chart.seriesContainer.events.disableType('doublehit');
    chart.chartContainer.background.events.disableType('doublehit');
    chart.seriesContainer.cursorOverStyle = am4core.MouseCursorStyle.default;

    return () => {
      chart.dispose();
    };
  }, [stateData]);

  return <div id="heatmap-chart" style={{ width: '100%', height: '500px' }}></div>;
};

export default HeatMapChart;
