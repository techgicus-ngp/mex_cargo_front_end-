import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../config";
import styles from "../styles/Leadmanegment.module.css";

const LeadFollowUpDashboard = () => {
    const { userId } = useParams();
  const [followUps, setFollowUps] = useState([]);
  const [activeFollowFilter, setActiveFollowFilter] = useState("all");
  const [loadingFollowUps, setLoadingFollowUps] = useState(false);

  const token = JSON.parse(localStorage.getItem("mexcargoUserData"))?.token;

  /* ===============================
     FETCH FOLLOWUPS FUNCTION
  =============================== */
  const fetchFollowUps = useCallback(
    async (type, ) => {
    //   const currentLeadId = passedLeadId || leadId;

      if (!token) {
        console.warn("No token found");
        return;
      }

    //   if (!currentLeadId && type === "all") {
    //     console.warn("Lead ID missing");
    //     return;
    //   }

      setLoadingFollowUps(true);
      setActiveFollowFilter(type);
      setFollowUps([]);

      let endpoint = "";

      switch (type) {
        // case "all":
        //   endpoint = `/get/lead/${currentLeadId}/followUp`;
        //   break;
        case "today":
          endpoint = `/user/${userId}/today-followups`;
          break;
        case "upcoming":
          endpoint = `/user/${userId}/upcoming-followups`;
          break;
        case "past":
          endpoint = `/user/${userId}/past-followups`;
          break;
        case "missed":
          endpoint = `/user/${userId}/missed-followups`;
          break;
        default:
          return;
      }

      try {
        const response = await axiosInstance.get(
          `${BASE_URL}${endpoint}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let data = response.data || [];

        if (data.followUps) {
          data = data.followUps;
        }

        setFollowUps(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(
          `Follow-ups fetch failed (${type}):`,
          error.response?.data || error.message
        );
        setFollowUps([]);
      } finally {
        setLoadingFollowUps(false);
      }
    },
    [ userId, token]
  );

  /* ===============================
     AUTO LOAD WHEN LEAD CHANGES
  =============================== */
//   useEffect(() => {
//     if (leadId) {
//       fetchFollowUps("all", leadId);
//     }
//   }, [ fetchFollowUps]);

  /* ===============================
     UI
  =============================== */
  return (
    <div>
      {/* FILTER BUTTONS */}
      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {["today", "upcoming", "past", "missed"].map((type) => (
            <button
              key={type}
              onClick={() =>
                type === "all"
                  ? fetchFollowUps(type)
                  : fetchFollowUps(type)
              }
              disabled={type === "all" }
              style={{
                padding: "10px 18px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background:
                  activeFollowFilter === type ? "#1976d2" : "#e0e0e0",
                color:
                  activeFollowFilter === type ? "white" : "black",
                fontWeight:
                  activeFollowFilter === type ? "bold" : "normal",
                minWidth: "100px",
                boxShadow:
                  activeFollowFilter === type
                    ? "0 2px 8px rgba(25, 118, 210, 0.3)"
                    : "none",
              }}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING STATE */}
      {loadingFollowUps ? (
        <p
          style={{
            textAlign: "center",
            margin: "40px 0",
            fontSize: "1.1rem",
            color: "#555",
          }}
        >
          Loading {activeFollowFilter} follow-ups...
        </p>
      ) : followUps.length > 0 ? (
        /* TABLE */
        <div style={{ overflowX: "auto", margin: "20px 0" }}>
          <table className={styles.lead_management_table}>
            <thead>
              <tr>
                <th>Lead Ref No</th>
                <th>User Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Commodity</th>
                <th>FollowUp Date</th>
                <th>Next FollowUp</th>
                <th>Outcome</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {followUps.map((item, index) => (
                <tr key={index}>
                  <td>{item.leadReferenceNo || item.leadRefNo || "—"}</td>
                  <td>{item.userName || item.contactPerson || "—"}</td>
                  <td>{item.contactNo || item.phone || "—"}</td>
                  <td>{item.mailId || item.email || "—"}</td>
                  <td>{item.source || "—"}</td>
                  <td>{item.destination || "—"}</td>
                  <td>{item.commodity || "—"}</td>
                  <td>
                    {item.followUpDate
                      ? new Date(item.followUpDate).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                  <td>
                    {item.nextFollowUpDate
                      ? new Date(item.nextFollowUpDate).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                  <td>
                    {item.outcome ||
                      item.followUpStatus ||
                      item.status ||
                      "—"}
                  </td>
                  <td>
                    {item.remark ||
                      item.followUpRemark ||
                      item.notes ||
                      "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* EMPTY STATE */
        <p
          style={{
            textAlign: "center",
            margin: "40px 0",
            fontSize: "1.1rem",
            color: "#777",
          }}
        >
          No {activeFollowFilter} follow-ups found.
        </p>
      )}
    </div>
  );
};

export default LeadFollowUpDashboard;
