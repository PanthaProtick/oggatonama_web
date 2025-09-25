import React, { useEffect, useState } from "react";
import { Card, Badge } from "react-bootstrap";
import "./CarbonWidget.css";

function CarbonWidget({ showDetails = false }) {
  const [carbonData, setCarbonData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/carbon/realtime`);
        if (response.ok) {
          const data = await response.json();
          setCarbonData(data.data);
        }
      } catch (err) {
        console.error("Carbon widget fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'low': return 'success';
      case 'moderate': return 'warning';
      case 'high': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card className="carbon-widget bg-dark text-light border-secondary">
        <Card.Body className="text-center">
          <div className="spinner-border spinner-border-sm text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (!carbonData) return null;

  return (
    <Card className="carbon-widget bg-dark text-light border-secondary">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h6 className="card-title mb-1">🌱 Carbon Impact</h6>
            <div className="carbon-metric">
              {carbonData.currentEmissionPerRequest.toFixed(2)} mg CO₂/req
            </div>
          </div>
          <Badge bg={getStatusColor(carbonData.status)} className="carbon-status">
            {carbonData.status.toUpperCase()}
          </Badge>
        </div>
        
        {showDetails && (
          <div className="carbon-details mt-2 pt-2 border-top border-secondary">
            <small className="text-muted">
              Last hour: {carbonData.requestsLastHour} requests, {carbonData.lastHourTotal.toFixed(2)}g CO₂
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default CarbonWidget;