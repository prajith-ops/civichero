import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4900/api/auth/login",
        { email, password }
      );

      const { token, user } = response.data;

      // Save token, role, and user info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to intended page
      const from = location.state?.from?.pathname || 
        (user.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
      navigate(from, { replace: true });

    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        background: "linear-gradient(to right, #e8f5e9, #f1f8e9)",
      }}
    >
      <Paper sx={{ p: 4, width: 400, textAlign: "center", borderRadius: 3 }}>
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: "bold", color: "green" }}
        >
          Sign In
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              bgcolor: "green",
              mt: 2,
              "&:hover": { bgcolor: "darkgreen" },
            }}
          >
            {loading ? "Logging in..." : "SIGN IN"}
          </Button>
        </form>

        {/* Back to Home Button */}
        <Button
          component={Link}
          to="/"
          variant="outlined"
          fullWidth
          sx={{
            mt: 3,
            borderColor: "green",
            color: "green",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "green",
              color: "white",
              borderColor: "green",
            },
          }}
        >
          BACK TO HOME
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
