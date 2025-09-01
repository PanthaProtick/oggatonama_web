import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./css/RegisterBody.css";

function SearchDeadBody() {
  const [bodies, setBodies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [division, setDivision] = useState("All");
  const [age, setAge] = useState("All");

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

  // Filter logic (demo: filter by foundLocation and age range)
  const filteredBodies = bodies.filter((body) => {
    let divisionMatch = division === "All" || (body.foundLocation && body.foundLocation.toLowerCase().includes(division.toLowerCase()));
    let ageMatch = age === "All" || (body.age && (
      (age === "21-25" && body.age >= 21 && body.age <= 25) ||
      (age === "26-30" && body.age >= 26 && body.age <= 30) ||
      (age === "31-35" && body.age >= 31 && body.age <= 35)
    ));
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
            <option value="All">All</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Barisal">Barisal</option>
            <option value="Chattogram">Chattogram</option>
            {/* Add more divisions as needed */}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Filter by Approximate Age</label>
          <select className="form-select" value={age} onChange={e => setAge(e.target.value)}>
            <option value="All">All</option>
            <option value="21-25">21-25</option>
            <option value="26-30">26-30</option>
            <option value="31-35">31-35</option>
            {/* Add more age ranges as needed */}
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
