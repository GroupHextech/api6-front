import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses, PieChart } from '@mui/x-charts';
import * as React from 'react';

import Title from './Title';
import { useState, useEffect } from 'react';

const dados = [
  {
    submission_date: '2018-01-01 00:11:28',
    reviewer_id: 'd0fb1ca69422530334178f5c8624aa7a99da47907c44de0243719b15d50623ce',
    product_id: '132532965',
    product_name: 'Notebook Asus Vivobook Max X541NA-GO472T Intel Celeron Quad Core 4GB 500GB Tela LED 15,6" Windows - 10 Branco',
    product_brand: '',
    site_category_lv1: 'Informática',
    site_category_lv2: 'Notebook',
    review_title: 'Bom',
    overall_rating: '4',
    recommend_to_a_friend: 'Yes',
    review_text: 'Estou contente com a compra entrega rápida o único problema com as Americanas é se houver troca ou devolução do produto o consumidor tem problemas com espera.',
    reviewer_birth_year: '1958.0',
    reviewer_gender: 'F',
    reviewer_state: 'RJ'
  },
  {
    submission_date: '2018-01-01 00:13:48',
    reviewer_id: '014d6dc5a10aed1ff1e6f349fb2b059a2d3de511c7538a9008da562ead5f5ecd',
    product_id: '22562178',
    product_name: 'Copo Acrílico Com Canudo 500ml Rocie',
    product_brand: '',
    site_category_lv1: 'Utilidades Domésticas',
    site_category_lv2: 'Copos, Taças e Canecas',
    review_title: 'Preço imbatível, ótima qualidade',
    overall_rating: '4',
    recommend_to_a_friend: 'Yes',
    review_text: 'Por apenas R$1994.20,eu consegui comprar esse lindo copo de acrílico.',
    reviewer_birth_year: '1996.0',
    reviewer_gender: 'M',
    reviewer_state: 'SC'
  },
  {
    submission_date: '2018-01-01 00:26:02',
    reviewer_id: '44f2c8edd93471926fff601274b8b2b5c4824e386ae4f210329b9b71890277fd',
    product_id: '113022329',
    product_name: 'Panela de Pressão Elétrica Philips Walita Daily 5L com Timer',
    product_brand: 'philips walita',
    site_category_lv1: 'Eletroportáteis',
    site_category_lv2: 'Panela Elétrica',
    review_title: 'ATENDE TODAS AS EXPECTATIVA.',
    overall_rating: '4',
    recommend_to_a_friend: 'Yes',
    review_text: 'SUPERA EM AGILIDADE E PRATICIDADE OUTRAS PANELAS ELÉTRICAS.  COSTUMO USAR OUTRA PANELA PARA COZIMENTO DE ARROZ (JAPONESA), MAS LEVA MUITO TEMPO,  +/- 50 MINUTOS.  NESSA PANELA  É MUITO MAIS RÁPIDO, EXATAMENTE 6 MINUTOS.    EU RECOMENDO.',
    reviewer_birth_year: '1984.0',
    reviewer_gender: 'M',
    reviewer_state: 'SP'
  },
  {
    submission_date: '2018-01-01 00:35:54',
    reviewer_id: 'ce741665c1764ab2d77539e18d0e4f66dde6213c9f0863f165ffedb1e8147984',
    product_id: '113851581',
    product_name: 'Betoneira Columbus - Roma Brinquedos',
    product_brand: 'roma jensen',
    site_category_lv1: 'Brinquedos',
    site_category_lv2: 'Veículos de Brinquedo',
    review_title: 'presente mais que desejado',
    overall_rating: '4',
    recommend_to_a_friend: 'Yes',
    review_text: 'MEU FILHO AMOU! PARECE DE VERDADE COM TANTOS DETALHES QUE TÊM!',
    reviewer_birth_year: '1985.0',
    reviewer_gender: 'F',
    reviewer_state: 'SP'
  },
  {
    submission_date: '2018-01-01 01:00:28',
    reviewer_id: '7d7b6b18dda804a897359276cef0ca252f9932bf4b5c8e72bce7e88850efa0fc',
    product_id: '131788803',
    product_name: 'Smart TV LED 43" LG 43UJ6525 Ultra HD 4K com Conversor Digital 4 HDMI 2 USB WebOS 3.5 Painel Ips HDR e Magic Mobile Connection',
    product_brand: 'lg',
    site_category_lv1: 'TV e Home Theater',
    site_category_lv2: 'TV',
    review_title: 'Sem duvidas, excelente',
    overall_rating: '5',
    recommend_to_a_friend: 'Yes',
    review_text: 'A entrega foi no prazo, as americanas estão de parabéns. A smart tv é muito boa, a navegação na internete e pelos aplicativos e excelente, não trava, sem falar da imagem que é de surpreender. recomendo.',
    reviewer_birth_year: '1994.0',
    reviewer_gender: 'M',
    reviewer_state: 'MG'
  },
  {
    submission_date: '2018-01-01 01:27:23',
    reviewer_id: '28b1844e1cd24dd2288b7cafb052a0b46aed53ab28e1c11632e3a2297a64aad8',
    product_id: '22562178',
    product_name: 'Copo Acrílico Com Canudo 500ml Rocie',
    product_brand: '',
    site_category_lv1: 'Utilidades Domésticas',
    site_category_lv2: 'Copos, Taças e Canecas',
    review_title: 'Produto imperdível',
    overall_rating: '5',
    recommend_to_a_friend: 'Yes',
    review_text: 'Excelente produto, por fora em material acrílico super resistente e por dentro em adamantio, faz milagre com qualquer bebida. Sugiro aproveitarem a promoção antes que acabe.',
    reviewer_birth_year: '1979.0',
    reviewer_gender: 'M',
    reviewer_state: 'PA'
  }
];

function agrupar() {

  let qtdMulheres = 0;
  let qtdHomens = 0;
  for (let i = 0; i < dados.length; i++) {
    console.log(dados[i].reviewer_gender)
    // se genero for `mulher` entao SomarMulher+1
    if (dados[i].reviewer_gender === 'F') {
      qtdMulheres++;
    } else {
      qtdHomens++;
    }
  }

  return [qtdHomens, qtdMulheres]
}

export default function Chart() {
  const theme = useTheme();
  
  const valores = agrupar();

  return (
    <React.Fragment>
      <Title>Quantidade de compras por gênero</Title>
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
