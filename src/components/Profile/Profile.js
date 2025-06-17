import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/globalContext";
import { FiEdit, FiMail, FiLogOut } from "react-icons/fi";
import "./Profile.css"; // Ensure styles match the new UI

const Profile = () => {
  const {
  profile,
  getProfile,
  editProfile,
  uploadProfilePicture,
  error,
  setError,
  incomes,
  expenses,
} = useGlobalContext();

  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const handleEditProfile = () => {
    setEditMode(true);
    setUpdatedProfile(profile);
    setPreview(profile.profilePicture || "");
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", updatedProfile.name);
    formData.append("email", updatedProfile.email);
    if (profilePic) {
      formData.append("profilePicture", profilePic);
    }

    try {
      if (profilePic) await uploadProfilePicture(profile._id, formData);
      await editProfile(profile._id, formData);
      await getProfile();
      setEditMode(false);
    } catch (err) {
      setError("Error updating profile");
    }
    setLoading(false);
  };

  const handleCancelEdit = () => setEditMode(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="profile-page">
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>

      {error && <p className="error">{error}</p>}

      <div className="profile-card">
        <div className="profile-header">
          <img
            src={
              profile.profilePicture
                ? `http://localhost:5000/uploads/${profile.profilePicture}`
                : "/default-avatar.png"
            }
            alt="Profile"
            className="profile-pic"
          />
          <div className="profile-info">
            <h3>{profile.name}</h3>
            <p className="profile-username">{profile.username}</p>
          </div>
          <FiEdit className="edit-icon" onClick={handleEditProfile} />
        </div>

        <div className="profile-details">
          <div className="profile-item">
            <FiMail className="icon" />
            <span>{profile.email}</span>
          </div>
          <div className="profile-item logout" onClick={() => setShowLogoutConfirm(true)}>
            <FiLogOut className="icon logout-icon" />
            <span>Logout</span>
          </div>
        </div>
        <div className="min-max-container">
  {/* Row 1: Min/Max Salary */}
  <div className="min-max-row">
    <div className="card min-max">
      <h3>⬇ Min Salary</h3>
      <p>${Math.min(...incomes.map(item => item.amount)) || 0}</p>
    </div>
    <div className="card min-max">
      <h3>⬆ Max Salary</h3>
      <p>${Math.max(...incomes.map(item => item.amount)) || 0}</p>
    </div>
  </div>

  {/* Row 2: Min/Max Expense */}
  <div className="min-max-row">
    <div className="card min-max">
      <h3>⬇ Min Expense</h3>
      <p>${Math.min(...expenses.map(item => item.amount)) || 0}</p>
    </div>
    <div className="card min-max">
      <h3>⬆ Max Expense</h3>
      <p>${Math.max(...expenses.map(item => item.amount)) || 0}</p>
    </div>
  </div>
</div>

      </div>
      </div>

      {showLogoutConfirm && (
        <div className="logout-modal">
          <p>Are you sure you want to logout?</p>
          <button className="btn-no" onClick={() => setShowLogoutConfirm(false)}>No</button>
          <button className="btn-yes" onClick={handleLogout}>Yes</button>
        </div>
      )}

{editMode && (
  <div className="profile-edit-form">
    <div className="form-group">
      <label>Name:</label>
      <input type="text" name="name" value={updatedProfile.name} onChange={handleChange}/>
    </div>

    <div className="form-group">
      <label>Email:</label>
      <input type="email" name="email" value={updatedProfile.email} onChange={handleChange}/>
    </div>

    <div className="form-group">
      <label>Profile Picture:</label>
      <input type="file" accept="image/*" onChange={handleImageChange}/>
      {/* {preview && <img src={preview} alt="Preview" className="preview-pic" />} */}
    </div>

    <div className="profile-edit-buttons">
      <button
        className="save-btn"
        onClick={handleSaveProfile}
        disabled={loading}
      >
        Save
      </button>
      <button
        className="cancel-btn"
        onClick={handleCancelEdit}
      >
        Cancel
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Profile;
