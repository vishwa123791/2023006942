import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import axios from "axios";
import NotificationCard from "../components/NotificationCard";
import logger from "../browserLogger";

const API = "http://4.224.186.213/evaluation-service/notifications";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2a3VuY2h1ckBnaXRhbS5pbiIsImV4cCI6MTc4MDgxMzk0NCwiaWF0IjoxNzgwODEzMDQ0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOWZlMGVkMzQtMzg3Ny00MWYwLWI2OWUtNDU3MmUxM2QxYjU5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidmlzaHdhbmF0aCBrIiwic3ViIjoiOWVkYzk3NDQtODU3My00ZTFmLThjNDAtMzVhZjQ4NjhiYjQ3In0sImVtYWlsIjoidmt1bmNodXJAZ2l0YW0uaW4iLCJuYW1lIjoidmlzaHdhbmF0aCBrIiwicm9sbE5vIjoiMjAyMzAwNjk0MiIsImFjY2Vzc0NvZGUiOiJ3Z0t0Z1oiLCJjbGllbnRJRCI6IjllZGM5NzQ0LTg1NzMtNGUxZi04YzQwLTM1YWY0ODY4YmI0NyIsImNsaWVudFNlY3JldCI6Ik1NR3lDcFhZYndmQWpjYkgifQ.chJWjHabeLJ-v3A1I4lb7My7lkh6N8ZBrRdppWDmmPM";

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewedIds, setViewedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("viewedIds")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    logger.info("AllNotifications page mounted");

    axios
      .get(API, {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      })
      .then((res) => {
        const data = res.data.notifications;
        setNotifications(data);
        setLoading(false);
        logger.info("Notifications fetched", { count: data.length });

        setTimeout(() => {
          const ids = data.map((n) => n.ID);
          const updated = [...new Set([...viewedIds, ...ids])];
          setViewedIds(updated);
          localStorage.setItem("viewedIds", JSON.stringify(updated));
          logger.info("Marked notifications as viewed", { count: ids.length });
        }, 4000);
      })
      .catch((err) => {
        logger.error("Fetch failed", { error: err.message });
        setError("Somthing went wrong while fetching notifications.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        All Notifications ({notifications.length})
      </Typography>
      {notifications.length === 0 && (
        <Typography color="text.secondary">No notifications found.</Typography>
      )}
      {notifications.map((n) => (
        <NotificationCard
          key={n.ID}
          notification={n}
          isViewed={viewedIds.includes(n.ID)}
        />
      ))}
    </Container>
  );
}