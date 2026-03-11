import React, { useEffect, useState } from "react";
import "../styles/Addmaster.css";
import axiosInstance from "../utils/axiosInstance";
import { BASE_URL } from "../config";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";

function AddMaster() {
  const token = JSON.parse(localStorage.getItem("mexcargoUserData"))?.token;

  const [refreshKey, setRefreshKey] = useState(0);
  const [masterData, setMasterData] = useState([]);
  const [filteredMasterData, setFilteredMasterData] = useState([]);

  // Form states
  const [associateCode, setAssociateCode] = useState("");
  const [serviceSector, setServiceSector] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [grade, setGrade] = useState(0);
  const [location, setLocation] = useState("");
  const [hub, setHub] = useState("");
  const [state, setState] = useState("");

  // Search/filter state
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all master data
  useEffect(() => {
    const getAllMaster = async () => {
      try {
        const response = await axiosInstance.get(`${BASE_URL}/get/master/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data || [];
        setMasterData(data);
        setFilteredMasterData(data); // initially show all
      } catch (error) {
        console.error("Error fetching master list:", error);
      }
    };
    if (token) getAllMaster();
  }, [refreshKey, token]);

  // Real-time search/filter logic
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMasterData(masterData);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase().trim();

    const filtered = masterData.filter((master) => {
      return (
        (master.associateCode || "").toLowerCase().includes(lowerSearch) ||
        (master.serviceSector || "").toLowerCase().includes(lowerSearch) ||
        (master.companyName || "").toLowerCase().includes(lowerSearch) ||
        (master.contactName || "").toLowerCase().includes(lowerSearch) ||
        (master.contactNumber || "").toLowerCase().includes(lowerSearch) ||
        (master.emailId || "").toLowerCase().includes(lowerSearch) ||
        (master.location || "").toLowerCase().includes(lowerSearch) ||
        (master.hub || "").toLowerCase().includes(lowerSearch) ||
        (master.state || "").toLowerCase().includes(lowerSearch) ||
        String(master.grade || "").includes(lowerSearch) // grade as string search
      );
    });

    setFilteredMasterData(filtered);
  }, [searchTerm, masterData]);

  // Add new master
  async function handleAddMaster(e) {
    e.preventDefault();
    const formData = {
      associateCode,
      serviceSector,
      companyName,
      contactName,
      contactNumber,
      emailId,
      grade,
      location,
      hub,
      state,
    };

    try {
      const response = await axiosInstance.post(`${BASE_URL}/add/master`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Master added successfully.");
        setRefreshKey((prev) => prev + 1);

        // Clear form
        setAssociateCode("");
        setServiceSector("");
        setCompanyName("");
        setContactName("");
        setContactNumber("");
        setEmailId("");
        setGrade(0);
        setLocation("");
        setHub("");
        setState("");
      }
    } catch (error) {
      console.error("Error adding master:", error);
      alert("Failed to add master. Check console for details.");
    }
  }

  // Delete master
  async function handleDeleteMater(id) {
    if (!window.confirm("Are you sure you want to delete this master entry?")) return;

    try {
      const response = await axiosInstance.delete(`${BASE_URL}/delete/master/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Master deleted successfully.");
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete master.");
    }
  }

  return (
    <>
      {/* Master Registration Form */}
      <div className="masterForm-container">
        <h2 className="Master-form-title">Master Registration Form</h2>
        <form className="masterForm" onSubmit={handleAddMaster}>
          <div className="master-form-group">
            <label>Associate Code:</label>
            <input type="text" value={associateCode} onChange={(e) => setAssociateCode(e.target.value)} />
          </div>

          <div className="master-form-group">
            <label>Service Sector:</label>
            <input type="text" value={serviceSector} onChange={(e) => setServiceSector(e.target.value)} />
          </div>

          <div className="master-form-group">
            <label>Company Name:</label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>

          <div className="master-form-group">
            <label>Contact Name:</label>
            <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </div>

          <div className="master-form-group">
            <label>Contact Number:</label>
            <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
          </div>

          <div className="master-form-group">
            <label>Email ID:</label>
            <input type="email" value={emailId} onChange={(e) => setEmailId(e.target.value)} />
          </div>

          <div className="master-form-group">
            <label>Location:</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="master-form-group">
            <label>Hub:</label>
            <input type="text" value={hub} onChange={(e) => setHub(e.target.value)} />
          </div>

          <div className="master-form-group">
            <label>State:</label>
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
          </div>

          <div className="master-form-group">
            <label>Grade:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} onClick={() => setGrade(star)}>
                  {star <= grade ? (
                    <MdOutlineStar className="star selected" />
                  ) : (
                    <MdOutlineStarBorder className="star" />
                  )}
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="master-submit-btn">
            Submit
          </button>
        </form>
      </div>

      {/* Master List with Search Filter */}
      <div className="master-list-container">
        <div className="master-list-header">
          <h2 className="master-list-title">Master List</h2>

          {/* Search Input */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by any field (name, code, email, etc.)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="master-search-input"
            />
          </div>
        </div>

        {filteredMasterData.length > 0 ? (
          <div className="mater_table_responsive">
            <table className="master_table">
              <thead>
                <tr>
                  <th>Associate Code</th>
                  <th>Service Sector</th>
                  <th>Company Name</th>
                  <th>Contact Name</th>
                  <th>Contact Number</th>
                  <th>Email ID</th>
                  <th>Grade</th>
                  <th>Location</th>
                  <th>Hub</th>
                  <th>State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMasterData.map((master) => (
                  <tr key={master.masterId}>
                    <td>{master.associateCode}</td>
                    <td>{master.serviceSector}</td>
                    <td>{master.companyName}</td>
                    <td>{master.contactName}</td>
                    <td>{master.contactNumber}</td>
                    <td>{master.emailId}</td>
                    <td>{`${master.grade} star${master.grade !== 1 ? "s" : ""}`}</td>
                    <td>{master.location}</td>
                    <td>{master.hub}</td>
                    <td>{master.state}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteMater(master.masterId)}
                        className="delete_master_button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-results">
            <p>No matching records found.</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="clear-search-btn"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default AddMaster;