import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ChallengeSection from "../components/ChallengeSection";
import Footer from "../components/Footer";

function Dashboard() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <ChallengeSection />
      <Footer/>
    </div>
  );
}

export default Dashboard;