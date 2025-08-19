import React from "react";
import Navbar from "../components/Navbar";
import "./css/Profile.css";

function Profile() {
  return (
    <div className="profile-page">
      <Navbar />

      <div className="container text-center py-5">
        <h1 className="profile-title">Profile</h1>
        <hr className="profile-divider" />

        <div className="profile-card card mx-auto p-4">
          <div className="text-center mb-3">
            <div className="profile-avatar" />
          </div>

          <h4 className="profile-username">Username</h4>
          <p className="profile-email">user@email.com</p>
          <p className="profile-member">Member since: Jan 2024</p>

          <button className="btn btn-outline-light profile-btn">
            <i className="bi bi-pencil-square me-2"></i>Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
