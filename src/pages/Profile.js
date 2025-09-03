

import React, { useState, useRef } from "react";
import { BiUser } from "react-icons/bi";
import Navbar from "../components/Navbar";
import "./css/Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    name: "User Name",
    email: "mail@network.co",
    phone: "+880-123456789",
    address: "123 Main St, Elizabeth, NJ",
    image: ""
  });
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => setEditing(true);
  const handleSave = (e) => {
    e.preventDefault();
    setEditing(false);
  };

  return (
    <div className="profile-gradient-bg">
      <Navbar />
      <div className="profile-main-centered">
        <div className="profile-header">
          <span className="profile-dot" />
          <span className="profile-title">Profile</span>
        </div>
        <div className="profile-card-redesign">
          <div className="profile-img-section-centered">
            {profile.image ? (
              <img src={profile.image} alt="Profile" className="profile-img" />
            ) : (
              <div className="profile-img profile-img-icon-centered">
                <BiUser size={80} color="#bbb" />
              </div>
            )}
            {editing && (
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ marginTop: "12px" }}
              />
            )}
            <div className="profile-action-section" style={{ marginTop: "18px" }}>
              <button type="button" className="profile-action-btn"><i className="bi bi-download" /> Download</button>
              <button type="button" className="profile-action-btn"><i className="bi bi-share" /> Share</button>
            </div>
          </div>
          <form className="profile-info-section" onSubmit={handleSave} autoComplete="off">
            <div className="profile-info-row">
              <span className="profile-label">Name:</span>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="profile-value profile-input"
                />
              ) : (
                <span className="profile-value">{profile.name}</span>
              )}
            </div>
            <div className="profile-info-row">
              <span className="profile-label">Email:</span>
              {editing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="profile-value profile-input"
                />
              ) : (
                <span className="profile-value">{profile.email}</span>
              )}
            </div>
            <div className="profile-info-row">
              <span className="profile-label">Phone Number:</span>
              {editing ? (
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="profile-value profile-input"
                />
              ) : (
                <span className="profile-value">{profile.phone}</span>
              )}
            </div>
            <div className="profile-info-row">
              <span className="profile-label">Address:</span>
              {editing ? (
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="profile-value profile-input"
                />
              ) : (
                <span className="profile-value">{profile.address}</span>
              )}
            </div>
            <div style={{ marginTop: "24px", textAlign: "left" }}>
              {editing ? (
                <button type="submit" className="profile-edit-btn"><i className="bi bi-check" /> Save</button>
              ) : (
                <button type="button" className="profile-edit-btn" onClick={handleEdit}><i className="bi bi-pencil-square" /> Edit Profile</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
