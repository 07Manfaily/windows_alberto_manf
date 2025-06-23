import React, { useState } from "react";
import { Button, Typography } from "@mui/material";

function FileUpload() {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <input
        accept="*"
        type="file"
        id="file-upload"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button variant="contained" component="span">
          Choisir un fichier
        </Button>
      </label>
      {fileName && (
        <Typography variant="body2" style={{ marginTop: 8 }}>
          Fichier sélectionné : {fileName}
        </Typography>
      )}
    </div>
  );
}

export default FileUpload;
