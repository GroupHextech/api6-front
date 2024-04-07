import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts';
import * as React from 'react';
import { Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { dados } from './Mocks';

function determinarPeriodo(horario) {
  // Extrair apenas a parte do horário
  const horarioSplit = horario.split(' ')[1];
  const [hora, minuto, segundo] = horarioSplit.split(':').map(Number);

  // Determinar o período com base nas horas
  if (hora >= 6 && hora < 12) {
    return 'Manhã';
  } else if (hora >= 12 && hora < 18) {
    return 'Tarde';
  } else {
    return 'Noite';
  }
}

function agruparVendasPorPeriodo(dados) {
  const vendasPorPeriodo = {};

  // Iterando sobre cada item dos dados
  dados.forEach((item) => {
    // const ano = new Date(item.submission_date).getFullYear(); // Obtendo o ano da data
    const ano = Math.floor(Math.random() * (2024 - 2018) + 2018);
    const mes = new Date(item.submission_date).getMonth() + 1;
    const horas = Math.floor(Math.random() * 24); 

    // Criando uma chave no formato "YYYY-MM" para representar o período
    const periodo = determinarPeriodo(item.submission_date)

    // Inicializando o contador de vendas para o período, se necessário
    if (!vendasPorPeriodo[periodo]) {
      vendasPorPeriodo[periodo] = 0;
    }

    // Incrementando o contador de vendas para o período
    vendasPorPeriodo[periodo]++;
  });

  // Convertendo o objeto em um array de objetos para o BarChart
  const vendasPorPeriodoArray = Object.entries(vendasPorPeriodo).map(([periodo, quantidade]) => ({
    periodo,
    qtde: quantidade
  }));

  return vendasPorPeriodoArray;
}

export default function Chart() {
  // const theme = useTheme();

  // Obtendo os dados agrupados por período
  const dadosAgrupados = agruparVendasPorPeriodo(dados);

  return (
    <React.Fragment>
      <Typography variant='button' display='block' gutterBottom>Quantidade de vendas por período</Typography>
      <BarChart
        dataset={dadosAgrupados} // Passando os dados agrupados para o BarChart
        xAxis={[{ scaleType: 'band', dataKey: 'periodo' }]} // Configurando o eixo x
        series={[
          { dataKey: 'qtde', label: 'Quantidade de vendas' }
        ]} // Configurando a série de dados
        height={400} // Definindo a altura do gráfico
        width={400}
        // {...theme} // Passando o tema para o gráfico
      />
    </React.Fragment>
  );
}
