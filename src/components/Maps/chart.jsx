import React from 'react';

const Chart = ({ state }) => {
  // Dados de exemplo para o gráfico (substitua pelos seus próprios dados)
  const chartData = {
    RJ: [
      { category: 'Categoria A', value: 500 },
      { category: 'Categoria B', value: 400 },
      { category: 'Categoria C', value: 300 },
      { category: 'Categoria D', value: 200 },
      { category: 'Categoria E', value: 100 },
    ],
    SP: [
      { category: 'Categoria A', value: 100 },
      { category: 'Categoria B', value: 200 },
      { category: 'Categoria C', value: 300 },
      { category: 'Categoria D', value: 400 },
      { category: 'Categoria E', value: 500 },
    ],
  };

  // Verifica se o estado selecionado tem dados definidos, caso contrário, use dados padrão
  const data = state && chartData[state] ? chartData[state] : chartData['RJ'];

  return (
    <div>
      <h3>Gráfico</h3>
      <svg width="400" height="300">
        {data.map((item, index) => (
          <rect
            key={index}
            x={index * 60}
            y={300 - item.value}
            width="50"
            height={item.value}
            fill="blue"
          />
        ))}
      </svg>
    </div>
  );
};

export default Chart;
