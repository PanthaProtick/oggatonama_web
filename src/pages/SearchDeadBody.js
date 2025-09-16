
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import "./css/RegisterBody.css";

function SearchDeadBody() {
  const [showContact, setShowContact] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [statusUpdating, setStatusUpdating] = useState({});
  const { user, token } = useAuth();
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

  const API_BASE = "http://localhost:5000";
  const fetchBodies = () => {
    setLoading(true);
    fetch(`${API_BASE}/api/register?ts=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("[DEBUG] Bodies fetched:", data);
        setBodies(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchBodies();
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


  // Claim request handler
  const handleClaimRequest = async (body) => {
    setStatusUpdating((prev) => ({ ...prev, [body._id]: true }));
    try {
      console.log("[DEBUG] Sending claim request for:", body._id, "as user:", user?.fullName || user?.name);
      const res = await fetch(`${API_BASE}/api/register/${body._id}/claim`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const result = await res.json();
      console.log("[DEBUG] Claim response:", result);
      if (res.ok) {
        fetchBodies();
      } else {
        alert(result.error || "Claim failed");
      }
    } catch (err) {
      console.error("[DEBUG] Claim request error:", err);
    }
    setStatusUpdating((prev) => ({ ...prev, [body._id]: false }));
  };

  // Approve claim handler (only reporter)
  const handleApprove = async (body) => {
    setStatusUpdating((prev) => ({ ...prev, [body._id]: true }));
    try {
      const res = await fetch(`${API_BASE}/api/register/${body._id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        // Remove from UI
        setBodies((prev) => prev.filter((b) => b._id !== body._id));
      }
    } catch (err) {}
    setStatusUpdating((prev) => ({ ...prev, [body._id]: false }));
  };

  return (
    <div className="register-page">
      <Navbar />
      <div className="container py-5">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h1 className="text-light mb-4 register-title">Claim Reported Bodies</h1>
          <button className="btn btn-secondary" onClick={fetchBodies} style={{height:'40px'}}>Refresh</button>
        </div>
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
                {/* Claim/Pending/Approve Button Logic */}

                {body.status === "unclaimed" ? (
                  <button
                    className="btn btn-danger me-2"
                    style={{ minWidth: '140px', fontWeight: 'bold', fontSize: '1.2rem' }}
                    disabled={statusUpdating[body._id] || !user}
                    onClick={() => handleClaimRequest(body)}
                  >
                    {statusUpdating[body._id] ? "Requesting..." : "Claim"}
                  </button>
                ) : body.status === "pending" ? (
                  (() => {
                    const claimRequests = Array.isArray(body.claimRequests) ? body.claimRequests : [];
                    const userName = user?.fullName || user?.name || "";
                    if (claimRequests.includes(userName)) {
                      return (
                        <button
                          className="btn btn-warning me-2"
                          style={{ minWidth: '140px', fontWeight: 'bold', fontSize: '1.2rem' }}
                          disabled
                        >
                          Pending (You)
                        </button>
                      );
                    } else {
                      return (
                        <button
                          className="btn btn-warning me-2"
                          style={{ minWidth: '140px', fontWeight: 'bold', fontSize: '1.2rem' }}
                          disabled
                        >
                          Pending
                        </button>
                      );
                    }
                  })()
                ) : null}

                {/* Approve button for reporter if there are claim requests */}
                {body.status === "pending" && user && (body.reporter === user.fullName || body.reporter === user.name) && Array.isArray(body.claimRequests) && body.claimRequests.length > 0 && (
                  <button
                    className="btn btn-success me-2"
                    style={{ minWidth: '140px', fontWeight: 'bold', fontSize: '1.2rem' }}
                    disabled={statusUpdating[body._id]}
                    onClick={() => handleApprove(body)}
                  >
                    {statusUpdating[body._id] ? "Approving..." : "Approve & Remove"}
                  </button>
                )}
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
