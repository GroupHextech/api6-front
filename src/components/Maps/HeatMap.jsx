import React, { useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4geodata_brazilLow from '@amcharts/amcharts4-geodata/brazilLow';

am4core.useTheme(am4themes_animated);

const HeatMapChart = () => {
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
      min: am4core.color('#cccc'),
      max: am4core.color('#1976d2'),
    });

    // Dados de exemplo para estados do Brasil (substitua pelos seus próprios dados)
    polygonSeries.data = [
      { id: 'BR-AC', name: 'Acre', value: 95000 },
      { id: 'BR-AL', name: 'Alagoas', value: 110000 },
      { id: 'BR-AP', name: 'Amapá', value: 75000 },
      { id: 'BR-AM', name: 'Amazonas', value: 850000 },
      { id: 'BR-BA', name: 'Bahia', value: 150000 },
      { id: 'BR-CE', name: 'Ceará', value: 200000 },
      { id: 'BR-DF', name: 'Distrito Federal', value: 450000 },
      { id: 'BR-ES', name: 'Espírito Santo', value: 120000 },
      { id: 'BR-GO', name: 'Goiás', value: 280000 },
      { id: 'BR-MA', name: 'Maranhão', value: 90000 },
      { id: 'BR-MT', name: 'Mato Grosso', value: 350000 },
      { id: 'BR-MS', name: 'Mato Grosso do Sul', value: 200000 },
      { id: 'BR-MG', name: 'Minas Gerais', value: 700000 },
      { id: 'BR-PA', name: 'Pará', value: 400000 },
      { id: 'BR-PB', name: 'Paraíba', value: 130000 },
      { id: 'BR-PR', name: 'Paraná', value: 500000 },
      { id: 'BR-PE', name: 'Pernambuco', value: 300000 },
      { id: 'BR-PI', name: 'Piauí', value: 110000 },
      { id: 'BR-RJ', name: 'Rio de Janeiro', value: 800000 },
      { id: 'BR-RN', name: 'Rio Grande do Norte', value: 150000 },
      { id: 'BR-RS', name: 'Rio Grande do Sul', value: 600000 },
      { id: 'BR-RO', name: 'Rondônia', value: 95000 },
      { id: 'BR-RR', name: 'Roraima', value: 70000 },
      { id: 'BR-SC', name: 'Santa Catarina', value: 400000 },
      { id: 'BR-SP', name: 'São Paulo', value: 1000000 },
      { id: 'BR-SE', name: 'Sergipe', value: 80000 },
      { id: 'BR-TO', name: 'Tocantins', value: 120000 }
    ];
        

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
  }, []);

  return <div id="heatmap-chart" style={{ width: '100%', height: '500px' }}></div>;
};

export default HeatMapChart;
