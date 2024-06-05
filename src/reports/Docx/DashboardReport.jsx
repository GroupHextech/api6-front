// src/docxContent.js

import { AlignmentType, Document, Paragraph, TextRun, HeadingLevel, ImageRun } from 'docx';

function numberWithCommas (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const createDocxContent = (feelingAll, feelingData, imageBlobs) => {
  const subtitles = [
    { text: "Total dos dados de vendas das lojas Americanas do ano de 2018.", feeling: feelingAll },
    // { text: "Total dos dados da pesquisa:" },
    // { text: "Selecionado os estados ou região: São Paulo e Acre.", feeling: feelingData },
    { text: "Total definido pelo filtro:", feeling: feelingData },
    { text: "Gráficos demonstrativos" },
    { text: "Gender:", imageBlob: imageBlobs.genderChartBlob, size: [250, 400] },
    { text: "Review sentiment by month:", imageBlob: imageBlobs.sentimentByMonthChartBlob, size: [250, 600] },
    { text: "Reviews by Category:", imageBlob: imageBlobs.reviewsByCategoryBlob, size: [250, 400] },
    { text: "Top Words:", imageBlob: imageBlobs.topWordsBlob, size: [250, 400] }
  ]

  const bullets = [
    {content: "Total de positivo:", key: 'positive'},
    {content: "Total de neutro:", key: 'neutral'},
    {content: "Total de negativo:", key: 'negative'},
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

      if (subtitles[index].feeling) {
        contents.push(breakLine())
        contents.push(...getBullets(subtitles[index].feeling))
        contents.push(breakLine())
      }
      
      if (subtitles[index].imageBlob) {
        contents.push(breakLine())
        contents.push(getImageFromBlob(subtitles[index].imageBlob, subtitles[index].size))
        contents.push(breakLine())
      }
    }

    return contents;
  }

  const getBullets = (myFeeling) => {
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
            text: ` ${numberWithCommas(myFeeling[bulletText.key])} mil`,
            font: "Aptos",
            size: 24
          })
        ],
        bullet: { level: 0 }
      })
    }
    )
  }

  const getImageFromBlob = (myBlobData, size) => {
    return new Paragraph({
      children: [
        new ImageRun({
          type: "jpg",
          data: myBlobData,
          transformation: {
            height: size[0],
            width: size[1]
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
            text: "Relatório Dashboard HexAnalytics",
            heading: HeadingLevel.HEADING_1,
          }),
          ...getSubtitles(),
        ],
      },
    ],
  });
};
