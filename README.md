import React from "react";
import { Card, CardContent, Typography, Box, Divider } from "@mui/material";
import QRCode from "react-qr-code";

export default function BusinessCard() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f0f0f0"
    >
      <Card
        sx={{
          width: 400,
          borderRadius: 2,
          boxShadow: 3,
          border: "1px solid #ddd",
          p: 2,
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="start">
            <Box>
              <Typography variant="h6" color="error" fontWeight="bold">
                Julienne GNIMI
              </Typography>
              <Typography variant="subtitle1" fontWeight="medium">
                Data Scientist
              </Typography>
              <Box
                height="3px"
                width="120px"
                bgcolor="error.main"
                mt={0.5}
                mb={1.5}
              />
            </Box>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Logo_Soci%C3%A9t%C3%A9_G%C3%A9n%C3%A9rale.svg"
              alt="SGCI"
              width={60}
            />
          </Box>

          <Box mt={2}>
            <Divider />
            <Box mt={2}>
              <Typography variant="body2">
                <strong>Description :</strong> Analyse des données pour
                l’aide à la décision.
              </Typography>
              <Typography variant="body2">
                <strong>Téléphone :</strong> +225 07 07 07 07 07
              </Typography>
              <Typography variant="body2">
                <strong>Service :</strong> Direction Data & Innovation
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <QRCode value="https://societegenerale.ci" size={64} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
