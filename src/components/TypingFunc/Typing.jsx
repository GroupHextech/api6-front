import React, { useState, useEffect } from "react";

const TypingEffect = ({ texts }) => {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (typingIndex < texts[textIndex].length) {
        setDisplayText((prevText) => prevText + texts[textIndex].charAt(typingIndex));
        setTypingIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setDisplayText(""); // Limpa o texto exibido
          setTypingIndex(0); // Reinicia o índice de digitação
          setTextIndex((prevIndex) => (prevIndex + 1) % texts.length); // Avança para o próximo texto
        }, 1000); // Tempo de espera entre os textos (1 segundo neste exemplo)
      }
    }, 100); // Ajuste a velocidade de digitação conforme necessário

    return () => clearInterval(typingInterval);
  }, [texts, textIndex, typingIndex]);

  return (
    <div style={{ display: "flex", alignItems: "center",fontFamily:"monospace", fontSize:"36px", color:"#848d97", marginLeft:"25%" }}>
      <span>{displayText}</span>
      <span className="typing-bar">|</span>
    </div>
  );
};

export default TypingEffect;
