import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Avatar,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  MenuItem,
  TextField,
  Grid,
  Divider,
  Drawer,
} from "@mui/material";
import {
  People,
  Report,
  Map,
  CheckCircle,
  Pending,
  Close,
  Block,
  LockOpen,
  ExitToApp,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminMap from "./AdminMap";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
} from "recharts";

const COLORS = ["#2e7d32", "#66bb6a", "#a5d6a7"];

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [violations, setViolations] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [reviewDrawerOpen, setReviewDrawerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || localStorage.getItem("role") !== "admin") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [issuesRes, violationsRes] = await Promise.all([
          axios.get("http://localhost:4900/api/admin/issues", { headers }),
          axios.get("http://localhost:4900/api/admin/violations", { headers }),
        ]);

        setIssues(issuesRes?.data || []);
        setViolations(violationsRes?.data || []);

        setActivity([
          { id: 1, text: "Issue #123 marked as Resolved", type: "resolve" },
          { id: 2, text: "New violation report added", type: "report" },
          { id: 3, text: "User John Doe created a report", type: "user" },
          { id: 4, text: "Admin reviewed pending reports", type: "review" },
        ]);
      } catch (err) {
        console.error("Error fetching admin data:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const combinedReports = [
    ...(issues || []).map((i) => ({ ...i, __type: "issue" })),
    ...(violations || []).map((v) => ({ ...v, __type: "violation" })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const statusCounts = ["Pending", "Resolved", "Rejected"].map((status) => ({
    name: status,
    value: combinedReports.filter((r) => r.status === status).length,
  }));

  const issueViolationData = [
    { name: "Issues", value: issues.length },
    { name: "Violations", value: violations.length },
  ];

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const count = combinedReports.filter((r) => r.createdAt?.split("T")[0] === dateStr).length;
    return { date: dateStr, reports: count };
  }).reverse();

  const updateStatus = async (id, type, newStatus) => {
    try {
      const url =
        type === "issue"
          ? `http://localhost:4900/api/admin/issues/${id}`
          : `http://localhost:4900/api/admin/violations/${id}`;
      const headers = { Authorization: `Bearer ${token}` };

      // Update status in backend
      await axios.put(url, { status: newStatus }, { headers });

      // Update state locally
      if (type === "issue") {
        setIssues((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item
          )
        );
      } else {
        setViolations((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item
          )
        );
      }

      // Add activity log
      setActivity((prev) => [
        { id: Date.now(), text: `${type} #${id} updated to ${newStatus}`, type: "update" },
        ...prev,
      ]);

      // Send email if status is Resolved
      if (newStatus === "Resolved") {
        try {
          await axios.post(
            "http://localhost:4900/api/admin/send-email",
            { reportId: id, reportType: type },
            { headers }
          );
          console.log(`📧 Notification email sent for ${type} #${id}`);
        } catch (emailErr) {
          console.error("❌ Error sending notification email:", emailErr.response?.data || emailErr.message);
        }
      }
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err.message);
    }
  };

  const openUserDrawer = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get("http://localhost:4900/api/admin/users", { headers });
      setUsers(res?.data || []);
      setUserDrawerOpen(true);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
    }
  };

  const toggleUserBlock = async (id, blocked) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`http://localhost:4900/api/admin/users/${id}/block`, {}, { headers });
      setUsers((prev) => prev.map((user) => (user._id === id ? { ...user, blocked: !blocked } : user)));
      setActivity((prev) => [
        { id: Date.now(), text: `User #${id} was ${blocked ? "unblocked" : "blocked"}`, type: "user" },
        ...prev,
      ]);
    } catch (err) {
      console.error("Error blocking/unblocking user:", err.response?.data || err.message);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Box sx={{ width: 240, bgcolor: "#2e7d32", color: "#fff", p: 3, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">Admin Panel</Typography>
        <Divider sx={{ mb: 2, borderColor: "#555" }} />
        <Button fullWidth onClick={openUserDrawer} startIcon={<People />} variant="contained" sx={{ bgcolor: "#388e3c", ":hover": { bgcolor: "#2e7d32" } }}>Manage Users</Button>
        <Button fullWidth onClick={() => setReviewDrawerOpen(true)} startIcon={<Report />} variant="contained" sx={{ bgcolor: "#43a047", ":hover": { bgcolor: "#2e7d32" } }}>Review Reports</Button>
        <Button fullWidth startIcon={<Map />} variant="contained" sx={{ bgcolor: "#66bb6a", ":hover": { bgcolor: "#2e7d32" } }}>View Map</Button>
        <Button fullWidth startIcon={<ExitToApp />} variant="outlined" sx={{ color: "#fff", borderColor: "#fff", ":hover": { bgcolor: "#2e7d32" } }} onClick={() => navigate("/")}>Logout</Button>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, p: 4, bgcolor: "#f5f6fa" }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Dashboard</Typography>
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" fontWeight="bold">Status Distribution</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={statusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                        {statusCounts.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" fontWeight="bold">Issues vs Violations</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={issueViolationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                        {issueViolationData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" fontWeight="bold">Reports Trend (Last 7 Days)</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={last7Days}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="reports" fill="#388e3c" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, maxHeight: 520, overflowY: "auto" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Recent Activity</Typography>
              {activity.length ? (
                <List>{activity.map((a) => <ListItem key={a.id}><ListItemAvatar><Avatar sx={{ bgcolor: "#388e3c" }}>{a.type === "resolve" ? <CheckCircle /> : <Pending />}</Avatar></ListItemAvatar><ListItemText primary={a.text} /></ListItem>)}</List>
              ) : (<Typography>No recent activity</Typography>)}
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>🗺️ Reported Issues Map</Typography>
          <AdminMap />
        </Box>
      </Box>

      {/* Manage Users Drawer */}
      <Drawer anchor="right" open={userDrawerOpen} onClose={() => setUserDrawerOpen(false)}>
        <Box sx={{ width: 400, p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Manage Users</Typography>
            <IconButton onClick={() => setUserDrawerOpen(false)}><Close /></IconButton>
          </Box>
          {users.length ? users.map((user) => (
            <Paper key={user._id} sx={{ p: 2, mb: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar>{user.name?.charAt(0)}</Avatar>
                  <Box>
                    <Typography>{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip label={user.blocked ? "Blocked" : "Active"} color={user.blocked ? "error" : "success"} />
                  <Button variant="outlined" color={user.blocked ? "success" : "error"} startIcon={user.blocked ? <LockOpen /> : <Block />} onClick={() => toggleUserBlock(user._id, user.blocked)}>
                    {user.blocked ? "Unblock" : "Block"}
                  </Button>
                </Box>
              </Box>
            </Paper>
          )) : <Typography>No users found.</Typography>}
        </Box>
      </Drawer>

      {/* Review Reports Drawer */}
      <Drawer anchor="right" open={reviewDrawerOpen} onClose={() => setReviewDrawerOpen(false)}>
        <Box sx={{ width: 500, p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Review Reports</Typography>
            <IconButton onClick={() => setReviewDrawerOpen(false)}><Close /></IconButton>
          </Box>
          <TextField select label="Filter by Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} fullWidth sx={{ mb: 2 }}>
            {["All", "Pending", "Resolved", "Rejected"].map((s) => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
          </TextField>
          <Box sx={{ maxHeight: 600, overflowY: "auto" }}>
            {combinedReports.filter((r) => filterStatus === "All" || r.status === filterStatus).map((report) => (
              <Paper key={report._id} sx={{ p: 2, mb: 2 }}>
                <Typography fontWeight="bold">{report.title || report.__type || "Report"}</Typography>
                <Typography>Status: {report.status || "Pending"}</Typography>
                <Typography>Type: {report.__type}</Typography>
                <Typography>Location: {report.location || "N/A"}</Typography>
                {report.file && (report.file.endsWith(".mp4") ? (
                  <video src={`http://localhost:4900/uploads/${report.file}`} width="200" controls style={{ borderRadius: 5 }} />
                ) : (
                  <img src={`http://localhost:4900/uploads/${report.file}`} alt="Evidence" style={{ width: "200px", borderRadius: 5 }} />
                ))}
                <Box mt={1} display="flex" gap={1}>
                  <Button color="success" variant="contained" onClick={() => window.confirm("Mark as Resolved?") && updateStatus(report._id, report.__type, "Resolved")}><CheckCircle /> Resolve</Button>
                  <Button color="warning" variant="outlined" onClick={() => window.confirm("Mark as Pending?") && updateStatus(report._id, report.__type, "Pending")}><Pending /> Pending</Button>
                  <Button color="error" variant="outlined" onClick={() => window.confirm("Mark as Rejected?") && updateStatus(report._id, report.__type, "Rejected")}><Block /> Reject</Button>
                </Box>
              </Paper>
            ))}
            {combinedReports.length === 0 && <Typography>No reports to review.</Typography>}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AdminDashboard;
