import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const urgencyLevels = [
  { value: "Low", label: "Low - Can be resolved later" },
  { value: "Medium", label: "Medium - Should be addressed soon" },
  { value: "High", label: "High - Needs immediate attention" },
];

const statusColors = {
  Pending: "warning",
  "In Progress": "info",
  Resolved: "success",
  Reported: "warning",
};

const ReportIssue = () => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [urgency, setUrgency] = useState("Medium");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentReports, setRecentReports] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 10485760,
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
  });

  // Fetch recent reports
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4900/api/issues", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLat(latitude);
          setLng(longitude);
          setLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        },
        () => alert("Unable to fetch your location. Please allow location access.")
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!description || !lat || !lng) {
      alert("Please fill all required fields and pick a location.");
      return;
    }

    setLoading(true);
    try {
      const formDataObj = new FormData();
      const generatedTitle =
        description.split(" ").slice(0, 5).join(" ") + "...";

      formDataObj.append("title", generatedTitle);
      formDataObj.append("description", description);
      formDataObj.append("location", location);
      formDataObj.append("lat", lat);
      formDataObj.append("lng", lng);
      formDataObj.append("urgency", urgency);
      if (file) formDataObj.append("file", file);

      const token = localStorage.getItem("token");
      await axios.post("http://localhost:4900/api/issues", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Issue reported successfully!");

      // Reset form
      setDescription("");
      setLocation("");
      setLat(null);
      setLng(null);
      setUrgency("Medium");
      setFile(null);

      // Refresh recent reports
      fetchReports();
    } catch (err) {
      console.error(err);
      setError("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9f9f9" }}>
      <Navbar />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 3,
          p: 3,
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {/* Left Column: Report Form */}
        <Box sx={{ flex: 2 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Report an Issue
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Description *"
                placeholder="Provide detailed information about the issue"
                multiline
                rows={4}
                fullWidth
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  label="Location *"
                  placeholder="Enter address or coordinates"
                  fullWidth
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Button
                  variant="outlined"
                  sx={{ whiteSpace: "nowrap" }}
                  onClick={handleCurrentLocation}
                >
                  📍 Current Location
                </Button>
              </Box>

              <TextField
                select
                label="Urgency Level"
                fullWidth
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                sx={{ mb: 2 }}
              >
                {urgencyLevels.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* File Upload */}
              <div
                {...getRootProps()}
                style={{
                  border: "2px dashed #aaa",
                  borderRadius: "10px",
                  textAlign: "center",
                  padding: "20px",
                  marginBottom: "20px",
                  cursor: "pointer",
                  background: isDragActive ? "#f0f8ff" : "transparent",
                }}
              >
                <input {...getInputProps()} />
                {file ? (
                  <Typography>{file.name}</Typography>
                ) : (
                  <Typography color="text.secondary">
                    ⬆️ Drag and drop an image here, or browse to choose a file
                  </Typography>
                )}
              </div>

              {error && (
                <Typography color="error" sx={{ mb: 1 }}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ bgcolor: "#1976d2" }}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </Paper>
        </Box>

        {/* Right Column: Recent Reports */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              📋 Recent Reports
            </Typography>

            {recentReports.length > 0 ? (
              recentReports.map((report) => (
                <Card
                  key={report._id}
                  elevation={1}
                  sx={{ borderRadius: 2, mb: 2 }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {report.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {report.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reporter: {report.reporter?.name || "Anonymous"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </Typography>
                    <Chip
                      label={report.status || "Pending"}
                      color={statusColors[report.status] || "warning"}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No reports found.</Typography>
            )}

            <Divider sx={{ my: 2 }} />
            <Typography
              variant="body2"
              sx={{ textAlign: "center", color: "text.secondary" }}
            >
              ✅ Reports are reviewed by moderators.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportIssue;
