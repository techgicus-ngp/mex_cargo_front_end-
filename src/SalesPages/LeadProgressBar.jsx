import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; // adjust path if needed
import { BASE_URL } from "../config"; // adjust path if needed
import styles from "./LeadProgressBar.module.css"; // CSS file (see below)

const LeadProgressBar = () => {
    const { leadId } = useParams();
  const [leadData, setLeadData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!leadId) {
      setError("No lead ID provided");
      setLoading(false);
      return;
    }

    const fetchLeadProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get(`${BASE_URL}/lead/${leadId}/track`);

        setLeadData(response.data);
      } catch (err) {
        console.error("Error fetching lead progress:", err);
        setError("Failed to load lead progress. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeadProgress();

    // Optional: auto-refresh every 60 seconds
    const interval = setInterval(fetchLeadProgress, 60000);
    return () => clearInterval(interval);
  }, [leadId]);

  if (loading) {
    return <div className={styles.loading}>Loading lead progress...</div>;
  }

  if (error || !leadData) {
    return <div className={styles.error}>{error || "No progress data available"}</div>;
  }

  const {
    leadReferenceNo = "N/A",
    currentStage = "Unknown",
    lastActivity = "N/A",
    progressSteps = [],
    timeline = [],
  } = leadData;

  // Calculate progress percentage
  const totalSteps = progressSteps.length;
  const completedSteps = progressSteps.filter((step) => step.completed).length;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Lead Tracking: {leadReferenceNo}</h2>
        <div className={styles.currentStage}>
          Current Stage: <strong>{currentStage}</strong>
        </div>
        <div className={styles.lastActivity}>
          Last Activity: <strong>{lastActivity}</strong>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressBarWrapper}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercentage}%` }}
            >
              <span className={styles.progressText}>{progressPercentage}%</span>
            </div>
          </div>
        </div>
        <div className={styles.progressLabel}>
          {completedSteps} of {totalSteps} steps completed
        </div>
      </div>

      {/* Progress Steps */}
      <div className={styles.stepsSection}>
        <h3 className={styles.sectionTitle}>Progress Steps</h3>
        {progressSteps.length > 0 ? (
          <div className={styles.stepsList}>
            {progressSteps.map((step, index) => (
              <div
                key={step.code || index}
                className={`${styles.stepItem} ${step.completed ? styles.completed : ""}`}
              >
                <div className={styles.stepCircle}>
                  {step.completed ? "✔" : index + 1}
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepLabel}>{step.label || step.code}</div>
                  {step.completed && step.completedAt && (
                    <div className={styles.stepDate}>
                      Completed: {new Date(step.completedAt).toLocaleString("en-IN")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noData}>No progress steps recorded yet</p>
        )}
      </div>

      {/* Timeline */}
      <div className={styles.timelineSection}>
        <h3 className={styles.sectionTitle}>Activity Timeline</h3>
        {timeline.length > 0 ? (
          <div className={styles.timeline}>
            {timeline.map((entry, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineAction}>{entry.action}</div>
                  {entry.remark && (
                    <div className={styles.timelineRemark}>{entry.remark}</div>
                  )}
                  <div className={styles.timelineMeta}>
                    <span>By: {entry.by || "System"}</span>
                    <span className={styles.separator}> • </span>
                    <span>{new Date(entry.at).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noData}>No timeline activity yet</p>
        )}
      </div>
    </div>
  );
};

export default LeadProgressBar;