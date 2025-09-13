import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./css/RegisterBody.css";

function SearchDeadBody() {
  const [showContact, setShowContact] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
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
  const divisions = ["All", ...Object.keys(divisionDistricts)];
  const [bodies, setBodies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [division, setDivision] = useState("All");
  const [district, setDistrict] = useState("All");
  const [age, setAge] = useState("All");
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

  // Filter logic (division, district, and age interval)
  const filteredBodies = bodies.filter((body) => {
    let foundDivision = "";
    let foundDistrict = "";
    if (body.foundLocation) {
      const parts = body.foundLocation.split(",");
      foundDivision = parts[0]?.trim();
      foundDistrict = parts[1]?.trim();
    }
    let divisionMatch = division === "All" || foundDivision === division;
    let districtMatch = district === "All" || foundDistrict === district;
    let ageMatch = false;
    if (age === "All") {
      ageMatch = true;
    } else if (body.age) {
      const [min, max] = age.split("-").map(Number);
      ageMatch = body.age >= min && body.age <= max;
    }
    return divisionMatch && districtMatch && ageMatch;
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
          <select className="form-select" value={division} onChange={e => { setDivision(e.target.value); setDistrict("All"); }}>
            {divisions.map(div => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Filter by District</label>
          <select className="form-select" value={district} onChange={e => setDistrict(e.target.value)} disabled={division === "All"}>
            <option value="All">All</option>
            {division !== "All" && divisionDistricts[division]?.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
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
                <h5 className="card-title"><b>Reporter:</b> {body.reporter || "Unknown"}</h5>
                <p className="card-text mb-1"><b>Discovery Location:</b> {body.foundLocation}</p>
                <p className="card-text mb-1"><b>Approximate Age:</b> {body.age}</p>
                <p className="card-text mb-1"><b>Gender:</b> {body.gender}</p>
                <p className="card-text mb-1"><b>Height:</b> {body.height}</p>
                <p className="card-text mb-1"><b>Clothing:</b> {body.clothing}</p>
                {body.photo && (
                  <div className="mb-3">
                    <img 
                      src={body.photo} 
                      alt="Dead body" 
                      style={{
                        maxWidth: 200, 
                        maxHeight: 200, 
                        borderRadius: 8, 
                        objectFit: 'cover',
                        border: '1px solid #ddd'
                      }} 
                      onError={(e) => {
                        console.error('Image failed to load:', body.photo);
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <p className="card-text mb-1"><b>Reported At:</b> {new Date(body.createdAt).toLocaleString()}</p>
                <button className="btn btn-danger me-2">Unclaimed</button>
                <button className="btn btn-primary" onClick={() => {
                  setContactNumber(body.reporterContact || "Not available");
                  setShowContact(true);
                }}>Call</button>
              </div>
            </div>
          ))
        )}
      {/* Contact Popup */}
      {showContact && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
            <div style={{
              background: "#4B1E1E", // dark brown
              color: "#fff",
              padding: "32px 24px",
              borderRadius: "12px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
              minWidth: "320px",
              textAlign: "center"
            }}>
            <h4 style={{marginBottom: "16px"}}>Reporter Contact Number</h4>
            <div style={{fontSize: "1.3rem", fontWeight: "bold", marginBottom: "24px"}}>{contactNumber}</div>
            <button className="btn btn-danger" onClick={() => setShowContact(false)}>Close</button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default SearchDeadBody;
