
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./css/RegisterBody.css";

function RegisterBody() {
  const [form, setForm] = useState({
    foundLocation: "",
    age: "",
    gender: "",
    height: "",
    clothing: "",
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (photo) formData.append("photo", photo);

      const res = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setSuccess("Registration successful!");
        setForm({ foundLocation: "", age: "", gender: "", height: "", clothing: "" });
        setPhoto(null);
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Navbar />
      <div className="container py-5">
        <h1 className="text-center text-light mb-4 register-title">Register a Dead Body</h1>
        <hr className="register-divider mb-4" />

        <div className="card register-card mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Found Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Mirpur 10 bus stand"
                name="foundLocation"
                value={form.foundLocation}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Approx. Age</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g., 35"
                name="age"
                value={form.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other / Prefer not to say</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Height</label>
              <input
                type="text"
                className="form-control"
                placeholder={'e.g., 5\'7" or 170 cm'}
                name="height"
                value={form.height}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Dress / Clothing Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="e.g., Blue shirt, black jeans, sandals"
                name="clothing"
                value={form.clothing}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="form-label">Upload Photo</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <button type="submit" className="btn btn-danger" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
            {success && <div className="alert alert-success mt-3">{success}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterBody;
