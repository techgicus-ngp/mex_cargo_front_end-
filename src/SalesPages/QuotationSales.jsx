// import React, { useEffect, useState } from "react";

// import { BASE_URL } from "../config";
// import styles from "../styles/Quatation.module.css";
// import axiosInstance from "../utils/axiosInstance";
// function QuotationSales() {
//   const token = JSON.parse(localStorage.getItem("mexcargoUserData"))?.token;
//   const [executiveData, setExecutiveData] = useState([]);
//   const [quotations, setQuotations] = useState([]);
//   const [isExecutiveOpen, setIsExecutiveOpen] = useState(false);
//   const [searchQuatation, setSearchQuatation] = useState("");
//   useEffect(() => {
//     async function GetAllQuatation() {
//       try {
//         const response = await axiosInstance.get(
//           `${BASE_URL}/quatation/required/data`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         console.log(response.data);
//         setQuotations(response.data);
//       } catch (error) {
//         console.error("Error fetching quotations:", error);
//       }
//     }
//     GetAllQuatation();
//   }, []);

//   async function getAllExecutive(id) {
//     try {
//       const response = await axiosInstance.get(
//         `${BASE_URL}/quatation/${id}/purchaseexecutives`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setExecutiveData(response.data);
//       setIsExecutiveOpen(true);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   function formatTimeLocal(timeStr) {
//     if (!timeStr || typeof timeStr !== "string") {
//       return "Invalid time"; // Fallback value or handle as needed
//     }

//     const [hours, minutes, seconds] = timeStr.split(":");
//     const date = new Date();
//     date.setHours(+hours, +minutes, +seconds);

//     return date.toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     });
//   }

//   const filterQuatation = quotations.filter((quatation, index) => {
//     return quatation.source
//       .toLowerCase()
//       .includes(searchQuatation.toLocaleLowerCase());
//   });
//   return (
//     <>
//       <h2 className={styles.Quotationheading}>Quotation Sales</h2>

//       <div className={styles.quatation_sales_search_baar}>
//         <input
//           type="search"
//           value={searchQuatation}
//           onChange={(e) => setSearchQuatation(e.target.value)}
//           placeholder="Search by Source...."
//         />
//       </div>
//       <div className={styles.Quotationcontainer}>
//         <div className={styles.QuotationcardContainer}>
//           {quotations.length > 0 ? (
//             filterQuatation.map((quotation, index) => (
//               <div key={index} className={styles.quatationcard}>
//                 <div className={styles.cardHeader}>
//                   <h3>#{quotation.quatationReferenceNo}</h3>
//                   <p className={styles.leadRef}>
//                     Lead Ref: {quotation.leadReferenceNo}
//                   </p>
//                 </div>
//                 <div className={styles.cardBody}>
//                   <p>
//                     <strong>Source:</strong> {quotation.source}
//                   </p>
//                   <p>
//                     <strong>Destination:</strong> {quotation.destination}
//                   </p>
//                   <p>
//                     <strong>Commodity:</strong> {quotation.commodity}
//                   </p>
//                   <p>
//                     <strong>Commodity Size:</strong> {quotation.size}
//                   </p>
//                   <p>
//                     <strong>Commodity weight:</strong> {quotation.weight}
//                   </p>
//                   <p>
//                     <strong>Commodity Moving Date & Time:</strong>{" "}
//                     {new Date(quotation.movingDateAndTime).toLocaleString()}
//                   </p>

//                   <p>
//                     <strong>Car Transport:</strong> {quotation.carTransport}
//                   </p>
//                   <p>
//                     <strong>Car moving date:</strong>{" "}
//                     {quotation.carMovingDate
//                       ? new Date(quotation.carMovingDate).toLocaleDateString(
//                           "en-GB"
//                         )
//                       : "N/A"}
//                   </p>

//                   <p>
//                     <strong>Car moving Time:</strong>{" "}
//                     {quotation.carMovingTime
//                       ? formatTimeLocal(quotation.carMovingTime)
//                       : "N/A"}
//                   </p>

//                   <p>
//                     <strong>Quatation Required Date:</strong>{" "}
//                     {new Date(quotation.requiredQuatationDate).toDateString()}
//                   </p>
//                   <p>
//                     <strong>Quatation Required Time:</strong>{" "}
//                     {formatTimeLocal(quotation.requiredQuatationTime)}
//                   </p>
//                   <p>
//                     <strong>Other Services:</strong> {quotation.otherServices}
//                   </p>
//                   <p>
//                     <strong> Quatation Forward Date To Perches Team :</strong>{" "}
//                     {new Date(quotation.forwardQuatationDate).toDateString()}
//                   </p>
//                   <p>
//                     <strong> Quatation Forward Time To Perches Team:</strong>{" "}
//                     {formatTimeLocal(quotation.forwardQuationTime)}
//                   </p>
//                 </div>

//                 <button
//                   className={styles.button}
//                   onClick={() => getAllExecutive(quotation.quatationId)}
//                 >
//                   View Executive
//                 </button>
//               </div>
//             ))
//           ) : (
//             <p className={styles.noData}>No Quotations Available</p>
//           )}
//         </div>
//       </div>
//       {isExecutiveOpen && (
//         <div className={styles.executiveContainer}>
//           <div className={styles.executiveModal}>
//             <div className={styles.executiveHeader}>
//               <h3>Executive Details</h3>
//               <button
//                 className={styles.executiveCloseButton}
//                 onClick={() => setIsExecutiveOpen(false)}
//               >
//                 ×
//               </button>
//             </div>
//             <div className={styles.executiveBody}>
//               {executiveData.length > 0 ? (
//                 executiveData.map((executive, index) => (
//                   <div key={index} className={styles.executiveItem}>
//                     <p>
//                       <strong>Name :</strong> {executive.userName}
//                     </p>
//                     <p>
//                       <strong>Email :</strong> {executive.email}
//                     </p>
//                     <p>
//                       <strong>Mobile :</strong> {executive.mobileNumber}
//                     </p>
//                   </div>
//                 ))
//               ) : (
//                 <p>No Executive Data Available</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default QuotationSales;







import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import styles from "../styles/Quatation.module.css";
import axiosInstance from "../utils/axiosInstance";

function QuotationSales() {
  const token = JSON.parse(localStorage.getItem("mexcargoUserData"))?.token;

  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [searchSource, setSearchSource] = useState("");

  const [executives, setExecutives] = useState([]);
  const [showExecutiveModal, setShowExecutiveModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch quotations
  useEffect(() => {
    const fetchQuotations = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get(`${BASE_URL}/quatation/required/data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data || [];
        setQuotations(data);
        setFilteredQuotations(data);
      } catch (err) {
        console.error("Error fetching quotations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [token]);

  // Filter by source
  useEffect(() => {
    const term = searchSource.toLowerCase().trim();
    if (!term) {
      setFilteredQuotations(quotations);
      return;
    }
    const filtered = quotations.filter((q) =>
      (q.source || "").toLowerCase().includes(term)
    );
    setFilteredQuotations(filtered);
  }, [searchSource, quotations]);

  const fetchExecutives = async (id) => {
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}/quatation/${id}/purchaseexecutives`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExecutives(res.data || []);
      setShowExecutiveModal(true);
    } catch (err) {
      console.error(err);
      setExecutives([]);
    }
  };

  // ─── Format Helpers ────────────────────────────────────────
  const formatTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string" || !timeStr.includes(":")) return "—";
    const [h, m] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleDateString("en-GB") : "—");

  const formatDateTime = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) : "—";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quotation Requests – Sales Team</h1>

        <div className={styles.search}>
          <input
            type="search"
            placeholder="Search by Source..."
            value={searchSource}
            onChange={(e) => setSearchSource(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading quotations...</div>
      ) : filteredQuotations.length === 0 ? (
        <div className={styles.noData}>
          {searchSource ? "No matching records found" : "No quotations available"}
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.quotationTable}>
            <thead>
              <tr>
                <th>Ref #</th>
                <th>Lead Ref</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Commodity</th>
                <th>Size</th>
                <th>Weight</th>
                <th>Moving Date & Time</th>
                <th>Car Transport</th>
                <th>Car Moving Date</th>
                <th>Car Moving Time</th>
                <th>Required Quotation Date</th>
                <th>Required Quotation Time</th>
                <th>Other Services</th>
                <th>Forwarded Date</th>
                <th>Forwarded Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotations.map((q) => (
                <tr key={q.quatationId || q.quatationReferenceNo}>
                  <td className={styles.ref}>#{q.quatationReferenceNo}</td>
                  <td>{q.leadReferenceNo || "—"}</td>
                  <td>{q.source || "—"}</td>
                  <td>{q.destination || "—"}</td>
                  <td>{q.commodity || "—"}</td>
                  <td>{q.size || "—"}</td>
                  <td>{q.weight || "—"}</td>
                  <td>{formatDateTime(q.movingDateAndTime)}</td>
                  <td>{q.carTransport || "—"}</td>
                  <td>{q.carMovingDate ? formatDate(q.carMovingDate) : "—"}</td>
                  <td>{q.carMovingTime ? formatTime(q.carMovingTime) : "—"}</td>
                  <td>{formatDate(q.requiredQuatationDate)}</td>
                  <td>{formatTime(q.requiredQuatationTime)}</td>
                  <td>{q.otherServices || "—"}</td>
                  <td>{formatDate(q.forwardQuatationDate)}</td>
                  <td>{formatTime(q.forwardQuationTime)}</td>
                  <td>
                    <button
                      className={styles.actionBtn}
                      onClick={() => fetchExecutives(q.quatationId)}
                    >
                      View Executives
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Executive Modal */}
      {showExecutiveModal && (
        <div className={styles.modalOverlay} onClick={() => setShowExecutiveModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Purchase Executives Assigned</h3>
              <button className={styles.close} onClick={() => setShowExecutiveModal(false)}>
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              {executives.length === 0 ? (
                <p className={styles.noData}>No executives assigned to this quotation.</p>
              ) : (
                executives.map((ex, i) => (
                  <div key={i} className={styles.execCard}>
                    <div className={styles.execName}>{ex.userName}</div>
                    <div className={styles.execDetail}>Email: {ex.email}</div>
                    <div className={styles.execDetail}>Mobile: {ex.mobileNumber || "—"}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuotationSales;