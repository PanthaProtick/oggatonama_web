import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ChallengeSection from "../components/ChallengeSection";
import Footer from "../components/Footer";
import CarbonWidget from "../components/CarbonWidget";
import { Container, Row, Col } from "react-bootstrap";

function Dashboard() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      
      {/* Carbon Widget Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1e1e1e 100%)',
        paddingTop: '40px',
        paddingBottom: '40px'
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={4} md={6} sm={8}>
              <div className="d-flex justify-content-center">
                <CarbonWidget showDetails={true} />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      <ChallengeSection />
      <Footer/>
    </div>
  );
}

export default Dashboard;