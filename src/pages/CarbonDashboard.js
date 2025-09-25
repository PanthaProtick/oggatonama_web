import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Badge, ProgressBar } from "react-bootstrap";
import Navbar from "../components/Navbar";
import "./css/CarbonDashboard.css";

function CarbonDashboard() {
  const [carbonData, setCarbonData] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  const [timeframe, setTimeframe] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = "http://localhost:5000";

  const fetchCarbonData = async () => {
    setLoading(true);
    try {
      const [statsResponse, realtimeResponse] = await Promise.all([
        fetch(`${API_BASE}/api/carbon/stats?timeframe=${timeframe}`),
        fetch(`${API_BASE}/api/carbon/realtime`)
      ]);

      if (statsResponse.ok && realtimeResponse.ok) {
        const stats = await statsResponse.json();
        const realtime = await realtimeResponse.json();
        setCarbonData(stats.data);
        setRealTimeData(realtime.data);
      } else {
        setError("Failed to fetch carbon emission data");
      }
    } catch (err) {
      console.error("Carbon data fetch error:", err);
      setError("Network error while fetching carbon data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarbonData();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchCarbonData, 30000);
    return () => clearInterval(interval);
  }, [timeframe]);

  const getEmissionStatus = (co2PerRequest) => {
    if (co2PerRequest < 1) return { color: 'success', text: 'Excellent' };
    if (co2PerRequest < 5) return { color: 'warning', text: 'Good' };
    return { color: 'danger', text: 'High' };
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="carbon-dashboard-page">
      <Navbar />
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-light carbon-title">🌱 Carbon Emission Dashboard</h1>
          <div className="timeframe-selector">
            <select 
              className="form-select bg-dark text-light border-secondary"
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center text-light">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : carbonData && realTimeData ? (
          <>
            {/* Real-time Status Cards */}
            <Row className="mb-4">
              <Col md={3}>
                <Card className="bg-dark text-light border-secondary h-100">
                  <Card.Body className="text-center">
                    <h3 className="text-success">{realTimeData.currentEmissionPerRequest.toFixed(3)}</h3>
                    <p className="mb-0">mg CO₂ per request</p>
                    <Badge bg={getEmissionStatus(realTimeData.currentEmissionPerRequest).color}>
                      {getEmissionStatus(realTimeData.currentEmissionPerRequest).text}
                    </Badge>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="bg-dark text-light border-secondary h-100">
                  <Card.Body className="text-center">
                    <h3 className="text-info">{realTimeData.requestsLastHour}</h3>
                    <p className="mb-0">Requests (Last Hour)</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="bg-dark text-light border-secondary h-100">
                  <Card.Body className="text-center">
                    <h3 className="text-warning">{realTimeData.lastHourTotal.toFixed(3)}</h3>
                    <p className="mb-0">g CO₂ (Last Hour)</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="bg-dark text-light border-secondary h-100">
                  <Card.Body className="text-center">
                    <h3 className="text-primary">
                      {carbonData.averageResponseTime}ms
                    </h3>
                    <p className="mb-0">Avg Response Time</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Detailed Statistics */}
            <Row className="mb-4">
              <Col md={6}>
                <Card className="bg-dark text-light border-secondary h-100">
                  <Card.Header>
                    <h5>📊 {timeframe.toUpperCase()} Statistics</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <strong>Total CO₂ Emissions:</strong> {carbonData.totalCO2Grams.toFixed(3)} grams
                    </div>
                    <div className="mb-3">
                      <strong>Total Requests:</strong> {carbonData.totalRequests.toLocaleString()}
                    </div>
                    <div className="mb-3">
                      <strong>Data Transferred:</strong> {formatBytes(carbonData.totalBytesTransferred)}
                    </div>
                    <div className="mb-3">
                      <strong>Energy Consumed:</strong> {carbonData.totalEnergyJoules.toFixed(2)} Joules
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="bg-dark text-light border-secondary h-100">
                  <Card.Header>
                    <h5>🌍 Environmental Impact</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <strong>Equivalent Car Distance:</strong> {carbonData.equivalentKmDriven.toFixed(2)} km
                      <ProgressBar 
                        now={Math.min(carbonData.equivalentKmDriven * 10, 100)} 
                        variant="danger" 
                        className="mt-1"
                      />
                    </div>
                    <div className="mb-3">
                      <strong>Trees Needed (Annual):</strong> {carbonData.equivalentTreesNeeded.toFixed(4)}
                      <ProgressBar 
                        now={Math.min(carbonData.equivalentTreesNeeded * 1000, 100)} 
                        variant="success" 
                        className="mt-1"
                      />
                    </div>
                    <div className="mb-3">
                      <strong>CO₂ per Request:</strong> {carbonData.co2PerRequest.toFixed(3)} mg
                    </div>
                    <div className="carbon-rating">
                      <Badge bg={getEmissionStatus(carbonData.co2PerRequest).color} className="fs-6">
                        Carbon Efficiency: {getEmissionStatus(carbonData.co2PerRequest).text}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Top Endpoints by Carbon Emission */}
            <Row>
              <Col md={12}>
                <Card className="bg-dark text-light border-secondary">
                  <Card.Header>
                    <h5>🔥 Top Endpoints by Carbon Emission</h5>
                  </Card.Header>
                  <Card.Body>
                    {carbonData.endpointBreakdown && carbonData.endpointBreakdown.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-dark table-striped">
                          <thead>
                            <tr>
                              <th>Endpoint</th>
                              <th>Requests</th>
                              <th>Total CO₂ (g)</th>
                              <th>Data (Bytes)</th>
                              <th>Avg Response Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {carbonData.endpointBreakdown.map(([endpoint, data], index) => (
                              <tr key={index}>
                                <td>
                                  <code className="text-info">{endpoint}</code>
                                </td>
                                <td>{data.requests}</td>
                                <td>
                                  <Badge bg={data.totalCO2 > 0.1 ? "danger" : data.totalCO2 > 0.05 ? "warning" : "success"}>
                                    {data.totalCO2}
                                  </Badge>
                                </td>
                                <td>{formatBytes(data.totalBytes)}</td>
                                <td>{data.avgResponseTime}ms</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">No endpoint data available for this timeframe.</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Sustainability Tips */}
            <Row className="mt-4">
              <Col md={12}>
                <Card className="bg-dark text-light border-secondary">
                  <Card.Header>
                    <h5>💡 Sustainability Tips</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h6>🔧 Technical Optimizations:</h6>
                        <ul>
                          <li>Implement image compression and lazy loading</li>
                          <li>Use CDN for static assets</li>
                          <li>Optimize database queries</li>
                          <li>Enable GZIP compression</li>
                        </ul>
                      </Col>
                      <Col md={6}>
                        <h6>🌱 Green Practices:</h6>
                        <ul>
                          <li>Consider green web hosting providers</li>
                          <li>Reduce unnecessary API calls</li>
                          <li>Implement efficient caching strategies</li>
                          <li>Monitor and optimize energy consumption</li>
                        </ul>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <Alert variant="warning">No carbon emission data available.</Alert>
        )}
      </Container>
    </div>
  );
}

export default CarbonDashboard;