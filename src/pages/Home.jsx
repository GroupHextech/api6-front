import * as React from "react";
import BaseLayout from "../layouts/BaseLayout";

export default function Home() {


  return (

    <BaseLayout titulo="Home" style={{ flex: 1,margin:0, padding:0 }}>
      <video
        style={{
          minWidth:"198vh",
          maxWidth:"300vh",
          minHeight:"80vh",
          maxHeight:"92vh",
          objectFit: "cover",
        }}
        autoPlay
        loop
        muted
      >
        <source src="../../public/assets/earth.mp4" type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>
    </BaseLayout>
  );
}
