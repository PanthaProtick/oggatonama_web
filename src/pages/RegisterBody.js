import React from "react";
import Navbar from "../components/Navbar";
import "./css/RegisterBody.css";

function RegisterBody() {
  return (
    <div className="register-page">
      <Navbar />
      <div className="container py-5">
        <h1 className="text-center text-light mb-4 register-title">Register a Dead Body</h1>
        <hr className="register-divider mb-4" />

        <div className="card register-card mx-auto">
          <form>
            <div className="mb-3">
              <label className="form-label">Found Location</label>
              <input type="text" className="form-control" placeholder="e.g., Mirpur 10 bus stand" />
            </div>

            <div className="mb-3">
              <label className="form-label">Approx. Age</label>
              <input type="number" className="form-control" placeholder="e.g., 35" />
            </div>

            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select className="form-select">
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other / Prefer not to say</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Height</label>
              <input type="text" className="form-control" placeholder="e.g., 5'7&quot; or 170 cm" />
            </div>

            <div className="mb-3">
              <label className="form-label">Dress / Clothing Description</label>
              <textarea className="form-control" rows="3" placeholder="e.g., Blue shirt, black jeans, sandals"></textarea>
            </div>

            <div className="mb-4">
              <label className="form-label">Upload Photo</label>
              <input type="file" className="form-control" accept="image/*" />            </div>

            <button type="button" className="btn btn-danger" disabled>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterBody;
