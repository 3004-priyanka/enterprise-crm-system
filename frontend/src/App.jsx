import { useState, useEffect } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";


import Login from "./components/Login";

// Style Imports
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import LeadsPage from "./pages/LeadsPage";
import Accounts from "./pages/Accounts";
import Reports from "./pages/Reports";
import ActivityPage from "./pages/ActivityPage";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  
 

  useEffect(() => {
    if (!isLoggedIn) return;

    const token = localStorage.getItem("token");
    
    axios.get("http://localhost:5000/leads", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      const data = res.data;
      setTotal(data.length);
      setNewLeads(data.filter((l) => l.status === "New").length);
      setWonLeads(data.filter((l) => l.status === "Won").length);
      setContactedLeads(data.filter((l) => l.status === "Contacted").length);
      setQualifiedLeads(data.filter((l) => l.status === "Qualified").length);
      setLostLeads(data.filter((l) => l.status === "Lost").length);

      const won = data.filter((l) => l.status === "Won").length;
      const lost = data.filter((l) => l.status === "Lost").length;
      const active = data.filter((l) => l.status !== "Won" && l.status !== "Lost").length;

      setClosedDeals(won + lost);
      setActiveLeads(active);

      if (data.length > 0) {
        setConversionRate(((won / data.length) * 100).toFixed(1));
      }
    })
    .catch(err => console.error("Error fetching CRM data:", err));
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  }
  
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
      <div className="min-vh-100 w-100 bg-light d-flex flex-column" style={{ overflowX: "hidden" }}>
        
        {/* Top Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm py-2 w-100">
          <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
          <span className="navbar-brand fw-bold text-white d-flex align-items-center">
            <i className="bi bi-building-gear me-2 text-primary"></i> Enterprise CRM
          </span>
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-sm-block">
              <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Authenticated as</small>
              <span className="text-white fw-semibold">{localStorage.getItem("name") || "User"}</span>
            </div>
            <button
              className="btn btn-sm btn-outline-danger px-3 rounded-pill"
              onClick={() => {
                localStorage.clear();
                setIsLoggedIn(false);
              }}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Body Wrapper */}
      <div className="d-flex flex-row flex-grow-1 w-100">
        
        {/* Navigation Sidebar */}
        <aside className="bg-dark border-top border-secondary border-opacity-25 p-3 text-white d-none d-md-block" style={{ width: "260px", minWidth: "260px" }}>
          <div className="sticky-top" style={{ top: "20px" }}>
            <p className="text-uppercase tracking-wider text-muted fw-bold small px-2 mb-3">Navigation</p>
            <ul className="nav flex-column gap-1">
              <li className="nav-item">
  <Link
    to="/"
    className="nav-link text-white d-flex align-items-center gap-2"
  >
    <i className="bi bi-speedometer2"></i>
    Dashboard
  </Link>
</li>

<li className="nav-item">
  <Link
    to="/leads"
    className="nav-link text-white d-flex align-items-center gap-2"
  >
    <i className="bi bi-people"></i>
    Leads Pipeline
  </Link>
</li>

<li className="nav-item">
  <Link
    to="/accounts"
    className="nav-link text-white d-flex align-items-center gap-2"
  >
    <i className="bi bi-person-lines-fill"></i>
    Accounts
  </Link>
</li>

<li className="nav-item">
  <Link
    to="/reports"
    className="nav-link text-white d-flex align-items-center gap-2"
  >
    <i className="bi bi-bar-chart"></i>
    Report Hub
  </Link>
</li>
          
            </ul>
          </div>
        </aside>

        {/* Content Workspace Area */}
        <main className="flex-grow-1 p-4 bg-light" style={{ minWidth: "0" }}>

        <Routes>

  <Route
    path="/"
    element={<Dashboard />}
  />

  <Route
    path="/leads"
    element={<LeadsPage />}
  />

  <Route
    path="/accounts"
    element={<Accounts />}
  />

  <Route
    path="/reports"
    element={<Reports />}
  />

  <Route
    path="/activity"
    element={<ActivityPage />}
  />

</Routes>
      
        </main>
      </div>
    </div>
   
  </>
  );
}

export default App;