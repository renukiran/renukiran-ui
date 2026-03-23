import React from "react";
import "./TrainerDashboard.css";

const TrainerDashboard: React.FC = () => {
  return (
    <div>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-name">Renukiran</div>
          <div className="brand-sub">WELFARE FOUNDATION</div>
        </div>
        <nav className="sidebar-nav">
          <a className="nav-item active" href="#">
            <span className="nav-icon">📊</span> Dashboard
          </a>
          <a className="nav-item" href="#">
            <span className="nav-icon">📚</span> My Batches
          </a>
          <a className="nav-item" href="#">
            <span className="nav-icon">🔔</span> Notifications
          </a>
        </nav>
        <div className="sidebar-footer">RWF LMS v1.0</div>
      </aside>

      {/* Top bar */}
      <header className="topbar">
        <div className="topbar-bell">
          🔔<span className="bell-badge">2</span>
        </div>
        <div className="topbar-avatar">SK</div>
      </header>

      {/* Main content */}
      <div className="main">
        <div className="content">
          <h1 className="welcome">Welcome, Suman!</h1>

          <h2 className="section-title">My Active Batches</h2>
          <div className="batch-cards">
            {/* Batch 1 */}
            <div className="batch-card">
              <div className="batch-card-title">Stitching Basic — Batch 1</div>
              <div className="batch-meta">
                <span className="meta-item">
                  <strong>18</strong> candidates
                </span>
                <span className="meta-item">Mar 1 – Jun 30, 2026</span>
              </div>
              <div className="progress-row">
                <span className="progress-label">Class Progress</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill blue"
                    style={{ width: "31.25%" }}
                  ></div>
                </div>
                <span className="progress-value">15 / 48</span>
              </div>
              <div className="progress-row">
                <span className="progress-label">Avg Attendance</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill green"
                    style={{ width: "84%" }}
                  ></div>
                </div>
                <span className="progress-value">84%</span>
              </div>
              <div className="attendance-status not-marked">
                Today's attendance: Not yet marked
              </div>
              <div className="card-actions">
                <button className="btn-green">Mark Attendance</button>
                <button className="btn-outline">View Batch</button>
              </div>
            </div>

            {/* Batch 2 */}
            <div className="batch-card">
              <div className="batch-card-title">Computer Fund. — Batch 2</div>
              <div className="batch-meta">
                <span className="meta-item">
                  <strong>19</strong> candidates
                </span>
                <span className="meta-item">Mar 1 – May 31, 2026</span>
              </div>
              <div className="progress-row">
                <span className="progress-label">Class Progress</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill blue"
                    style={{ width: "55%" }}
                  ></div>
                </div>
                <span className="progress-value">22 / 40</span>
              </div>
              <div className="progress-row">
                <span className="progress-label">Avg Attendance</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill green"
                    style={{ width: "91%" }}
                  ></div>
                </div>
                <span className="progress-value">91%</span>
              </div>
              <div className="attendance-status marked">
                Today's attendance: ✓ Marked
              </div>
              <div className="card-actions">
                <button className="btn-outline">View Batch</button>
              </div>
            </div>
          </div>

          <h2 className="section-title">Low Attendance Alerts</h2>
          <div className="alert-cards">
            <div className="alert-card">
              <span className="alert-icon">⚠️</span>
              <span className="alert-text">
                <strong>Kavita R.</strong> — Stitching B1
              </span>
              <span className="alert-pct">68%</span>
            </div>
            <div className="alert-card">
              <span className="alert-icon">⚠️</span>
              <span className="alert-text">
                <strong>Anita K.</strong> — Stitching B1
              </span>
              <span className="alert-pct">72%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;