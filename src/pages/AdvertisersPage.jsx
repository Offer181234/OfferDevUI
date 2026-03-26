import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AddAdvertiserModal from "../components/AddAdvertiserModal"; // ✅ import
import "../css/Advertisers.css";
import { useNavigate } from "react-router-dom";


const AdvertisersPage = () => {
const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ modal state

  const data = [
    {
      id: 201794,
      name: "Test Adv Demo",
      email: "demo@test11.com",
      company: "demo",
      contact: "",
      country: "",
      manager: "",
      status: "Approved"
    },
    {
      id: 144287,
      name: "test advertiser",
      email: "abc@gmail.com",
      company: "xyz",
      contact: "",
      country: "",
      manager: "",
      status: "Approved"
    },
    {
      id: 71991,
      name: "Test Advertiser 1",
      email: "demo-advertiser@offer18.com_xxxxx",
      company: "",
      contact: "+919996616785",
      country: "India",
      manager: "",
      status: "Approved"
    }
  ];

  return (
    <div className="of-layout">

      <Sidebar isCollapsed={isSidebarCollapsed} />

      <div className="of-main">

        <Header
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <div className="of-page">

          {/* Header */}
          <div className="of-page-header">
            <h2>Advertisers</h2>

            <div className="of-actions">
              {/* ✅ FIXED BUTTON */}
              <button
                className="btn primary"
                onClick={() => setShowModal(true)}
              >
                + Add Advertiser
              </button>

<button className="btn" onClick={() => navigate("/import")}>
  Import
</button>
              <input
                type="text"
                placeholder="Search"
                className="of-search"
              />

              <select className="of-select">
                <option>20</option>
                <option>50</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="of-table-wrapper">
            <table className="of-table">

              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>AdvertiserID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Company</th>
                  <th>Country</th>
                  <th>Manager</th>
                  <th>Status</th>
                  <th>Options</th>
                </tr>
              </thead>

              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td><input type="checkbox" /></td>
                    <td>{row.id}</td>
                    <td className="link">{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.contact}</td>
                    <td>{row.company}</td>
                    <td>{row.country}</td>
                    <td>{row.manager}</td>
                    <td>
                      <span className="status approved">Approved</span>
                    </td>
                    <td>
                      <button className="option-btn">⋮</button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>

        {/* ✅ MODAL RENDER */}
        {showModal && (
          <AddAdvertiserModal onClose={() => setShowModal(false)} />
        )}

      </div>

    </div>
  );
};

export default AdvertisersPage;