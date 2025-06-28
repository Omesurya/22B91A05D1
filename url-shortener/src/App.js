// App.js
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Shortener from "./Shortener";
import Redirector from "./Redirector";
import Stats from "./Stats";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import './App.css'; // Import your custom CSS

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" component="div">
            🔗 URL Shortener
          </Typography>
          <Box>
            <Button color="inherit" component={Link} to="/">Shortener</Button>
            <Button color="inherit" component={Link} to="/stats">Stats</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Routing */}
      <Routes>
        <Route path="/" element={<Shortener />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/:code" element={<Redirector />} />
      </Routes>
    </BrowserRouter>
  );
}
