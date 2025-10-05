import React from "react";
import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Your Dashboard
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/report")}
        sx={{ mr: 2 }}
      >
        Report an Issue
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </Container>
  );
};

export default Dashboard;
