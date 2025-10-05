import React from "react";
import { Box, Typography, Container, Grid, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #0a4917, #093f1b)",
        color: "white",
        py: 6,
        mt: 0, // remove extra margin
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {/* Column 1 */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              CivicHero
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Empowering communities through collaboration, reporting issues, and making cities smarter.
            </Typography>
          </Grid>

          {/* Column 2 */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
              <Link href="/" color="inherit" underline="hover">
                Home
              </Link>
              <Link href="/report-issue" color="inherit" underline="hover">
                Report Issue
              </Link>
              <Link href="/volunteer-drives" color="inherit" underline="hover">
                Volunteer Drives
              </Link>
              <Link href="/rewards" color="inherit" underline="hover">
                Rewards
              </Link>
            </Box>
          </Grid>

          {/* Column 3 */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              📍 City Hall, Main Street
            </Typography>
            <Typography variant="body2">📧 support@civichero.org</Typography>
            <Typography variant="body2">📞 +91 98765 43210</Typography>
          </Grid>
        </Grid>

        {/* Bottom Note */}
        <Box textAlign="center" mt={5} pt={3} borderTop="1px solid rgba(255,255,255,0.2)">
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} CivicHero. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
