import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import Navbar from "./Navbar";
import axios from "axios";

const Rewards = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};

        const [rewardsRes, leaderboardRes, userRes] = await Promise.all([
          axios.get("http://localhost:4900/api/rewards", { headers }),
          axios.get("http://localhost:4900/api/users/leaderboard", { headers }),
          user?.token ? axios.get("http://localhost:4900/api/users/me", { headers }) : null,
        ]);

        setRewards(rewardsRes.data.rewards || []);
        setLeaderboard(leaderboardRes.data.leaderboard || []);
        if (userRes) setUserPoints(userRes.data.points || 0);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const redeemReward = async (rewardId, pointsRequired) => {
    if (userPoints < pointsRequired) {
      alert("⚠️ Not enough points to redeem this reward.");
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post(
        `http://localhost:4900/api/rewards/redeem/${rewardId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("🎉 Reward redeemed successfully!");
      setUserPoints((prev) => prev - pointsRequired);
    } catch (err) {
      console.error("Redeem error:", err);
      alert(err.response?.data?.message || "Error redeeming reward.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Box
          sx={{
            minHeight: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* User Points */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            textAlign: "center",
            background: "linear-gradient(90deg, #a8e6cf, #dcedc1)",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Your Points
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {userPoints} pts
          </Typography>
        </Paper>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(e, value) => setTab(value)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="Rewards" />
          <Tab label="Leaderboard" />
        </Tabs>

        {tab === 0 && (
          <Box display="flex" flexDirection="column" gap={2}>
            {rewards.length === 0 ? (
              <Typography color="text.secondary">
                No rewards available at the moment.
              </Typography>
            ) : (
              rewards.map((reward) => (
                <Card
                  key={reward._id}
                  elevation={2}
                  sx={{
                    display: "flex",
                    borderRadius: 2,
                    alignItems: "center",
                    p: 1,
                    "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={reward.image}
                    alt={reward.title}
                    sx={{ width: 100, height: 100, objectFit: "contain", p: 1 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {reward.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {reward.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, fontWeight: "bold", color: "#1976d2" }}
                    >
                      Requires {reward.pointsRequired} pts
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mt: 1, textTransform: "none", borderRadius: "20px" }}
                      onClick={() => redeemReward(reward._id, reward.pointsRequired)}
                    >
                      Redeem
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}

        {tab === 1 && (
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Leaderboard
            </Typography>
            <List>
              {leaderboard.map((user, index) => (
                <React.Fragment key={user._id}>
                  <ListItem
                    sx={{
                      bgcolor:
                        index === 0
                          ? "#FFD70022"
                          : index === 1
                          ? "#C0C0C022"
                          : index === 2
                          ? "#CD7F3222"
                          : "transparent",
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={user.avatar} alt={user.name} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${index + 1}. ${user.name}`}
                      secondary={`${user.points} pts`}
                      primaryTypographyProps={{ fontWeight: index < 3 ? "bold" : "normal" }}
                    />
                  </ListItem>
                  {index < leaderboard.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </Container>
    </>
  );
};

export default Rewards;
