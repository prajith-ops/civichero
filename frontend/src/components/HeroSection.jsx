import React from "react";
import { Box, Typography, Button, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";

const moveCircle1 = keyframes`
  0% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(20px) translateX(20px); }
  100% { transform: translateY(0px) translateX(0px); }
`;

const moveCircle2 = keyframes`
  0% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-30px) translateX(-30px); }
  100% { transform: translateY(0px) translateX(0px); }
`;

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/user-dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
        background: "linear-gradient(135deg, #eaf4ec 0%, #e6f4f9 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Circles */}
      <Box
        sx={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          bgcolor: "#d0f0c0",
          top: -50,
          left: -50,
          opacity: 0.3,
          animation: `${moveCircle1} 8s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          bgcolor: "#b3e5fc",
          bottom: -100,
          right: -100,
          opacity: 0.25,
          animation: `${moveCircle2} 12s ease-in-out infinite`,
        }}
      />

      {/* Main Text */}
      <Typography
        variant={isMobile ? "h4" : "h2"}
        fontWeight="bold"
        sx={{ zIndex: 1, color: "#2e7d32" }}
      >
        Build Better Cities <span style={{ color: "#388e3c" }}>Together</span>
      </Typography>

      <Typography
        variant={isMobile ? "body1" : "h6"}
        sx={{
          mt: 4,
          maxWidth: 700,
          mx: "auto",
          color: "#555",
          lineHeight: 1.6,
          zIndex: 1,
        }}
      >
        CivicHero empowers citizens to report civic issues, organize community
        drives, and create positive change in their neighborhoods.
      </Typography>

      {/* Buttons */}
      <Box
        sx={{
          mt: 6,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <Button
          variant="contained"
          sx={{
            bgcolor: "#388e3c",
            width: isMobile ? "100%" : "auto",
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            fontSize: 16,
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            "&:hover": { bgcolor: "#2e7d32", transform: "scale(1.05)" },
            transition: "0.3s",
          }}
          onClick={handleGetStarted}
        >
          GET STARTED TODAY
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: "#388e3c",
            borderColor: "#388e3c",
            width: isMobile ? "100%" : "auto",
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            fontSize: 16,
            "&:hover": { bgcolor: "#e8f5e9", transform: "scale(1.05)" },
            transition: "0.3s",
          }}
          onClick={() => navigate("/about")}
        >
          LEARN MORE
        </Button>
      </Box>
    </Box>
  );
};

export default HeroSection;
