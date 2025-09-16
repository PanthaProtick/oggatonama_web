import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import "./css/RegisterBody.css";


function RegisterBody() {
  // const navigate = useNavigate();
  const { token, user } = useAuth();
  const divisionDistricts = {
    Barishal: ["Barguna", "Barishal", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur"],
    Chittagong: ["Bandarban", "Brahmanbaria", "Chandpur", "Chittagong", "Comilla", "Cox's Bazar", "Feni", "Khagrachhari", "Lakshmipur", "Noakhali", "Rangamati"],
    Dhaka: ["Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Jamalpur", "Kishoreganj", "Madaripur", "Manikganj", "Munshiganj", "Mymensingh", "Narayanganj", "Narsingdi", "Netrokona", "Rajbari", "Shariatpur", "Sherpur", "Tangail"],
    Khulna: ["Bagerhat", "Chuadanga", "Jessore", "Jhenaidah", "Khulna", "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira"],
    Mymensingh: ["Jamalpur", "Mymensingh", "Netrokona", "Sherpur"],
    Rajshahi: ["Bogra", "Chapainawabganj", "Joypurhat", "Naogaon", "Natore", "Pabna", "Rajshahi", "Sirajganj"],
    Rangpur: ["Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Rangpur", "Thakurgaon"],
    Sylhet: ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"]
  };
  const divisions = Object.keys(divisionDistricts);

  const [form, setForm] = useState({
    division: "",
    district: "",
    exactLocation: "",
    age: "",
    gender: "",
    heightFeet: "",
    heightInch: "",
    clothing: "",
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Reset district if division changes
    if (name === "division") {
      setForm((prev) => ({ ...prev, district: "" }));
    }
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    // Combine location fields
    const foundLocation = `${form.division}, ${form.district}, ${form.exactLocation}`;
    const height = form.heightFeet && form.heightInch
      ? `${form.heightFeet}'${form.heightInch}"`
      : form.heightFeet
        ? `${form.heightFeet}'0"`
        : form.heightInch
          ? `0'${form.heightInch}"`
          : "";
    // Use the latest user info from context
    const submitForm = {
      ...form,
      foundLocation,
      height,
      reporter: user?.fullName || user?.name || "Unknown",
      reporterContact: user?.contactNumber || "",
    };
    delete submitForm.division;
    delete submitForm.district;
    delete submitForm.exactLocation;
    delete submitForm.heightFeet;
    delete submitForm.heightInch;

    try {
      const formData = new FormData();
      Object.entries(submitForm).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (photo) formData.append("photo", photo);

  const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        body: formData,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (res.ok) {
        setSuccess("Registration successful! Go to the Search page to see your report.");
        setForm({ division: "", district: "", exactLocation: "", age: "", gender: "", heightFeet: "", heightInch: "", clothing: "" });
        setPhoto(null);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        // No redirect, let user go to search page manually
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error: " + err.message);
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
              <label className="form-label">Division</label>
              <select
                className="form-select"
                name="division"
                value={form.division}
                onChange={handleChange}
                required
              >
                <option value="">Select Division</option>
                {divisions.map((div) => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">District</label>
              <select
                className="form-select"
                name="district"
                value={form.district}
                onChange={handleChange}
                required
                disabled={!form.division}
              >
                <option value="">Select District</option>
                {form.division && divisionDistricts[form.division].map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Exact Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Mirpur 10 bus stand"
                name="exactLocation"
                value={form.exactLocation}
                onChange={handleChange}
                required
                disabled={!form.district}
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
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Prefer not to say</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Height</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Feet"
                  name="heightFeet"
                  value={form.heightFeet}
                  onChange={handleChange}
                  min="0"
                  required
                  style={{ maxWidth: "120px" }}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Inch"
                  name="heightInch"
                  value={form.heightInch}
                  onChange={handleChange}
                  min="0"
                  max="11"
                  required
                  style={{ maxWidth: "120px" }}
                />
              </div>
              <small className="form-text text-muted">e.g., 5 feet 7 inch</small>
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
