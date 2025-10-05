import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Box,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ShieldIcon from "@mui/icons-material/Shield";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Report Issues",
      desc: "Quickly report civic problems with photos and location data",
      icon: <CameraAltIcon sx={{ fontSize: 50, color: "green" }} />,
      path: "/report-issue",
    },
    {
      title: "Community Drives",
      desc: "Join or organize local volunteer events and clean-up drives",
      icon: <GroupsIcon sx={{ fontSize: 50, color: "green" }} />,
      path: "/community-drives",
    },
    {
      title: "Earn Rewards",
      desc: "Get points, badges, and rewards for active community participation",
      icon: <EmojiEventsIcon sx={{ fontSize: 50, color: "green" }} />,
      path: "/rewards",
    },
    {
      title: "Report Violations",
      desc: "Help maintain civic order by reporting rule violations",
      icon: <ShieldIcon sx={{ fontSize: 50, color: "green" }} />,
      path: "/report-violations",
    },
  ];

  return (
    <Box sx={{ position: "relative", py: 10, px: 2, textAlign: "center" }}>
      {/* Animated Background Shapes */}
      <Box
        sx={{
          position: "absolute",
          top: "-50px",
          left: "-50px",
          width: 200,
          height: 200,
          background: "rgba(25, 118, 210, 0.1)",
          borderRadius: "50%",
          animation: "float 6s ease-in-out infinite",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-60px",
          right: "-60px",
          width: 250,
          height: 250,
          background: "rgba(76, 175, 80, 0.1)",
          borderRadius: "50%",
          animation: "floatReverse 8s ease-in-out infinite",
          zIndex: 0,
        }}
      />

      {/* Section Title */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2", position: "relative", zIndex: 1 }}
      >
        How CivicHero Works
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ color: "#555", mb: 6, position: "relative", zIndex: 1 }}
      >
        Simple tools for complex problems.
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ position: "relative", zIndex: 1 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                transition: "0.3s",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                "&:hover": {
                  transform: "translateY(-10px)",
                  boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardActionArea
                onClick={() => navigate(feature.path)}
                sx={{ height: "100%" }}
              >
                <CardContent
                  sx={{
                    textAlign: "center",
                    py: 6,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {feature.icon}
                  <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ maxWidth: 200 }}
                  >
                    {feature.desc}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Floating animation keyframes */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0); }
          }
          @keyframes floatReverse {
            0% { transform: translateY(0); }
            50% { transform: translateY(20px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
};

export default HowItWorks;
