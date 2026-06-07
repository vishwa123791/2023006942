import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1a237e" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <NotificationsIcon />
          <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: 1 }}>
            Campus Notifcations
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={() => navigate("/")}
            sx={{
              color: "white",
              borderBottom: location.pathname === "/" ? "2px solid white" : "none",
              borderRadius: 0,
            }}
          >
            All
          </Button>
          <Button
            onClick={() => navigate("/priority")}
            sx={{
              color: "white",
              borderBottom: location.pathname === "/priority" ? "2px solid white" : "none",
              borderRadius: 0,
            }}
          >
            Priority
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}