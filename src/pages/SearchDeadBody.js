import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./css/RegisterBody.css";

function SearchDeadBody() {
  const [bodies, setBodies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [division, setDivision] = useState("All");
  const [age, setAge] = useState("All");
  const divisions = [
    "All",
    "Barishal",
    "Chattogram",
    "Dhaka",
    "Khulna",
    "Rajshahi",
    "Rangpur",
    "Mymensingh",
    "Sylhet"
  ];
  const ageIntervals = ["All", ...Array.from({length: 10}, (_, i) => `${i*10}-${i*10+9}`)];

  useEffect(() => {
    fetch("http://localhost:5000/api/register")
      .then((res) => res.json())
      .then((data) => {
        setBodies(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, []);

  // Filter logic (division and age interval)
  const filteredBodies = bodies.filter((body) => {
    let divisionMatch = division === "All" || (body.foundLocation && body.foundLocation.toLowerCase().includes(division.toLowerCase()));
    let ageMatch = false;
    if (age === "All") {
      ageMatch = true;
    } else if (body.age) {
      const [min, max] = age.split("-").map(Number);
      ageMatch = body.age >= min && body.age <= max;
    }
    return divisionMatch && ageMatch;
  });

  return (
    <div className="register-page">
      <Navbar />
      <div className="container py-5">
        <h1 className="text-center text-light mb-4 register-title">Claim Reported Bodies</h1>
        <hr className="register-divider mb-4" />

        {/* Filters */}
        <div className="mb-3">
          <label className="form-label">Filter by Division</label>
          <select className="form-select" value={division} onChange={e => setDivision(e.target.value)}>
            {divisions.map(div => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Filter by Approximate Age</label>
          <select className="form-select" value={age} onChange={e => setAge(e.target.value)}>
            {ageIntervals.map(interval => (
              <option key={interval} value={interval}>{interval}</option>
            ))}
          </select>
        </div>

        {/* Body List */}
        {loading ? (
          <div className="text-center text-light">Loading...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : filteredBodies.length === 0 ? (
          <div className="alert alert-warning">No bodies found.</div>
        ) : (
          filteredBodies.map((body) => (
            <div className="card register-card mx-auto mb-4" key={body._id}>
              <div className="card-body">
                <h5 className="card-title"><b>Reporter:</b> Unknown</h5>
                <p className="card-text mb-1"><b>Discovery Location:</b> {body.foundLocation}</p>
                <p className="card-text mb-1"><b>Approximate Age:</b> {body.age}</p>
                <p className="card-text mb-1"><b>Gender:</b> {body.gender}</p>
                <p className="card-text mb-1"><b>Height:</b> {body.height}</p>
                <p className="card-text mb-1"><b>Clothing:</b> {body.clothing}</p>
                {body.photo && <img src={`http://localhost:5000${body.photo}`} alt="Dead body" style={{maxWidth:200, maxHeight:200, borderRadius:8, marginBottom:10}} />}
                <p className="card-text mb-1"><b>Reported At:</b> {new Date(body.createdAt).toLocaleString()}</p>
                <button className="btn btn-danger me-2">Unclaimed</button>
                <button className="btn btn-primary">Call</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SearchDeadBody;
