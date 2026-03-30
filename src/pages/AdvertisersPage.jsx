import React, { useState, useEffect, useRef } from "react";
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
  const [filterSearchTerm, setFilterSearchTerm] = useState("");

  const [openRowIndex, setOpenRowIndex] = useState(null);
  const [openFilterIndex, setOpenFilterIndex] = useState(null);

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Refs for dropdown positioning
  const filterButtonRef = useRef(null);
  const [filterDropdownPosition, setFilterDropdownPosition] = useState({ top: 0, right: 0 });

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

  // Column definitions with categories for better organization
  const columns = [
    { key: "checkbox", label: "Checkbox", category: "Selection" },
    { key: "advertiserId", label: "Advertiser ID", category: "Basic Info" },
    { key: "name", label: "Name", category: "Basic Info" },
    { key: "email", label: "Email", category: "Contact Info" },
    { key: "contact", label: "Contact", category: "Contact Info" },
    { key: "company", label: "Company", category: "Business Info" },
    { key: "country", label: "Country", category: "Location" },
    { key: "manager", label: "Manager", category: "Business Info" },
    { key: "address", label: "Address", category: "Location" },
    { key: "city", label: "City", category: "Location" },
    { key: "state", label: "State", category: "Location" },
    { key: "zipCode", label: "Zip Code", category: "Location" },
    { key: "createdOn", label: "Created On", category: "System Info" },
    { key: "status", label: "Status", category: "System Info" },
    { key: "options", label: "Options", category: "Actions" },
  ];

  // Filter columns based on search term
  const filteredColumns = columns.filter(column =>
    column.label.toLowerCase().includes(filterSearchTerm.toLowerCase()) ||
    column.category.toLowerCase().includes(filterSearchTerm.toLowerCase())
  );

  // Group columns by category
  const groupedColumns = filteredColumns.reduce((groups, column) => {
    if (!groups[column.category]) {
      groups[column.category] = [];
    }
    groups[column.category].push(column);
    return groups;
  }, {});

  // Update dropdown position when filter button is clicked
  const updateFilterDropdownPosition = () => {
    if (filterButtonRef.current) {
      const rect = filterButtonRef.current.getBoundingClientRect();
      setFilterDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right,
      });
    }
  };

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
          isActive: status === "Approved",
        }),
      });

      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
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
      // Only close row dropdown if clicking outside both the trigger and dropdown
      if (
        !e.target.closest(".action-trigger") &&
        !e.target.closest(".action-dropdown") &&
        !e.target.closest(".option-wrapper") &&
        !e.target.closest(".row-dropdown")
      ) {
        setOpenRowIndex(null);
      }
      // Only close filter dropdown if clicking outside both the filter button and filter dropdown
      if (
        !e.target.closest(".filter-icon-btn") &&
        !e.target.closest(".filter-dropdown")
      ) {
        setOpenFilterIndex(null);
        setFilterSearchTerm("");
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
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  // Select all columns
  const selectAllColumns = () => {
    const allSelected = {};
    columns.forEach((col) => {
      allSelected[col.key] = true;
    });
    setVisibleColumns(allSelected);
  };

  // Deselect all columns
  const deselectAllColumns = () => {
    const allDeselected = {};
    columns.forEach((col) => {
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
  const selectedColumnsCount = Object.values(visibleColumns).filter(
    (v) => v === true
  ).length;

  // Clear filter search
  const clearFilterSearch = () => {
    setFilterSearchTerm("");
  };

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
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
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

              <button className="btn small" onClick={() => navigate("/import")}>
                Import
              </button>

              <input
                type="text"
                placeholder="Search advertisers..."
                className="of-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Filters Icon Button */}
              <div className="filter-icon-wrapper">
                <button
                  ref={filterButtonRef}
                  className="filter-icon-btn modern"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (openFilterIndex === "columns") {
                      setOpenFilterIndex(null);
                      setFilterSearchTerm("");
                    } else {
                      updateFilterDropdownPosition();
                      setOpenFilterIndex("columns");
                    }
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
                  <div
                    className="filter-dropdown"
                    style={{
                      position: 'fixed',
                      top: `${filterDropdownPosition.top}px`,
                      right: `${filterDropdownPosition.right}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="filter-dropdown-header">
                      <span>Filters & Columns</span>
                    </div>

                    {/* Filters Section */}
                    <div className="dropdown-section">
                      <div className="dropdown-title">Search Columns</div>
                      <div className="filter-input-group">
                        <input
                          type="text"
                          placeholder="Search columns by name or category..."
                          className="filter-search"
                          value={filterSearchTerm}
                          onChange={(e) => setFilterSearchTerm(e.target.value)}
                          autoFocus
                        />
                       
                      </div>
                    </div>

                    {/* Columns Section */}
                    <div className="dropdown-section">
                      <div className="dropdown-title">
                        <span>Column Visibility</span>
                        <span className="status-badge active"></span>
                      </div>
                      <div className="columns-select-all">
                        <span className="columns-count">
                          {selectedColumnsCount} of {columns.length} selected
                        </span>
                        <div className="select-all-actions">
                          <button
                            onClick={selectAllColumns}
                            className="select-all-btn"
                          >
                            Select All
                          </button>
                          <button
                            onClick={deselectAllColumns}
                            className="deselect-all-btn"
                          >
                            Deselect All
                          </button>
                          <button onClick={resetColumns} className="reset-btn">
                            Reset
                          </button>
                        </div>
                      </div>
                      
                      <div className="columns-list">
                        {Object.entries(groupedColumns).map(([category, cols]) => (
                          <div key={category} className="column-category">
                            <div className="column-category-title">
                              {category} ({cols.length})
                            </div>
                            {cols.map((column) => (
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
                        ))}
                        
                        {filteredColumns.length === 0 && (
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '40px 20px',
                            color: '#9ca3af',
                            fontSize: '13px'
                          }}>
                            No columns found matching "{filterSearchTerm}"
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      className="submit-btn"
                      onClick={() => {
                        setOpenFilterIndex(null);
                        setFilterSearchTerm("");
                      }}
                    >
                      Apply Changes
                    </button>
                  </div>
                )}
              </div>

              <select className="of-select" defaultValue="20">
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
            </div>
          </div>

          {/* TABLE - Scrollable */}
          <div className="of-table-wrapper">
            <table className="of-table">
              <thead>
                <tr>
                  <th style={{ width: "40px" }}>
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
                            ✓ Select All
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
                            ✓ Select Approved
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
                            ⏳ Select Pending
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
                            ✗ Select Rejected
                          </div>
                        </div>

                        {/* STATUS */}
                        <div className="dropdown-section">
                          <div className="dropdown-title">
                            Bulk Status Update
                          </div>

                          <div
                            className="dropdown-item"
                            onClick={async () => {
                              if (selectedIds.length === 0) {
                                alert("Please select at least one advertiser");
                                return;
                              }

                              for (let id of selectedIds) {
                                await updateStatus(id, "Approved");
                              }

                              setSelectedIds([]);
                              setOpenRowIndex(null);
                              alert(`Approved ${selectedIds.length} advertiser(s)`);
                            }}
                          >
                            ✓ Approve Selected ({selectedIds.length})
                          </div>

                          <div
                            className="dropdown-item"
                            onClick={async () => {
                              if (selectedIds.length === 0) {
                                alert("Please select at least one advertiser");
                                return;
                              }

                              for (let id of selectedIds) {
                                await updateStatus(id, "Rejected");
                              }

                              setSelectedIds([]);
                              setOpenRowIndex(null);
                              alert(`Rejected ${selectedIds.length} advertiser(s)`);
                            }}
                          >
                            ✗ Reject Selected ({selectedIds.length})
                          </div>
                        </div>

                        {/* POSTBACK */}
                        <div className="dropdown-section">
                          <div className="dropdown-title">
                            Advertiser Postback Token
                          </div>

                          <div className="dropdown-item">🔒 Enable Token</div>
                          <div className="dropdown-item">🔄 Refresh Token</div>
                          <div className="dropdown-item">🗑 Disable Token</div>
                        </div>

                        {/* EMAIL */}
                        <div className="dropdown-section">
                          <div className="dropdown-title">Email Actions</div>

                          <div className="dropdown-item">
                            ✉ Send Bulk Email
                          </div>
                        </div>
                      </div>
                    )}
                  </th>

                  {/* Render visible columns dynamically */}
                  {visibleColumns.advertiserId && <th>Advertiser ID</th>}
                  {visibleColumns.name && <th>Name</th>}
                  {visibleColumns.email && <th>Email</th>}
                  {visibleColumns.contact && <th>Contact</th>}
                  {visibleColumns.company && <th>Company</th>}
                  {visibleColumns.country && <th>Country</th>}
                  {visibleColumns.manager && <th>Manager</th>}
                  {visibleColumns.address && <th>Address</th>}
                  {visibleColumns.city && <th>City</th>}
                  {visibleColumns.state && <th>State</th>}
                  {visibleColumns.zipCode && <th>Zip Code</th>}
                  {visibleColumns.createdOn && <th>Created On</th>}
                  {visibleColumns.status && <th>Status</th>}
                  {visibleColumns.options && <th>Options</th>}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="15"
                      style={{ textAlign: "center", padding: "60px" }}
                    >
                      <div className="spinner" style={{ margin: "0 auto" }}></div>
                      <p style={{ marginTop: "16px", color: "#6b7280" }}>Loading advertisers...</p>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="15"
                      style={{ textAlign: "center", padding: "60px" }}
                    >
                      <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
                      <p style={{ color: "#6b7280", fontSize: "16px" }}>No advertisers found</p>
                      <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "8px" }}>
                        Try adjusting your search or add a new advertiser
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, index) => (
                    <tr key={row.id}>
                      {/* Checkbox column */}
                      <td style={{ width: "40px", textAlign: "center" }}>
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
                          #{row.id}
                        </td>
                      )}

                      {visibleColumns.name && (
                        <td
                          className="link"
                          onClick={() => navigate(`/advertiser/${row.id}`)}
                          style={{ fontWeight: "500" }}
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
                                  onClick={() => {
                                    updateStatus(row.id, "Approved");
                                    setOpenRowIndex(null);
                                  }}
                                >
                                  ✓ Approve
                                </div>

                                <div
                                  className="dropdown-item"
                                  onClick={() => {
                                    updateStatus(row.id, "Rejected");
                                    setOpenRowIndex(null);
                                  }}
                                >
                                  ✕ Reject
                                </div>

                                <div className="dropdown-item">
                                  🔗 Postback URL
                                </div>
                                <div className="dropdown-item">📊 Reports</div>
                                <div className="dropdown-item">🎯 Offers</div>
                                <div className="dropdown-item">✉ Send Email</div>

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