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

const violationTypes = [
  { value: "dumping", label: "Illegal Dumping" },
  { value: "vandalism", label: "Vandalism / Graffiti" },
  { value: "noise", label: "Noise Complaint" },
  { value: "safety", label: "Public Safety Hazard" },
  { value: "other", label: "Other" },
];

const statusColors = {
  Pending: "warning",
  "In Progress": "info",
  Resolved: "success",
};

const ReportViolations = () => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    location: "",
  });
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [file, setFile] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
  });

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4900/api/violations", {
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
          setFormData((prev) => ({
            ...prev,
            location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
          }));
        },
        () =>
          alert("Unable to fetch your location. Please allow location access.")
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.description || !lat || !lng) {
      alert("Please fill all required fields and pick a location.");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("type", formData.type);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("lat", lat);
      formDataToSend.append("lng", lng);
      if (file) formDataToSend.append("evidence", file);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:4900/api/violations/report",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("🚨 Violation reported successfully!");

      // Reset form
      setFormData({ type: "", description: "", location: "" });
      setLat(null);
      setLng(null);
      setFile(null);

      fetchReports();
    } catch (err) {
      console.error("Error submitting violation:", err);
      alert("❌ Failed to submit violation");
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
        {/* Left - Report Form */}
        <Box sx={{ flex: 2 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: "100%" }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              🚨 Report a Violation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Help keep our community safe by reporting violations.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                select
                label="Violation Type *"
                fullWidth
                required
                margin="normal"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                {violationTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Description *"
                fullWidth
                required
                multiline
                rows={4}
                margin="normal"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <TextField
                  label="Location *"
                  fullWidth
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
                <Button
                  variant="outlined"
                  sx={{ whiteSpace: "nowrap" }}
                  onClick={handleCurrentLocation}
                >
                  📍 Current Location
                </Button>
              </Box>

              {/* File Upload */}
              <div
                {...getRootProps()}
                style={{
                  border: "2px dashed #1976d2",
                  borderRadius: "10px",
                  padding: "25px",
                  marginTop: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "#fefefe",
                }}
              >
                <input {...getInputProps()} />
                <Typography variant="body2" color="text.secondary">
                  📎 Drag & drop evidence (images/videos) here, or click to select
                </Typography>
                {file && (
                  <Typography variant="body2" sx={{ mt: 1, color: "green" }}>
                    📂 Selected File: {file.name}
                  </Typography>
                )}
              </div>

              <Button
                type="submit"
                variant="contained"
                color="error"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Violation"}
              </Button>
            </form>
          </Paper>
        </Box>

        {/* Right - Recent Reports */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: "100%" }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              📋 Recent Reports
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              See the latest community violations submitted.
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
                      {report.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {report.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reporter: {report.reportedBy?.name || "Anonymous"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </Typography>
                    <Chip
                      label={report.status}
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
              ✅ Reports are reviewed by community moderators.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportViolations;
