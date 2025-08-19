import React from "react";
import CardItem from "./CardItem";

function ChallengeSection() {
  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4">The Unclaimed Challenge</h2>
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
  );
}

export default ChallengeSection;