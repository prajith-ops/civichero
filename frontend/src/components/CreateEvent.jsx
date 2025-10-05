import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const tags = [
  { value: "cleanup", label: "Cleanup" },
  { value: "environment", label: "Environment" },
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    points: "",
    tag: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.date || !form.points) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      alert("⚠️ Please login to create an event.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4900/api/drives/create",
        { ...form },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`✅ Event Created: ${response.data.drive.title}`);
      navigate("/community-drives"); // redirect to drives page
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="green"
            gutterBottom
            align="center"
          >
            🌱 Create a New Event
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            gutterBottom
            align="center"
          >
            Fill in the details below to add a new community drive
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Title *"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description *"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date *"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Reward Points *"
                  name="points"
                  value={form.points}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Category Tag"
                  name="tag"
                  value={form.tag}
                  onChange={handleChange}
                >
                  {tags.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/event.jpg"
                />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => navigate("/community-drives")}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ bgcolor: "green", "&:hover": { bgcolor: "darkgreen" } }}
              >
                {loading ? "Creating..." : "Create Event"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default CreateEvent;
