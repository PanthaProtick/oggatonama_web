
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import RegisterBody from "./pages/RegisterBody";
import SearchDeadBody from "./pages/SearchDeadBody";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/register" element={<RegisterBody />} />
  <Route path="/search" element={<SearchDeadBody />} />
      </Routes>
    </Router>
  );
}

export default App;

