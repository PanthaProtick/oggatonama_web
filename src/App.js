import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <Dashboard />
    </Router>
  );
}

export default App;
