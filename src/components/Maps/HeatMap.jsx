import React, { useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4geodata_brazilLow from '@amcharts/amcharts4-geodata/brazilLow';

am4core.useTheme(am4themes_animated);

const HeatMapChart = ({ onStateClick }) => {
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
    polygonTemplate.tooltipText = '{name}';
    polygonTemplate.fill = am4core.color('#74B266');

    let heatLegend = chart.createChild(am4maps.HeatLegend);
    heatLegend.series = polygonSeries;
    heatLegend.align = 'right';
    heatLegend.width = am4core.percent(25);
    heatLegend.marginRight = am4core.percent(4);
    heatLegend.minValue = 0;
    heatLegend.maxValue = 11000;

    polygonSeries.heatRules.push({
      property: 'fill',
      target: polygonSeries.mapPolygons.template,
      min: am4core.color('#989596'),
      max: am4core.color('#1976d2'),
    });

    // Adicionando manipulador de eventos para capturar o clique em um estado
    polygonTemplate.events.on('hit', (ev) => {
      const stateId = ev.target.dataItem.dataContext.id;
      onStateClick(stateId);
    });

    // Ocultando ícone do amCharts
    chart.logo.disabled = true;

    chart.homeZoomLevel = 1;
    chart.minZoomLevel = 0.9;
    chart.maxZoomLevel = 32;

    // Habilitar rotação do mapa
    chart.deltaLongitude = 0;

    return () => {
      chart.dispose();
    };
  }, [onStateClick]);

  return <div id="heatmap-chart" style={{ width: '100%', height: '70vh' }}></div>;
};

export default HeatMapChart;
