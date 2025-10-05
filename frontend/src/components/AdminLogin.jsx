import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import { Button } from "@mui/material";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "8px",
};

const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // fallback

const AdminMap = ({ issues: propIssues = [], violations: propViolations = [] }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCKQ2YXLxl8_qYc62LmhgAsUXztisvXPaY",
  });

  const [issues, setIssues] = useState(propIssues);
  const [violations, setViolations] = useState(propViolations);
  const [selected, setSelected] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const mapRef = useRef(null);

  // Fetch issues/violations
  useEffect(() => {
    if (propIssues.length === 0 && propViolations.length === 0) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const [issuesRes, violationsRes] = await Promise.all([
            axios.get("http://localhost:4900/api/issues", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:4900/api/violations", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          const formattedIssues = issuesRes.data
            .filter(i => i.lat && i.lng)
            .map(i => ({
              ...i,
              lat: Number(i.lat),
              lng: Number(i.lng),
              type: "issue",
            }));

          const formattedViolations = violationsRes.data
            .filter(v => v.lat && v.lng)
            .map(v => ({
              ...v,
              lat: Number(v.lat),
              lng: Number(v.lng),
              type: "violation",
            }));

          setIssues(formattedIssues);
          setViolations(formattedViolations);
        } catch (err) {
          console.error("Error fetching data:", err.response?.data || err.message);
        }
      };

      fetchData();
    }
  }, [propIssues, propViolations]);

  // Get admin's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        () => console.warn("Could not get current location.")
      );
    }
  }, []);

  if (!isLoaded) return <p>Loading map...</p>;

  const allMarkers = [...issues, ...violations];

  // Auto-fit bounds
  const onLoad = map => {
    mapRef.current = map;

    const bounds = new window.google.maps.LatLngBounds();

    // First, include current location if available
    if (currentLocation) bounds.extend(currentLocation);

    // Then include all markers
    allMarkers.forEach(marker => {
      if (marker.lat && marker.lng) bounds.extend({ lat: marker.lat, lng: marker.lng });
    });

    if (!bounds.isEmpty()) map.fitBounds(bounds);
    else map.setCenter(defaultCenter);
  };

  // Recenter map to current location button
  const recenterMap = () => {
    if (mapRef.current && currentLocation) {
      mapRef.current.panTo(currentLocation);
      mapRef.current.setZoom(14);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={recenterMap}
        style={{ position: "absolute", zIndex: 10, top: 10, right: 10 }}
      >
        📍 My Location
      </Button>

      <GoogleMap mapContainerStyle={containerStyle} onLoad={onLoad}>
        {allMarkers.map(item => (
          <Marker
            key={item._id}
            position={{ lat: item.lat, lng: item.lng }}
            onClick={() => setSelected(item)}
          />
        ))}

        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        )}

        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h4>{selected.title}</h4>
              <p>{selected.description}</p>
              {selected.status && <p>Status: {selected.status}</p>}
              {selected.urgency && <p>Urgency: {selected.urgency}</p>}
              <p>Type: {selected.type}</p>
              {selected.file && (
                <img
                  src={`http://localhost:4900/uploads/${selected.file}`}
                  alt="report"
                  style={{ width: "100px", borderRadius: "5px" }}
                />
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default AdminMap;
