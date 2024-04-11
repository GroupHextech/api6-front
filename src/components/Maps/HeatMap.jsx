import React, { useEffect, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4geodata_brazilLow from '@amcharts/amcharts4-geodata/brazilLow';
import { dados } from "../Mocks";

am4core.useTheme(am4themes_animated);

const HeatMapChart = () => {
  const [stateData, setStateData] = useState([]);

  useEffect(() => {
    // Função para calcular a quantidade de avaliações para cada estado
    const calculateStateData = () => {
      const stateCounts = {};
      dados.forEach(review => {
        const state = review.reviewer_state;
        stateCounts[state] = stateCounts[state] ? stateCounts[state] + 1 : 1;
      });
      return stateCounts;
    };

    // Obtendo os dados calculados
    const calculatedStateData = calculateStateData();

    // Convertendo os dados calculados para o formato necessário para o mapa de calor
    const formattedStateData = Object.entries(calculatedStateData).map(([state, count]) => ({
      id: `BR-${state}`, // Formato necessário para os identificadores dos estados
      name: state,
      value: count
    }));

    setStateData(formattedStateData);
  }, []);

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
    polygonTemplate.fill = am4core.color('#74B266');

    polygonSeries.heatRules.push({
      property: 'fill',
      target: polygonSeries.mapPolygons.template,
      min: am4core.color('#cccc'),
      max: am4core.color('#1976d2'),
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
