import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: 10,
        textAlign: "center",
        bgcolor: "#2e7d32", // 🌿 New shade of green
        color: "white",
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        Ready to Make a Difference?
      </Typography>

      <Typography
        variant="h6"
        sx={{ mt: 2, mb: 4, maxWidth: 700, mx: "auto" }}
      >
        Join thousands of citizens who are actively improving their communities.
        Start reporting issues, join volunteer drives, and earn rewards today!
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/signup")} // 🔗 Redirect to signup
        sx={{
          bgcolor: "white",
          color: "#2e7d32",
          fontWeight: "bold",
          "&:hover": { bgcolor: "#e8f5e9" }, // lighter green hover
        }}
      >
        JOIN CIVICHERO NOW
      </Button>
    </Box>
  );
};

export default CTASection;
