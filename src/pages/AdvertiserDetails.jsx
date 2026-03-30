import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../css/AdvertiserDetails.css";
import { useParams } from "react-router-dom";

const AdvertiserDetails = () => {
  const { id } = useParams();

  const [advertisers, setAdvertisers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [countries, setCountries] = useState([]);

  // 🌍 Countries
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((res) => res.json())
      .then((data) => {
        const list = data.map((c) => c.name.common).sort();
        setCountries(list);
      });
  }, []);

  // 🔹 Get advertisers list
  useEffect(() => {
    fetch("https://localhost:7129/api/Advertisers")
      .then((res) => res.json())
      .then((data) => setAdvertisers(data));
  }, []);

  // 🔹 Fetch single advertiser
  const fetchAdvertiser = (id) => {
    if (!id) return;

    setLoading(true);

    fetch(`https://localhost:7129/api/Advertisers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelected(data);
        setFormData(data);
        setIsEdit(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) fetchAdvertiser(id);
  }, [id]);

  const handleSelect = (e) => {
    fetchAdvertiser(e.target.value);
  };

  // 🔹 Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔥 ✅ FINAL SUBMIT (FIXED)
  const handleSubmit = async () => {
    try {
      setLoading(true);

      await fetch(`https://localhost:7129/api/Advertisers/details/${selected.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id: selected.id,
        }),
      });

      alert("Updated successfully ✅");

      setSelected(formData);
      setIsEdit(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(selected);
    setIsEdit(false);
  };

  return (
    <div className="main-container">
      <Sidebar />
      <div className="content">
        <Header />

        <div className="page-wrapper">

          {/* LEFT PANEL */}
          <div className="left-panel">
            <div className="card">

              {/* HEADER */}
              <div className="profile-header">
                <div className="avatar">
                  {selected
                    ? `${selected.firstName?.charAt(0)}${selected.lastName?.charAt(0)}`
                    : "NA"}
                </div>

                <div style={{ width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
                      Advertiser : #{selected?.id}
                    </p>

                    {selected && (
                      <button className="edit-btn" onClick={() => setIsEdit(!isEdit)}>
                        {isEdit ? "Cancel" : "Edit"}
                      </button>
                    )}
                  </div>

                  <h3>{selected?.firstName} {selected?.lastName}</h3>
                  <p className="sub-text">{selected?.companyName}</p>
                  <span className="status">{selected?.status}</span>
                </div>
              </div>

              {/* PROFILE */}
              <h4>Profile</h4>
              <div className="info-grid">

                <p><b>First Name:</b> {isEdit ? <input name="firstName" value={formData?.firstName || ""} onChange={handleChange}/> : selected?.firstName}</p>
                <p><b>Last Name:</b> {isEdit ? <input name="lastName" value={formData?.lastName || ""} onChange={handleChange}/> : selected?.lastName}</p>
                <p><b>Company:</b> {isEdit ? <input name="companyName" value={formData?.companyName || ""} onChange={handleChange}/> : selected?.companyName}</p>

                <p><b>Mobile:</b> {isEdit ? <input name="mobileNumber" value={formData?.mobileNumber || ""} onChange={handleChange}/> : formData?.mobileNumber || "n/a"}</p>
                <p><b>Address:</b> {isEdit ? <input name="address" value={formData?.address || ""} onChange={handleChange}/> : formData?.address || "n/a"}</p>
                <p><b>City:</b> {isEdit ? <input name="city" value={formData?.city || ""} onChange={handleChange}/> : formData?.city || "n/a"}</p>
                <p><b>State:</b> {isEdit ? <input name="state" value={formData?.state || ""} onChange={handleChange}/> : formData?.state || "n/a"}</p>

                <p>
                  <b>Country:</b>
                  {isEdit ? (
                    <select name="country" value={formData?.country || ""} onChange={handleChange}>
                      <option value="">Select Country</option>
                      {countries.map((c, i) => <option key={i}>{c}</option>)}
                    </select>
                  ) : formData?.country}
                </p>

                <p><b>Zip:</b> {isEdit ? <input name="zipCode" value={formData?.zipCode || ""} onChange={handleChange}/> : formData?.zipCode || "n/a"}</p>

              </div>

              {/* ACCOUNT */}
              <h4>Account</h4>
              <div className="info-grid">

                <p><b>Email:</b> {isEdit ? <input name="email" value={formData?.email || ""} onChange={handleChange}/> : selected?.email}</p>

                <p><b>Status:</b>
                  {isEdit ? (
                    <select
                      value={formData?.isActive ? "Active" : "Inactive"}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.value === "Active" })
                      }
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  ) : selected?.isActive ? "Active" : "Inactive"}
                </p>

                <p><b>Postback IP:</b> {isEdit ? <textarea name="postbackIp" value={formData?.postbackIp || ""} onChange={handleChange}/> : "n/a"}</p>
                <p><b>Whitelist:</b> {isEdit ? <textarea name="whitelist" value={formData?.whitelist || ""} onChange={handleChange}/> : "n/a"}</p>
                <p><b>Additional Info:</b> {isEdit ? <textarea name="additionalInfo" value={formData?.additionalInfo || ""} onChange={handleChange}/> : "n/a"}</p>
                <p><b>Private Note:</b> {isEdit ? <textarea name="privateNote" value={formData?.privateNote || ""} onChange={handleChange}/> : "n/a"}</p>

              </div>

              {/* ACTION */}
              {isEdit && (
                <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                  <button onClick={handleCancel}>Cancel</button>
                  <button onClick={handleSubmit}>Submit</button>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT PANEL */}
       {/* RIGHT PANEL (UNCHANGED) */}
          <div className="right-panel">
            <div className="top-bar">
              <div className="dropdown-wrapper">

                <select onChange={handleSelect} value={selected?.id || ""}>
                  <option value="">Select Advertiser</option>

                  {advertisers.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.id} ~ {item.firstName} {item.lastName} ({item.companyName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

                {/* REPORT */}
            <div className="card">
              <h3>Reports</h3>

              <div className="report-box">
                <div className="report-item">
                  <p>Revenue</p>
                  <h2>0 USD</h2>
                </div>

                <div className="report-item">
                  <p>Conversions</p>
                  <h2>0</h2>
                </div>
              </div>

              <div className="chart-placeholder">Chart Area</div>
            </div>

            {/* MANAGE */}
            <div className="card">
              <h3>Manage Affiliates</h3>
              <select><option>Select Affiliate</option></select>
              <select><option>Select Affiliate Allow</option></select>
            </div>

            {/* BILLING */}
            <div className="card">
              <h3>Billing</h3>
              <p>No Tax Details Found</p>
            </div>

            {/* INVOICES */}
            <div className="card">
              <h3>Invoices</h3>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Advertiser</th>
                      <th>Invoice Date</th>
                      <th>Due Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="5">No data available</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdvertiserDetails;