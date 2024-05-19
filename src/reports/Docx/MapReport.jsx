// src/docxContent.js

import { AlignmentType, Document, Paragraph, TextRun, HeadingLevel, ImageRun } from 'docx';

function numberWithCommas (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const createDocxContent = (mapBlob, selectedFeeling, selectedRegion, selectedStates, ) => {
  const subtitles = [
    // { text: "Total dos dados de vendas das lojas Americanas do ano de 2018.", hasData: true },
    // { text: "Total dos dados da pesquisa:" },
    { text: "Filtros selecionados: ", hasData: true },
    { text: "Gráficos demonstrativos" },
    { text: "Mapa:", imageBlob: mapBlob },
  ]

  const bullets = [
    {content: "Sentimento:", value: selectedFeeling.toUpperCase()},
    {content: "Região:", value: selectedRegion.toUpperCase()},
    {content: "Estados:", value: selectedStates.join(', ')},
  ]

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

      if (subtitles[index].hasData) {
        contents.push(breakLine())
        contents.push(...getBullets())
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

  const getBullets = () => {
    return bullets.map((bulletText, index) => {
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
    }
    )
  }

  const getImageFromBlob = (myBlobData) => {
    return new Paragraph({
      children: [
        new ImageRun({
          type: "jpg",
          data: myBlobData,
          transformation: {
            width: 525,
            height: 350
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
