import React from "react";

function RegisterBody() {
  return (
    <div className="container my-5">
      <h2 className="mb-4">Register a Dead Body</h2>

      <div className="card shadow-sm">
        <div className="card-body">
          <form>
            {/* Found Location */}
            <div className="mb-3">
              <label className="form-label">Found Location</label>
              <input type="text" className="form-control" placeholder="e.g., Mirpur 10 bus stand" />
            </div>

            {/* Age */}
            <div className="mb-3">
              <label className="form-label">Approx. Age</label>
              <input type="number" className="form-control" placeholder="e.g., 35" />
            </div>

            {/* Gender */}
            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select className="form-select">
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other / Prefer not to say</option>
              </select>
            </div>

            {/* Height */}
            <div className="mb-3">
              <label className="form-label">Height</label>
              <input type="text" className="form-control" placeholder="e.g., 5'7&quot; or 170 cm" />
            </div>

            {/* Dress */}
            <div className="mb-3">
              <label className="form-label">Dress / Clothing Description</label>
              <textarea className="form-control" rows="3" placeholder="e.g., Blue shirt, black jeans, sandals"></textarea>
            </div>

            {/* Photo Upload */}
            <div className="mb-4">
              <label className="form-label">Upload Photo</label>
              <input type="file" className="form-control" accept="image/*" />
              <div className="form-text">This is a demo — uploading won’t actually save anything.</div>
            </div>

            <button type="button" className="btn btn-danger" disabled>
              Submit (disabled for demo)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterBody;
