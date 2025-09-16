


import React, { useState, useRef, useEffect } from "react";
import { BiUser } from "react-icons/bi";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import "./css/Profile.css";


function Profile() {
  const { user, updateUser, token } = useAuth();
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    nidNumber: "",
    profilePhoto: ""
  });
  const [editing, setEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
        nidNumber: user.nidNumber || "",
        profilePhoto: user.profilePhoto || ""
      });
      setPhotoPreview(user.profilePhoto || null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Only set editing to true, do not trigger any form submit or reset
  const handleEdit = (e) => {
    e && e.preventDefault();
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("fullName", profile.fullName);
      formData.append("contactNumber", profile.contactNumber);
      if (photoFile) {
        formData.append("profilePhoto", photoFile);
      }
  const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Profile updated successfully!");
        setEditing(false);
        setPhotoFile(null);
        setPhotoPreview(data.user.profilePhoto);
        setProfile({
          ...profile,
          profilePhoto: data.user.profilePhoto
        });
        // If a new token is returned, update it in localStorage and context
        updateUser(data.user, data.token);
      } else {
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
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
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="profile-img" />
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

          </div>
          <form className="profile-info-section profile-info-card" onSubmit={handleSave} autoComplete="off">
            <div className="profile-info-list">
              <div className="profile-info-row profile-info-vertical">
                <span className="profile-label">Name</span>
                {editing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    className="profile-value profile-input"
                    maxLength={40}
                    required
                  />
                ) : (
                  <span className="profile-value">{profile.fullName}</span>
                )}
              </div>
              <div className="profile-info-row profile-info-vertical">
                <span className="profile-label">Email</span>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="profile-value profile-input"
                    maxLength={40}
                    required
                  />
                ) : (
                  <span className="profile-value">{profile.email}</span>
                )}
              </div>
              <div className="profile-info-row profile-info-vertical">
                <span className="profile-label">Phone</span>
                {editing ? (
                  <input
                    type="text"
                    name="contactNumber"
                    value={profile.contactNumber}
                    onChange={handleChange}
                    className="profile-value profile-input"
                    maxLength={20}
                    required
                  />
                ) : (
                  <span className="profile-value">{profile.contactNumber}</span>
                )}
              </div>
              <div className="profile-info-row profile-info-vertical">
                <span className="profile-label">NID</span>
                {editing ? (
                  <input
                    type="text"
                    name="nidNumber"
                    value={profile.nidNumber}
                    onChange={handleChange}
                    className="profile-value profile-input"
                    maxLength={30}
                  />
                ) : (
                  <span className="profile-value">{profile.nidNumber}</span>
                )}
              </div>
              {editing && (
                <div className="profile-info-row">
                  <span className="profile-label">Password</span>
                  <input
                    type="password"
                    name="password"
                    placeholder="New password"
                    className="profile-value profile-input"
                    minLength={6}
                  />
                </div>
              )}
            </div>
            {success && <div className="alert alert-success mt-2">{success}</div>}
            {error && <div className="alert alert-danger mt-2">{error}</div>}
            <div className="profile-edit-btn-row">
              {editing ? (
                <>
                  <button type="submit" className="profile-edit-btn"><i className="bi bi-check" /> Save</button>
                  <button type="button" className="profile-edit-btn" style={{marginLeft:'12px',background:'#333'}} onClick={()=>{setEditing(false);setPhotoFile(null);setPhotoPreview(user?.profilePhoto||null);setProfile({fullName:user?.fullName||"",email:user?.email||"",contactNumber:user?.contactNumber||"",nidNumber:user?.nidNumber||"",profilePhoto:user?.profilePhoto||""});}}>Cancel</button>
                </>
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
