import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
} from "@mui/material";

const reports = [
  {
    title: "Pothole on Main Street",
    location: "Main St & 5th Ave",
    author: "Sarah M.",
    severity: "High",
    img: "https://t3.ftcdn.net/jpg/02/01/41/92/360_F_201419293_4CQG3pEVyRltQzy7ImZMJvWntCsMS4TM.jpg",
  },
  {
    title: "Broken Street Light",
    location: "Park Avenue",
    author: "Mike T.",
    severity: "Medium",
    img: "https://media.istockphoto.com/id/496026170/photo/broken-street-lamp.jpg?s=612x612&w=0&k=20&c=1bX4binyYkD8P_ZzHbfRTspKowTIGoTkSjxvbcjAkY4=",
  },
  {
    title: "Garbage Overflow",
    location: "Central Market",
    author: "Anna K.",
    severity: "Low",
    img: "https://media.istockphoto.com/id/1175874693/photo/huge-garbage-piles-next-to-the-dumpster-after-city-fair-stacks-of-litter-bags-overflow-trash.jpg?s=612x612&w=0&k=20&c=91x9gxN_tT2gdSH0OQMO1q19KTFdhj56B62-dLY8tso=",
  },
];

const severityColors = {
  High: "error",
  Medium: "warning",
  Low: "success",
};

const CommunityReports = () => {
  return (
    <Box
      sx={{
        py: 10,
        px: 4,
        background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)", // 🌿 green gradient
      }}
    >
      {/* Section Header */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        color="green"
      >
        Common Community Reports
      </Typography>
      <Typography
        variant="subtitle1"
        textAlign="center"
        sx={{ mb: 6, color: "text.secondary" }}
      >
        Our community efforts to improve the city
      </Typography>

      {/* Report Cards */}
      <Grid container spacing={4} justifyContent="center">
        {reports.map((report, idx) => (
          <Grid item xs={12} md={4} key={idx}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                overflow: "hidden",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-8px)", boxShadow: 8 },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={report.img}
                alt={report.title}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {report.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1, fontStyle: "italic", color: "gray" }}
                >
                  Reported by {report.author}
                </Typography>

                {/* Chips */}
                <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={`Severity: ${report.severity}`}
                    color={severityColors[report.severity]}
                    variant="outlined"
                    sx={{ fontWeight: "bold" }}
                  />
                  <Chip
                    label={`Location: ${report.location}`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CommunityReports;
