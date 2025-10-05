import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  const handleScrollToFooter = () => {
    const footer = document.getElementById("contact-section");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "green",
        px: 2,
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      <Toolbar>
        {/* Brand Logo / Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #FFD700, #FF8C00)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            cursor: "pointer",
            mr: 4,
            letterSpacing: 1,
            "&:hover": {
              background: "linear-gradient(45deg, #00ffcc, #00bfff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            },
          }}
          component={Link}
          to="/"
          style={{ textDecoration: "none" }}
        >
          CivicHero
        </Typography>

        {/* Left-side links */}
        <Box sx={{ display: "flex", gap: 2, flexGrow: 1 }}>
          <Button
            component={Link}
            to="/"
            sx={{
              color: "white",
              fontWeight: "bold",
              "&:hover": { color: "#FFD700" },
            }}
          >
            Home
          </Button>
          <Button
            onClick={handleScrollToFooter}
            sx={{
              color: "white",
              fontWeight: "bold",
              "&:hover": { color: "#00ffcc" },
            }}
          >
            Contact
          </Button>
        </Box>

        {/* Right-side auth links */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={Link}
            to="/login"
            sx={{
              color: "white",
              fontWeight: "bold",
              "&:hover": { color: "#ff6347" },
            }}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/signup"
            sx={{
              color: "white",
              border: "2px solid white",
              borderRadius: "25px",
              px: 2,
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "white",
                color: "green",
                borderColor: "green",
              },
            }}
          >
            New Hero
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
