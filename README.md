import React, { useRef } from "react";
import { toPng } from "html-to-image";
import { Button } from "@mui/material";

const BusinessCard = () => {
  const cardRef = useRef(null);

  const handleDownload = () => {
    if (cardRef.current === null) return;

    toPng(cardRef.current).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = "carte-de-visite.png";
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <div>
      <div ref={cardRef}>
        {/* Ta carte de visite ici */}
        <div style={{ padding: "20px", background: "#f2f2f2", borderRadius: "10px" }}>
          <h3>Jean Dupont</h3>
          <p>Développeur Front-End</p>
          <p>Email: jean@example.com</p>
        </div>
      </div>

      <Button onClick={handleDownload} variant="contained" color="primary" sx={{ mt: 2 }}>
        Télécharger la carte
      </Button>
    </div>
  );
};

export default BusinessCard;
