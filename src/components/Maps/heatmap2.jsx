import React from 'react';
import Heatmap from 'react-heatmap-grid';

const BrazilHeatmap = ({ data }) => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Heatmap
        xLabels={['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']} // Regiões do Brasil
        yLabels={['Acre', 'Amapá', 'Amazonas', 'Pará', 'Rondônia', 'Roraima', 'Tocantins', 'Alagoas', 'Bahia', 'Ceará', 'Maranhão', 'Paraíba', 'Pernambuco', 'Piauí', 'Rio Grande do Norte', 'Sergipe', 'Distrito Federal', 'Goiás', 'Mato Grosso', 'Mato Grosso do Sul', 'Espírito Santo', 'Minas Gerais', 'Rio de Janeiro', 'São Paulo', 'Paraná', 'Rio Grande do Sul', 'Santa Catarina']} // Estados do Brasil
        data={data}
        cellStyle={(background, value, min, max, data, x, y) => ({
          background: `rgb(0, 151, 230, ${1 - (max - value) / (max - min)})`,
          fontSize: '11px',
          color: '#fff',
        })}
        title="Mapa de Calor do Brasil"
        xLabelWidth={60}
      />
    </div>
  );
};

export default BrazilHeatmap;
