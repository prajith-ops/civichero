import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Card,
  LinearProgress,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const COLORS = ["#ef9a9a", "#fff59d", "#a5d6a7"];
const badges = [
  { title: "Eco Warrior", icon: "🌱" },
  { title: "Fast Reporter", icon: "⚡" },
  { title: "Top Volunteer", icon: "🤝" },
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [userReports, setUserReports] = useState([]);
  const [points, setPoints] = useState(0);
  const [activity, setActivity] = useState([]);
  const [communityDrives, setCommunityDrives] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.name) setUserName(storedUser.name);

        // Fetch Issues
        const resIssues = await axios.get("http://localhost:4900/api/issues/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const issues = resIssues.data.issues || [];

        // Fetch Violations
        const resViolations = await axios.get(
          "http://localhost:4900/api/violations/user",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const violations = resViolations.data.violations || [];

        // Combine all reports
        const allReports = [...issues, ...violations].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUserReports(allReports);

        // Calculate points (10 per resolved issue, 5 per resolved violation)
        const totalPoints =
          issues.filter((i) => i.status === "Resolved").length * 10 +
          violations.filter((v) => v.status === "Resolved").length * 5;
        setPoints(totalPoints);

        // Recent Activity (latest 5)
        const recentActivity = allReports.slice(0, 5).map((r) => ({
          id: r._id,
          text: `${r.title || r.type} - ${r.status || "Reported"}`,
        }));
        setActivity(recentActivity);

        // Fetch upcoming community drives
        const resDrives = await axios.get("http://localhost:4900/api/communitydrives/");
        setCommunityDrives(resDrives.data.events || []);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress sx={{ color: "#2e7d32" }} />
      </Box>
    );

  // Status overview for Pie chart
  const statusCounts = ["Pending", "In Progress", "Resolved"].map((status) => ({
    name: status,
    value: userReports.filter((i) => i.status === status).length,
  }));

  // Reports in last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const count = userReports.filter((r) => r.createdAt?.split("T")[0] === dateStr)
      .length;
    return { date: dateStr, reports: count };
  }).reverse();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#e8f5e9" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          bgcolor: "#2e7d32",
          color: "#fff",
          p: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3}>
          CivicHero 🌍
        </Typography>
        <Stack spacing={1.5}>
          <Button
            sx={{
              color: "#fff",
              bgcolor: "#388e3c",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { bgcolor: "#2e7d32" },
            }}
            onClick={() => navigate("/report-issue")}
          >
            📝 Report Issue
          </Button>
          <Button
            sx={{
              color: "#fff",
              bgcolor: "#388e3c",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { bgcolor: "#2e7d32" },
            }}
            onClick={() => navigate("/report-violations")}
          >
            🚫 Report Violation
          </Button>
          <Button
            sx={{
              color: "#fff",
              bgcolor: "#388e3c",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { bgcolor: "#2e7d32" },
            }}
            onClick={() => navigate("/rewards")}
          >
            🎁 Rewards
          </Button>
          <Button
            sx={{
              color: "#fff",
              bgcolor: "#388e3c",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { bgcolor: "#2e7d32" },
            }}
            onClick={() => navigate("/community-drives")}
          >
            🌱 Community Drives
          </Button>
          {/* Logout below community drives */}
          <Button
            sx={{
              color: "#fff",
              bgcolor: "#d32f2f",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { bgcolor: "#b71c1c" },
            }}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="#1b5e20" gutterBottom>
          Welcome back, {userName}! 👋
        </Typography>

        {/* Points & Badges */}
        <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
          <Paper sx={{ flex: 1, p: 4, borderRadius: 3, bgcolor: "#a5d6a7" }}>
            <Typography variant="h5" fontWeight="bold" color="#1b5e20">
              🎯 Points
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(points / 200) * 100}
              sx={{
                mt: 2,
                height: 10,
                borderRadius: 5,
                "& .MuiLinearProgress-bar": { bgcolor: "#2e7d32" },
              }}
            />
            <Typography mt={2}>{points} / 200 points</Typography>
          </Paper>

          <Paper
            sx={{
              flex: 2,
              p: 4,
              borderRadius: 3,
              bgcolor: "#e8f5e9",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            {badges.map((b, idx) => (
              <Box
                key={idx}
                sx={{ textAlign: "center", bgcolor: "#c8e6c9", p: 2, borderRadius: 3 }}
              >
                <Typography fontSize={40}>{b.icon}</Typography>
                <Typography fontWeight="bold">{b.title}</Typography>
              </Box>
            ))}
          </Paper>
        </Box>

        {/* Charts */}
        <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
          <Paper sx={{ flex: 1, p: 3, borderRadius: 3, height: 350 }}>
            <Typography variant="h5" color="#1b5e20" mb={2}>
              Status Overview
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={statusCounts}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {statusCounts.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>

          <Paper sx={{ flex: 1, p: 3, borderRadius: 3, height: 350 }}>
            <Typography variant="h5" color="#1b5e20" mb={2}>
              Reports This Week
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={last7Days}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reports" fill="#43a047" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* User Reports (Issues + Violations) */}
        <Typography variant="h5" color="#1b5e20" mb={2}>
          📝 Your Reports
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {userReports.map((report) => (
            <Card
              key={report._id}
              sx={{
                flex: "1 1 calc(33% - 20px)",
                minWidth: 300,
                p: 3,
                borderRadius: 3,
                bgcolor: "#f1f8e9",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {report.title || report.type}
              </Typography>
              <Typography color="text.secondary">📍 {report.location || "N/A"}</Typography>
              <Typography color="text.secondary">
                ⏰ {new Date(report.createdAt).toLocaleDateString()}
              </Typography>
              <Chip
                label={report.status || "Reported"}
                sx={{
                  mt: 2,
                  fontWeight: "bold",
                  bgcolor:
                    report.status === "Resolved"
                      ? "#a5d6a7"
                      : report.status === "In Progress"
                      ? "#fff59d"
                      : "#ef9a9a",
                }}
              />
            </Card>
          ))}
        </Box>

        {/* Recent Activity */}
        <Typography variant="h5" color="#1b5e20" mt={4} mb={2}>
          ⏳ Recent Activity
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#ffffffb0" }}>
          <List>
            {activity.map((a) => (
              <ListItem key={a.id}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#2e7d32" }}>📝</Avatar>
                </ListItemAvatar>
                <ListItemText primary={a.text} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Upcoming Community Drives */}
        <Typography variant="h5" color="#1b5e20" mt={4} mb={2}>
          🌱 Upcoming Community Drives
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {communityDrives.length === 0 ? (
            <Paper sx={{ p: 3, borderRadius: 3 }}>No upcoming community drives.</Paper>
          ) : (
            communityDrives.map((drive) => (
              <Card
                key={drive._id}
                sx={{
                  flex: "1 1 calc(33% - 20px)",
                  minWidth: 300,
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#f1f8e9",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {drive.title}
                </Typography>
                <Typography color="text.secondary">
                  {new Date(drive.date).toLocaleDateString()} ⏰
                </Typography>
                <Typography color="text.secondary">{drive.description}</Typography>
                <Typography color="text.secondary" mt={1}>
                  Points: {drive.points || 10} ⭐
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: 2, textTransform: "none", borderRadius: 2 }}
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      await axios.post(
                        `http://localhost:4900/api/communitydrives/join/${drive._id}`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      alert("Joined drive successfully!");
                    } catch (err) {
                      alert(err.response?.data?.message || "Error joining drive");
                    }
                  }}
                >
                  Join Drive
                </Button>
              </Card>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserDashboard;
