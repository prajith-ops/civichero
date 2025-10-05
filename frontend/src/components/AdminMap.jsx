import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "8px",
};

const defaultCenter = { lat: 28.6139, lng: 77.2090 };

const AdminMap = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCKQ2YXLxl8_qYc62LmhgAsUXztisvXPaY",
  });

  const [issues, setIssues] = useState([]);
  const [violations, setViolations] = useState([]);
  const [selected, setSelected] = useState(null);
  const mapRef = useRef(null);

  const token = localStorage.getItem("token");

  const fetchReports = async () => {
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [issuesRes, violationsRes] = await Promise.all([
        axios.get("http://localhost:4900/api/admin/issues", { headers }),
        axios.get("http://localhost:4900/api/admin/violations", { headers }),
      ]);

      setIssues(
        (issuesRes.data || [])
          .filter((i) => i.lat && i.lng)
          .map((i) => ({ ...i, lat: Number(i.lat), lng: Number(i.lng), type: "issue" }))
      );

      setViolations(
        (violationsRes.data || [])
          .filter((v) => v.lat && v.lng)
          .map((v) => ({ ...v, lat: Number(v.lat), lng: Number(v.lng), type: "violation" }))
      );
    } catch (err) {
      console.error("Error fetching map data:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchReports();

    // Optional: auto-refresh every 30s
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) return <p>Loading map...</p>;

  const allMarkers = [...issues, ...violations];

  const onLoad = (map) => {
    mapRef.current = map;
    if (allMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      allMarkers.forEach((marker) => bounds.extend({ lat: marker.lat, lng: marker.lng }));
      map.fitBounds(bounds);
    } else {
      map.setCenter(defaultCenter);
      map.setZoom(12);
    }
  };

  return (
    <GoogleMap mapContainerStyle={containerStyle} onLoad={onLoad}>
      {allMarkers.map((item) => (
        <Marker key={item._id} position={{ lat: item.lat, lng: item.lng }} onClick={() => setSelected(item)} />
      ))}

      {selected && (
        <InfoWindow position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => setSelected(null)}>
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
  );
};

export default AdminMap;
