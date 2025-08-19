import React from "react";

function CardItem({ title, text }) {
  return (
    <div className="col-md-4">
      <div className="card bg-dark text-white shadow h-100">
        <div className="card-body">
          <h5 className="card-title text-warning">{title}</h5>
          <p className="card-text">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default CardItem;
