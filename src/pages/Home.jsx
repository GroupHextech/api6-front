import * as React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box"
import BaseLayout from "../layouts/BaseLayout";
import TypingEffect from "../components/TypingFunc/Typing";
import earthVideo from '../../public/assets/earth.mp4';

export default function Home() {
  const texts = [
    " Welcome to HexAnalytics.",
    "Your platform for data analysis.",

  ];
  return (
    <BaseLayout titulo="Home">
      <Box style={{flex: 1, display:"flex", flexDirection:"column", gap:10, position: "relative"}}>
        <Paper
          sx={{
            marginTop:0,
            justifyContent:"center",
            alignContent:"center",
            width:"100%",
            borderRadius:5,
            display: "flex",
            flex: 1,
            flexDirection: "column",
            marginLeft: 3,
            position: "absolute",
            top: "50%",
            backgroundColor:"transparent",
            borderWidth:0,
            boxShadow:"none",


          }}
        >
          <TypingEffect texts={texts}/>
        </Paper>
        <video
          style={{
            borderRadius:20,
            width: "100%",
            height: "auto",
          }}
          autoPlay
          loop
          muted
        >
          <source src={earthVideo} type="video/mp4" />
          Seu navegador não suporta o elemento de vídeo.
        </video>
      </Box>
    </BaseLayout>
  );
}
