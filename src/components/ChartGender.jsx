import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses, PieChart } from '@mui/x-charts';
import * as React from 'react';
import { Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { dados } from './Mocks';


function agrupar() {

  let qtdMulheres = 0;
  let qtdHomens = 0;
  for (let i = 0; i < dados.length; i++) {
    // se genero for `mulher` entao SomarMulher+1
    if (dados[i].reviewer_gender === 'F') {
      qtdMulheres++;
    } else {
      qtdHomens++;
    }
  }

  return [qtdHomens, qtdMulheres]
}

export default function ChartGender() {
  const theme = useTheme();
  
  const valores = agrupar();

  return (
    <React.Fragment>
      <Typography variant='button' display='block' gutterBottom>Quantidade de compras por gênero</Typography>
      <div style={{width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: valores[0], label: 'Mulheres' },
                { id: 1, value: valores[1], label: 'Homens' }
              ],
            },
          ]}
          width={400}
          height={200}
        />
      </div>
    </React.Fragment>
  );
}
