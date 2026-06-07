import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
const chipColors = {
  Placement: "success",
  Result: "warning",
  Event: "info",
};
export default function NotificationCard({ notification, isViewed }) {
  const { Type, Message, Timestamp } = notification;
  return (
    <Card
      sx={{
        mb: 2,
        border: isViewed ? "1px solid #ddd" : "2px solid #1a237e",
        backgroundColor: isViewed ? "#f5f5f5" : "#ffffff",
        opacity: isViewed ? 0.7 : 1,
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Chip label={Type} color={chipColors[Type] || "default"} size="small" />
          {!isViewed && (
            <Chip label="NEW" color="error" size="small" />
          )}
        </Box>
        <Typography variant="body1" sx={{ fontWeight: isViewed ? 400 : 600 }}>
          {Message}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
          {new Date(Timestamp).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
}