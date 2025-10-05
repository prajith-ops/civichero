import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import PublicIcon from "@mui/icons-material/Public";
import ForestIcon from "@mui/icons-material/Forest";

import Navbar from "./Navbar";   
import Footer from "./Footer";   

const AboutCivicHero = () => {
  return (
    <>
      <Navbar />

      <Box sx={{ p: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        {/* Page Header */}
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          CivicHero
        </Typography>
        <Typography
          variant="subtitle1"
          textAlign="center"
          color="text.secondary"
          mb={4}
        >
          Empowering citizens to build stronger communities and sustainable cities.
        </Typography>

        {/* Mission */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            textAlign: "center",
            bgcolor: "#e8f5e9",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="body1" color="text.secondary">
            CivicHero aims to make every citizen an active contributor to their community by reporting civic issues, participating in initiatives, and promoting safer, greener, and smarter neighborhoods.
          </Typography>
        </Paper>

        {/* Values */}
        <Typography variant="h5" gutterBottom>
          Our Values
        </Typography>
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">Objectives</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              - Encourage active citizenship<br />
              - Foster transparency and accountability with local authorities<br />
              - Accelerate resolution of civic issues
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">Goals</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              - Resolve 10,000 civic issues in the next year<br />
              - Plant 50,000+ trees<br />
              - Mobilize over 1 million volunteers globally
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ mb: 4 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">Approach</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              By combining technology such as mobile reporting and dashboards with community-driven initiatives, CivicHero creates sustainable civic impact.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Impact */}
        <Typography variant="h5" gutterBottom>
          Our Impact
        </Typography>
        <Grid container spacing={3} mb={4}>
          {[
            { label: "Issues Resolved", value: "1,200+", icon: <PeopleIcon fontSize="large" /> },
            { label: "Active Volunteers", value: "5,000+", icon: <PublicIcon fontSize="large" /> },
            { label: "Trees Planted", value: "12,500+", icon: <ForestIcon fontSize="large" /> },
          ].map((stat, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                {stat.icon}
                <Typography variant="h6" fontWeight="bold" mt={1}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Future Vision */}
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            bgcolor: "#e3f2fd",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Looking Ahead
          </Typography>
          <Typography variant="body1" color="text.secondary">
            CivicHero envisions empowered communities resolving civic problems collaboratively. Our goal is to build sustainable, inclusive, and resilient cities for generations to come.
          </Typography>
          <Box mt={2}>
            <Chip label="Sustainability" sx={{ bgcolor: "green", color: "white", mr: 1 }} />
            <Chip label="Community First" sx={{ bgcolor: "blue", color: "white", mr: 1 }} />
            <Chip label="Transparency" sx={{ bgcolor: "orange", color: "white" }} />
          </Box>
        </Paper>
      </Box>

      <Footer />
    </>
  );
};

export default AboutCivicHero;
