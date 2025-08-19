import React from "react";
import { Link } from "react-router-dom";


function HeroSection() {
  return (
    <div className="container-fluid bg-dark text-white py-5">
      <div className="container d-flex flex-column flex-lg-row align-items-center">
        <div className="col-lg-6 text-center text-lg-start mb-4 mb-lg-0">
          <h1 className="fw-bold">Oggatonama</h1>
          <p className="lead">Helping Families Find Their Loved Ones</p>
          <p>
            Connecting the lost with their loved ones, bringing dignity to the
            deceased, and providing compassionate support to grieving families
            and vital assistance to law enforcement and hospitals.
          </p>
          <div className="d-flex justify-content-center justify-content-lg-start gap-3">
            <Link to="/register" className="btn btn-danger">
                Register a dead body
            </Link>
            <button className="btn btn-danger">Search for a dead body</button>
          </div>
        </div>
        <div className="col-lg-6 text-center">
          <img
            src="deadbody.jpeg"
            alt="medical staff"
            className="img-fluid rounded shadow"
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
