import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function BusinessCard() {
  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 600,
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* LEFT WHITE SECTION */}
      <Box
        sx={{
          backgroundColor: "#fff",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "#F44336",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <Typography variant="h5" color="#fff">
            ●
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="bold" color="#F44336">
          COMPANY NAME
        </Typography>
        <Typography variant="body2" color="text.secondary">
          YOUR TAGLINE HERE
        </Typography>
      </Box>

      {/* RIGHT BLACK SECTION */}
      <Box
        sx={{
          flex: 2,
          backgroundColor: "#1a1a1a",
          color: "#fff",
          p: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          JHION <span style={{ color: "#F44336" }}>SMITH</span>
        </Typography>
        <Typography variant="body2" mb={2}>
          Graphic Designer
        </Typography>

        <Divider sx={{ borderColor: "#444", mb: 2 }} />

        <Stack spacing={1}>
          <Box display="flex" alignItems="center">
            <PhoneIcon sx={{ color: "#F44336", mr: 1 }} />
            <Typography variant="body2">000.1234.5678 / 000.9876.5432</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <LanguageIcon sx={{ color: "#F44336", mr: 1 }} />
            <Typography variant="body2">
              jhion@yourweb.com <br />
              www.yourwebsite.com
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <LocationOnIcon sx={{ color: "#F44336", mr: 1 }} />
            <Typography variant="body2">
              123 Seventh Avenue <br />
              New York, NY 4567
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
