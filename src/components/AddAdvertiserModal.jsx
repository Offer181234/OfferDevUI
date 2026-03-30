import React, { useState } from "react";
import "../css/Modal.css";
import { useNavigate } from "react-router-dom";

const AddAdvertiserModal = ({ onClose }) => {
  const navigate = useNavigate();

  // GET USER FROM LOCALSTORAGE
  const user = JSON.parse(localStorage.getItem("user"));

  // FORM STATE
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    passwordHash: "",
    accountManagerId: user?.id || "",
    status: "Active",
    sendCredentials: false,
    isActive: true
  });

  const [loading, setLoading] = useState(false);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // GENERATE PASSWORD
  const generatePassword = () => {
    const random = Math.random().toString(36).slice(-8);
    setFormData({ ...formData, passwordHash: random });
  };

  // SUBMIT API
  const handleSubmit = async () => {
    if (!user?.id) {
      alert("User not logged in ❌");
      return;
    }

    if (!formData.firstName || !formData.email) {
      alert("Please fill required fields ❌");
      return;
    }

    try {
      setLoading(true);

      await fetch("https://localhost:7129/api/Advertisers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          id: 0,
          ...formData,
          modifiedOn: new Date().toISOString(),
          createdOn: new Date().toISOString()
        })
      });

      alert("Advertiser Created Successfully ✅");
      onClose();
      navigate("/advertisers");

    } catch (error) {
      console.error(error);
      alert("Error creating advertiser ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {/* HEADER */}
        <div className="modal-header">
          <h3>Create Advertiser</h3>
          <span className="close-btn" onClick={onClose}>✖</span>
        </div>

        {/* BODY - Fixed structure */}
        <div className="modal-body">
          {/* NAME */}
          <div className="form-row">
            <label>Name *</label>
            <div className="flex">
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* COMPANY */}
          <div className="form-row">
            <label>Company (Brand)</label>
            <input
              name="companyName"
              placeholder="Company"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

          {/* EMAIL */}
          <div className="form-row">
            <label>Email *</label>
            <input
              name="email"
              placeholder="test@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* PASSWORD */}
          <div className="form-row">
            <label>Password *</label>
            <div className="">
              <input
                name="passwordHash"
                value={formData.passwordHash}
                onChange={handleChange}
                placeholder="Enter or generate password"
              />
              <button
                className="btn small"
                type="button"
                onClick={generatePassword}
              >
                Generate
              </button>
            </div>
          </div>

          {/* ACCOUNT MANAGER */}
          <div className="form-row">
            <label>Account Manager</label>
            <input 
              value={user?.firstName ? `${user.firstName} ${user.lastName || ''}` : ""} 
              disabled 
            />
          </div>

          {/* STATUS */}
          <div className="form-row">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* SEND CREDENTIALS */}
          <div className="form-row toggle">
            <label className="switch">
              <input
                type="checkbox"
                name="sendCredentials"
                checked={formData.sendCredentials}
                onChange={handleChange}
              />
              <span className="slider"></span>
            </label>
            <span className="toggle-label">
              Send Credentials to User
            </span>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="form-actions">
            <button
              className="btn primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdvertiserModal;