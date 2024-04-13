import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses, PieChart } from '@mui/x-charts';
import * as React from 'react';
import { Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { getGender } from '../services/SalesService';


export default function ChartGender() {
  const theme = useTheme();
  
  const [genderData, setGenderData] = useState([])

  useEffect(() => {
    async function handleGenderData() {
      try {
        const data = await getGender();
        setGenderData(data);
      } catch (error) {
        console.error('Error fetching genders:', error.message);
      }
    }

    handleGenderData()
  }, [])

  

  if (genderData?.length) {
    return <React.Fragment>
      <Typography variant='button' display='block' gutterBottom>Quantidade de compras por gênero</Typography>
      <div style={{width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <PieChart
          series={[
            {
              data: [
                { id: genderData[1]._id, value: genderData[1].count, label: 'Mulheres' },
                { id: genderData[0]._id, value: genderData[0].count, label: 'Homens' },
              ],
            },
          ]}
          width={400}
          height={200}
        />
      </div>
    </React.Fragment>
  }
  return <></>
}
