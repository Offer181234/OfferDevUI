import React from "react";
import "../css/Modal.css";

const AddAdvertiserModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">

      <div className="modal-box">

        <div className="modal-header">
          <h3>Create Advertiser</h3>
          <span className="close-btn" onClick={onClose}>✖</span>
        </div>

        <div className="modal-body">

          <div className="form-row">
            <label>Name *</label>
            <div className="flex">
              <input placeholder="First Name" />
              <input placeholder="Last Name" />
            </div>
          </div>

          <div className="form-row">
            <label>Company ( Brand )</label>
            <input placeholder="Company" />
          </div>

          <div className="form-row">
            <label>Email *</label>
            <input placeholder="test@example.com" />
          </div>

          <div className="form-row">
            <label>Password *</label>
            <div className="flex">
              <input />
              <button className="btn small">Generate</button>
            </div>
          </div>

          <div className="form-row">
            <label>Account Manager</label>
            <select>
              <option>Select Employee</option>
            </select>
          </div>

          <div className="form-row">
            <label>Status</label>
            <select>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="form-row toggle">
            <input type="checkbox" />
            <span>Send Credentials to User</span>
          </div>

          <button className="btn primary submit">Submit</button>

        </div>

      </div>

    </div>
  );
};

export default AddAdvertiserModal;