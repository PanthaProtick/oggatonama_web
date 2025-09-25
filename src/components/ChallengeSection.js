import React from "react";
import CardItem from "./CardItem";

function ChallengeSection() {
  return (
    <div className="challenge-section" style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1e1e1e 100%)',
      minHeight: '60vh',
      paddingTop: '60px',
      paddingBottom: '60px'
    }}>
      <div className="container">
        <h2 className="text-center fw-bold mb-4 text-light">The Unclaimed Challenge</h2>
        <div className="row g-4">
          <CardItem
            title="Fragmented Data"
            text="Many deceased individuals remain unidentified due to the absence of a centralized database, hindering identification efforts."
          />
          <CardItem
            title="Families in Distress"
            text="Families of missing persons endure immense suffering and struggle to locate their loved ones, often facing dead ends."
          />
          <CardItem
            title="Operational Burdens"
            text="Law enforcement agencies and hospitals grapple with significant operational and emotional challenges in managing unidentified bodies."
          />
        </div>
      </div>
    </div>
  );
}

export default ChallengeSection;