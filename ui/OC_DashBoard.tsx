import React from "react";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  return (
    <div className="content">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">
        Welcome back, Rekha. Here's your overview.
      </p>

      {/* Stat cards */}
      <div className="stat-grid">
        <div className="stat-card blue">
          <div className="stat-label">New Applications</div>
          <div className="stat-value blue">12</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Under Review</div>
          <div className="stat-value yellow">8</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Assigned to Batch</div>
          <div className="stat-value green">98</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">Pending Placement</div>
          <div className="stat-value orange">15</div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="section-title">Quick Actions</h2>
      <div className="quick-actions">
        <button className="qa-btn">
          <span className="qa-icon">+</span> New Application
        </button>
        <button className="qa-btn">
          <span className="qa-icon">→</span> Assign to Batches
        </button>
      </div>

      {/* Two-column layout */}
      <div className="two-col">
        {/* Recent Applications */}
        <div className="table-card">
          <div className="table-card-header">
            <span className="table-card-title">Recent Applications</span>
            <a className="view-all" href="#">
              View All →
            </a>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Course</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 500, color: "#18181B" }}>
                  Lakshmi Devi
                </td>
                <td>Stitching Basic</td>
                <td>
                  <span className="badge badge-blue">New</span>
                </td>
                <td>Mar 10, 2026</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 500, color: "#18181B" }}>Anita Rao</td>
                <td>Computer Fund.</td>
                <td>
                  <span className="badge badge-yellow">Under Review</span>
                </td>
                <td>Mar 9, 2026</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 500, color: "#18181B" }}>
                  Fatima Begum
                </td>
                <td>Beauty Basic</td>
                <td>
                  <span className="badge badge-green">Assigned</span>
                </td>
                <td>Mar 8, 2026</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Upcoming Follow-ups */}
        <div className="followup-card">
          <div className="followup-item">
            {/* Placeholder for follow-up items */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;