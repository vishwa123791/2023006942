import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import axios from "axios";
import NotificationCard from "../components/NotificationCard";
import logger from "../browserLogger";

const API = "http://4.224.186.213/evaluation-service/notifications";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2a3VuY2h1ckBnaXRhbS5pbiIsImV4cCI6MTc4MDgxMzk0NCwiaWF0IjoxNzgwODEzMDQ0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOWZlMGVkMzQtMzg3Ny00MWYwLWI2OWUtNDU3MmUxM2QxYjU5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidmlzaHdhbmF0aCBrIiwic3ViIjoiOWVkYzk3NDQtODU3My00ZTFmLThjNDAtMzVhZjQ4NjhiYjQ3In0sImVtYWlsIjoidmt1bmNodXJAZ2l0YW0uaW4iLCJuYW1lIjoidmlzaHdhbmF0aCBrIiwicm9sbE5vIjoiMjAyMzAwNjk0MiIsImFjY2Vzc0NvZGUiOiJ3Z0t0Z1oiLCJjbGllbnRJRCI6IjllZGM5NzQ0LTg1NzMtNGUxZi04YzQwLTM1YWY0ODY4YmI0NyIsImNsaWVudFNlY3JldCI6Ik1NR3lDcFhZYndmQWpjYkgifQ.chJWjHabeLJ-v3A1I4lb7My7lkh6N8ZBrRdppWDmmPM";

const WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export default function PriorityNotifications() {
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(5);
  const [typeFilter, setTypeFilter] = useState("All");

  const fetchAndSort = () => {
    setLoading(true);
    setError(null);
    logger.info("Fetching priority notifications", { limit, typeFilter });

    const params = {};
    if (typeFilter !== "All") params.notification_type = typeFilter;
    if (limit) params.limit = limit;

    axios
      .get(API, {
        params,
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      })
      .then((res) => {
        const data = res.data.notifications;
        logger.info("Priority data received", { count: data.length });

        const sorted = [...data].sort((a, b) => {
          const wDiff = (WEIGHTS[b.Type] || 0) - (WEIGHTS[a.Type] || 0);
          if (wDiff !== 0) return wDiff;
          return new Date(b.Timestamp) - new Date(a.Timestamp);
        });

        setFiltered(sorted.slice(0, limit));
        setLoading(false);
        logger.info("Priority notifications set", { shown: sorted.slice(0, limit).length });
      })
      .catch((err) => {
        logger.error("Failed to fetch priority notifications", { error: err.message });
        setError("Failed to load. Please try again");
        setLoading(false);
      });
  };

  useEffect(() => {
    logger.info("PriorityNotifications page mounted");
    fetchAndSort();
  }, []);

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Priority Notifications
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          label="Top N"
          type="number"
          size="small"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          sx={{ width: 100 }}
          inputProps={{ min: 1 }}
        />

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={fetchAndSort}
          sx={{ backgroundColor: "#1a237e" }}
        >
          Apply Filter
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!loading && filtered.length === 0 && (
        <Typography color="text.secondary">No notifications for this filter.</Typography>
      )}

      {!loading &&
        filtered.map((n) => (
          <NotificationCard key={n.ID} notification={n} isViewed={false} />
        ))}
    </Container>
  );
}