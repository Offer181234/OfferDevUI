import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AddAdvertiserModal from "../components/AddAdvertiserModal";
import "../css/Advertisers.css";
import { useNavigate } from "react-router-dom";

const AdvertisersPage = () => {
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [openRowIndex, setOpenRowIndex] = useState(null);
  const [openFilterIndex, setOpenFilterIndex] = useState(null);

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    checkbox: true,
    advertiserId: true,
    name: true,
    email: true,
    contact: true,
    company: true,
    country: true,
    manager: true,
    address: true,
    city: true,
    state: true,
    zipCode: true,
    createdOn: true,
    status: true,
    options: true,
  });

  // Column definitions
  const columns = [
    { key: "checkbox", label: "Checkbox", type: "checkbox" },
    { key: "advertiserId", label: "AdvertiserID", type: "text" },
    { key: "name", label: "Name", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "contact", label: "Contact", type: "text" },
    { key: "company", label: "Company", type: "text" },
    { key: "country", label: "Country", type: "text" },
    { key: "manager", label: "Manager", type: "text" },
    { key: "address", label: "Address", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "state", label: "State", type: "text" },
    { key: "zipCode", label: "ZipCode", type: "text" },
    { key: "createdOn", label: "Created On", type: "date" },
    { key: "status", label: "Status", type: "status" },
    { key: "options", label: "Options", type: "options" },
  ];

  // API
  useEffect(() => {
    setLoading(true);
    fetch("https://localhost:7129/api/Advertisers")
      .then((res) => res.json())
      .then((resData) => {
        console.log(resData);
        const formatted = resData.map((item) => ({
          id: item.id,
          name: `${item.firstName} ${item.lastName}`,
          email: item.email,
          company: item.companyName || "-",
          contact: item.mobileNumber || "-",
          country: item.country || "-",
          manager: item.accountManagerId || "-",
          status: item.status || "Pending",
          address: item.address || "-",
          city: item.city || "-",
          state: item.state || "-",
          zipCode: item.zipCode || "-",
          createdOn: item.createdOn 
            ? new Date(item.createdOn).toLocaleDateString() 
            : "-",
          isActive: item.isActive,
        }));

        setData(formatted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setLoading(true);
      await fetch(`https://localhost:7129/api/Advertisers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          isActive: status === "Approved"
        })
      });

      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status } : item
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".action-trigger") && !e.target.closest(".option-wrapper")) {
        setOpenRowIndex(null);
      }
      if (!e.target.closest(".filter-icon-btn") && !e.target.closest(".filter-dropdown")) {
        setOpenFilterIndex(null);
      }
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const filteredData = data.filter((row) =>
    (row.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (row.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (row.company || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.id.toString().includes(searchTerm)
  );

  // Toggle column visibility
  const toggleColumn = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  // Select all columns
  const selectAllColumns = () => {
    const allSelected = {};
    columns.forEach(col => {
      allSelected[col.key] = true;
    });
    setVisibleColumns(allSelected);
  };

  // Deselect all columns
  const deselectAllColumns = () => {
    const allDeselected = {};
    columns.forEach(col => {
      allDeselected[col.key] = false;
    });
    setVisibleColumns(allDeselected);
  };

  // Reset to default columns
  const resetColumns = () => {
    setVisibleColumns({
      checkbox: true,
      advertiserId: true,
      name: true,
      email: true,
      contact: true,
      company: true,
      country: true,
      manager: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      createdOn: true,
      status: true,
      options: true,
    });
  };

  // Get selected columns count
  const selectedColumnsCount = Object.values(visibleColumns).filter(v => v === true).length;

  return (
    <div className="of-layout">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      {loading && (
        <div className="page-loader">
          <div className="spinner"></div>
        </div>
      )}
      <div className="of-main">
        <Header
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() =>
            setIsSidebarCollapsed(!isSidebarCollapsed)
          }
        />

        <div className="of-page">
          {/* HEADER */}
          <div className="of-page-header">
            <h2>Advertisers</h2>

            <div className="of-actions">
              <button
                className="btn primary small"
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Filters Icon Button - Positioned after search */}
              <div className="filter-icon-wrapper">
                <button 
  className="filter-icon-btn modern"
  onClick={(e) => {
    e.stopPropagation();
    setOpenFilterIndex(openFilterIndex === "columns" ? null : "columns");
  }}
>
  <svg viewBox="0 0 24 24" fill="none">
    <path 
      d="M3 5H21L14 13V19L10 21V13L3 5Z" 
      stroke="#3B82F6" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
</button>

                {openFilterIndex === "columns" && (
                  <div className="filter-dropdown">
                    <div className="filter-dropdown-header">
                      <span>Filters & Columns</span>
                    </div>
                    
                    {/* Filters Section */}
                    <div className="dropdown-section">
                      <div className="dropdown-title">Filters</div>
                      <div className="filter-input">
                        <input
                          type="text"
                          placeholder="Search filters..."
                          className="filter-search"
                        />
                      </div>
                    </div>

                    {/* Columns Section */}
                    <div className="dropdown-section">
                      <div className="dropdown-title">Columns</div>
                      <div className="columns-select-all">
                        <span className="columns-count">{selectedColumnsCount} of {columns.length} selected</span>
                        <div className="select-all-actions">
                          <button onClick={selectAllColumns} className="select-all-btn">Select All</button>
                          <button onClick={deselectAllColumns} className="deselect-all-btn">Deselect All</button>
                          <button onClick={resetColumns} className="reset-btn">Reset</button>
                        </div>
                      </div>
                      <div className="columns-list">
                        {columns.map(column => (
                          <label key={column.key} className="column-checkbox">
                            <input
                              type="checkbox"
                              checked={visibleColumns[column.key]}
                              onChange={() => toggleColumn(column.key)}
                            />
                            <span>{column.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button className="submit-btn" onClick={() => setOpenFilterIndex(null)}>
                      Submit
                    </button>
                  </div>
                )}
              </div>

              <select className="of-select">
                <option>20</option>
                <option>50</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="of-table-wrapper">
            <table className="of-table">
              <thead>
                <tr>
                  {/* Header Action Dropdown - Keeping original functionality */}
                  <th>
                    <div
                      className="action-trigger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenRowIndex(
                          openRowIndex === "header" ? null : "header"
                        );
                      }}
                    >
                      Action ▼
                    </div>

                    {openRowIndex === "header" && (
                      <div
                        className="action-dropdown"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* SELECT */}
                        <div className="dropdown-section">
                          <div className="dropdown-title">
                            Advertiser Select
                          </div>

                          <div
                            className="dropdown-item"
                            onClick={() =>
                              setSelectedIds(data.map((d) => d.id))
                            }
                          >
                            Select All
                          </div>

                          <div
                            className="dropdown-item"
                            onClick={() =>
                              setSelectedIds(
                                data
                                  .filter((d) => d.status === "Approved")
                                  .map((d) => d.id)
                              )
                            }
                          >
                            Select Approved
                          </div>

                          <div
                            className="dropdown-item"
                            onClick={() =>
                              setSelectedIds(
                                data
                                  .filter((d) => d.status === "Pending")
                                  .map((d) => d.id)
                              )
                            }
                          >
                            Select Pending
                          </div>

                          <div
                            className="dropdown-item"
                            onClick={() =>
                              setSelectedIds(
                                data
                                  .filter((d) => d.status === "Rejected")
                                  .map((d) => d.id)
                              )
                            }
                          >
                            Select Rejected
                          </div>
                        </div>

                        {/* STATUS */}
                        <div className="dropdown-section">
                          <div className="dropdown-title">
                            Advertiser Status
                          </div>

                          <div
                            className="dropdown-item"
                            onClick={async () => {
                              if (selectedIds.length === 0) {
                                alert("Please select advertiser");
                                return;
                              }

                              for (let id of selectedIds) {
                                await updateStatus(id, "Approved");
                              }

                              setSelectedIds([]);
                              setOpenRowIndex(null);
                            }}
                          >
                            ✓ Approve
                          </div>

                          <div
                            className="dropdown-item"
                            onClick={async () => {
                              if (selectedIds.length === 0) {
                                alert("Please select advertiser");
                                return;
                              }

                              for (let id of selectedIds) {
                                await updateStatus(id, "Rejected");
                              }

                              setSelectedIds([]);
                              setOpenRowIndex(null);
                            }}
                          >
                            ✕ Reject
                          </div>
                        </div>

                        {/* POSTBACK */}
                        <div className="dropdown-section">
                          <div className="dropdown-title">
                            Advertiser Postback Token
                          </div>

                          <div className="dropdown-item">🔒 Enable</div>
                          <div className="dropdown-item">🔄 Refresh</div>
                          <div className="dropdown-item">🗑 Disable</div>
                        </div>

                        {/* EMAIL */}
                        <div className="dropdown-section">
                          <div className="dropdown-title">Email</div>

                          <div className="dropdown-item">
                            ✉ Send Email
                          </div>
                        </div>
                      </div>
                    )}
                  </th>

                  {/* Render visible columns dynamically */}
                  {visibleColumns.advertiserId && <th>AdvertiserID</th>}
                  {visibleColumns.name && <th>Name</th>}
                  {visibleColumns.email && <th>Email</th>}
                  {visibleColumns.contact && <th>Contact</th>}
                  {visibleColumns.company && <th>Company</th>}
                  {visibleColumns.country && <th>Country</th>}
                  {visibleColumns.manager && <th>Manager</th>}
                  {visibleColumns.address && <th>Address</th>}
                  {visibleColumns.city && <th>City</th>}
                  {visibleColumns.state && <th>State</th>}
                  {visibleColumns.zipCode && <th>ZipCode</th>}
                  {visibleColumns.createdOn && <th>Created On</th>}
                  {visibleColumns.status && <th>Status</th>}
                  {visibleColumns.options && <th>Options</th>}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="15" style={{ textAlign: "center" }}>
                      Loading...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="15" style={{ textAlign: "center" }}>
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, index) => (
                    <tr key={index}>
                      {/* Checkbox column - Keeping original functionality */}
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(row.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds((prev) => [...prev, row.id]);
                            } else {
                              setSelectedIds((prev) =>
                                prev.filter((id) => id !== row.id)
                              );
                            }
                          }}
                        />
                      </td>

                      {visibleColumns.advertiserId && (
                        <td
                          className="link"
                          onClick={() => navigate(`/advertiser/${row.id}`)}
                        >
                          {row.id}
                        </td>
                      )}
                      
                      {visibleColumns.name && (
                        <td
                          className="link"
                          onClick={() => navigate(`/advertiser/${row.id}`)}
                        >
                          {row.name}
                        </td>
                      )}
                      
                      {visibleColumns.email && (
                        <td
                          className="link"
                          onClick={() => navigate(`/advertiser/${row.id}`)}
                        >
                          {row.email}
                        </td>
                      )}
                      
                      {visibleColumns.contact && <td>{row.contact}</td>}
                      {visibleColumns.company && <td>{row.company}</td>}
                      {visibleColumns.country && <td>{row.country}</td>}
                      {visibleColumns.manager && <td>{row.manager}</td>}
                      {visibleColumns.address && <td>{row.address}</td>}
                      {visibleColumns.city && <td>{row.city}</td>}
                      {visibleColumns.state && <td>{row.state}</td>}
                      {visibleColumns.zipCode && <td>{row.zipCode}</td>}
                      {visibleColumns.createdOn && <td>{row.createdOn}</td>}

                      {visibleColumns.status && (
                        <td>
                          <span
                            className={`status ${
                              row.status === "Approved"
                                ? "approved"
                                : row.status === "Rejected"
                                ? "rejected"
                                : "pending"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      )}

                      {visibleColumns.options && (
                        <td>
                          <div className="option-wrapper">
                            <button
                              className="option-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenRowIndex(
                                  openRowIndex === index ? null : index
                                );
                              }}
                            >
                              ⋮
                            </button>

                            {openRowIndex === index && (
                              <div className="row-dropdown">
                                <div
                                  className="dropdown-item"
                                  onClick={() =>
                                    updateStatus(row.id, "Approved")
                                  }
                                >
                                  ✓ Approve
                                </div>

                                <div
                                  className="dropdown-item"
                                  onClick={() =>
                                    updateStatus(row.id, "Rejected")
                                  }
                                >
                                  ✕ Reject
                                </div>

                                <div className="dropdown-item">
                                  🔗 Advertiser Postback URL
                                </div>
                                <div className="dropdown-item">📊 Reports</div>
                                <div className="dropdown-item">🎯 Offers</div>
                                <div className="dropdown-item">✉ Email</div>

                                <div className="dropdown-item danger">
                                  🗑 Delete
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <AddAdvertiserModal onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
};

export default AdvertisersPage;