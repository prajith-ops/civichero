import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  Chip,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const CommunityDrive = () => {
  const [tab, setTab] = useState("upcoming");
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:4900/api/drives");
      setEvents(res.data.events);

      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      if (user && token) {
        const joinedRes = await axios.get(
          "http://localhost:4900/api/drives/joined",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setJoinedEvents(joinedRes.data.joinedDrives || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchEvents();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const getFilteredEvents = () => {
    let filtered = [];
    if (tab === "joined") filtered = joinedEvents;
    else filtered = events.filter((e) => e.type === tab);

    return filtered.sort((a, b) =>
      sortBy === "date"
        ? new Date(a.date) - new Date(b.date)
        : b.points - a.points
    );
  };

  const filteredEvents = getFilteredEvents();

  const joinEvent = async (event) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      if (!user || !token) {
        alert("Please login to join events.");
        return;
      }

      await axios.post(
        `http://localhost:4900/api/drives/join/${event._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJoinedEvents([...joinedEvents, event]);
      alert(`🎉 You joined "${event.title}"`);
    } catch (err) {
      alert(err.response?.data?.message || "Error joining event.");
    }
  };

  const leaveEvent = async (eventId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      if (!user || !token) {
        alert("Please login to leave events.");
        return;
      }

      await axios.post(
        `http://localhost:4900/api/drives/leave/${eventId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJoinedEvents(joinedEvents.filter((e) => e._id !== eventId));
      alert("❌ You left the event.");
    } catch (err) {
      alert(err.response?.data?.message || "Error leaving event.");
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          py: 10,
          px: 2,
          textAlign: "center",
          background: "linear-gradient(to right, #eaf4ec, #e6f4f9)",
          mb: 6,
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Volunteer Drives
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Join community events and make a positive impact while earning rewards.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 4, bgcolor: "green" }}
          onClick={() => navigate("/create-event")}
        >
          + Create Event
        </Button>
      </Box>

      <Container maxWidth="lg">
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            mb: 3,
            "& .MuiTab-root": { color: "green", fontWeight: "bold" },
            "& .Mui-selected": { color: "darkgreen !important" },
            "& .MuiTabs-indicator": { bgcolor: "green" },
          }}
        >
          <Tab value="upcoming" label="Upcoming Events" />
          <Tab value="past" label="Past Events" />
          <Tab value="joined" label="My Joined Events" />
        </Tabs>

        {tab !== "joined" && (
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              select
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="small"
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="points">Points</MenuItem>
            </TextField>
          </Box>
        )}

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
          {filteredEvents.length === 0 ? (
            <Typography color="text.secondary">No events found.</Typography>
          ) : (
            filteredEvents.map((event) => (
              <Card key={event._id} sx={{ width: 300, borderRadius: 3, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={event.image}
                  alt={event.title}
                  sx={{ filter: event.type === "past" ? "grayscale(100%)" : "none" }}
                />
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Chip label={event.tag} size="small" sx={{ bgcolor: "green", color: "white" }} />
                    <Typography variant="body2" color="green">
                      +{event.points} pts
                    </Typography>
                  </Box>

                  <Typography variant="h6" fontWeight="bold">{event.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {event.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📅 {new Date(event.date).toDateString()}
                  </Typography>

                  {tab === "joined" ? (
                    <Button variant="outlined" size="small" color="error" onClick={() => leaveEvent(event._id)}>
                      Leave Event
                    </Button>
                  ) : event.type === "upcoming" ? (
                    <Button variant="contained" size="small" sx={{ bgcolor: "green" }} onClick={() => joinEvent(event)}>
                      Join Event
                    </Button>
                  ) : (
                    <Chip label="Completed" size="small" />
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Container>
    </>
  );
};

export default CommunityDrive;
