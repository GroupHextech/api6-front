// src/docxContent.js

import { AlignmentType, Document, Paragraph, TextRun, HeadingLevel, ImageRun } from 'docx';
import { getFeeling } from '../../services/SalesService';

function numberWithCommas (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const createDocxContent = async (mapBlob, selectedFeeling, selectedRegion, selectedStates,) => {

  const feelingData = [];
  const feelingDataFiltered = [];
  let data;

  data = await getFeeling()
  data.forEach((row) => {
    feelingData[row._id.toLowerCase()] = row.count.toLocaleString('pt-BR');
    feelingData["total"] += row.count;
  });

  data = await getFeeling(selectedStates, selectedRegion)
  data.forEach((row) => {
    feelingDataFiltered[row._id.toLowerCase()] = row.count.toLocaleString('pt-BR');
    feelingDataFiltered["total"] += row.count;
  });

  const subtitles = [
    // { text: "Total dos dados de vendas das lojas Americanas do ano de 2018.", hasData: true },
    // { text: "Total dos dados da pesquisa:" },
    { text: "Filtros selecionados: ", bulletIndex: 0 },
    { text: "Total dos dados de vendas das lojas Americanas do ano de 2018:", bulletIndex: 1 },
    { text: "Total definido pelo filtro:", bulletIndex: 2 },
    { text: "Filtragem por sentimentos:" },
    { text: "Mapa do Brasil:", imageBlob: mapBlob },
  ]

  const bullets = {
    0: [
      { content: "Sentimento:", value: selectedFeeling.toUpperCase() },
      { content: "Região:", value: selectedRegion.toUpperCase() },
      { content: "Estados:", value: selectedStates.join(', ') }
    ],
    1: [
      { content: "Total de positivo:", value: `${feelingData.positive} mil` },
      { content: "Total de neutro:", value: `${feelingData.neutral} mil` },
      { content: "Total de negativo:", value: `${feelingData.negative} mil` }
    ],
    2: [
      { content: "Total de positivo:", value: `${feelingDataFiltered.positive} mil` },
      { content: "Total de neutro:", value: `${feelingDataFiltered.neutral} mil` },
      { content: "Total de negativo:", value: `${feelingDataFiltered.negative} mil` }
    ]
  };

  const breakLine = () => {
    return new Paragraph({
      text: "",
      alignment: AlignmentType.CENTER,
    })
  }

  const getSubtitles = () => {
    const contents = [];

    for (let index = 0; index < subtitles.length; index++) {
      contents.push(breakLine()),
        contents.push(
          new Paragraph({
            children: [
              new TextRun({
                text: subtitles[index],
                bold: true,
                font: "Aptos",
                size: 24,
                color: "92BAF7"
              })
            ],
          })
        )

      if (subtitles[index].hasOwnProperty('bulletIndex')) {
        contents.push(breakLine())
        contents.push(...getBullets(subtitles[index].bulletIndex))
        contents.push(breakLine())
      }

      if (subtitles[index].imageBlob) {
        contents.push(breakLine())
        contents.push(getImageFromBlob(subtitles[index].imageBlob))
        contents.push(breakLine())
      }
    }

    return contents;
  }

  const getBullets = (bulletIndex) => {
    return bullets[bulletIndex].map(bulletText => {
      return new Paragraph({
        children: [
          new TextRun({
            text: `${bulletText.content}`,
            bold: true,
            font: "Aptos",
            size: 24
          }),
          new TextRun({
            text: ` ${bulletText.value}`,
            font: "Aptos",
            size: 24
          })
        ],
        bullet: { level: 0 }
      })
    })
  }

  const getImageFromBlob = (myBlobData) => {
    return new Paragraph({
      children: [
        new ImageRun({
          type: "jpg",
          data: myBlobData,
          transformation: {
            width: 540,
            height: 400
          }
        })
      ]
    })
  }

  return new Document({
    styles: {
      default: {
        heading1: {
          run: {
            size: 32,
            bold: true,
            color: "000000",
            font: "Aptos"
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 120,
            },
          },
        },
        heading2: {
          run: {
            size: 74,
            bold: true,
            color: "92BAF7",
            font: "Aptos"
          },
          paragraph: {
            spacing: {
              before: 600,
              after: 120,
            },
          }
        },
      },
    },
    paragraphStyles: [
      {
        id: "subtitle",
        name: "Subtitle",
        basedOn: "Normal",
        next: "Normal",
        run: {
          size: 12,
          bold: true,
          color: "92BAF7",
          font: "Aptos"
        },
        paragraph: {
          spacing: {
            before: 240,
            after: 120,
          },
        }
      }
    ],
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "Relatório Mapa HexAnalytics",
            heading: HeadingLevel.HEADING_1,
          }),
          ...getSubtitles(),
        ],
      },
    ],
  });
};
