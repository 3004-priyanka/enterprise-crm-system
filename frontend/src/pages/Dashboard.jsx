import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/leads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeads(res.data || []);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const totalLeads = leads ? leads.length : 0;
  const newLeads = leads ? leads.filter((l) => l.status === "New").length : 0;
  const wonDeals = leads ? leads.filter((l) => l.status === "Won").length : 0;
  const lostLeads = leads ? leads.filter((l) => l.status === "Lost").length : 0;
  const activeLeads = leads ? leads.filter((l) => l.status === "Contacted" || l.status === "Qualified").length : 0;

  const closedDeals = wonDeals + lostLeads;
  const conversionRate = closedDeals > 0 ? ((wonDeals / closedDeals) * 100).toFixed(1) : "0.0";

  const chartData = {
    labels: ["New Leads", "Contacted", "Qualified", "Won (Success)", "Lost"],
    datasets: [
      {
        label: "Number of Leads",
        data: [
          newLeads,
          leads ? leads.filter((l) => l.status === "Contacted").length : 0,
          leads ? leads.filter((l) => l.status === "Qualified").length : 0,
          wonDeals,
          lostLeads,
        ],
        backgroundColor: ["#eeebff", "#38bdf8", "#94a3b8", "#34d399", "#f87171"],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#f1f5f9" } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="px-1 py-2">
      {
        
      }
      <div className="mb-4">
        <h2 className="fw-bold tracking-tight text-dark mb-1">Dashboard & Overview</h2>
        <p className="text-muted small mb-0">See your overall performance and track your lead progress instantly.</p>
      </div>

      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
        </div>
      )}

      {/* 6 CARD GRID SYSTEM */}
      <div className="row g-3 mb-4">
        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card h-100 bg-white border-0 shadow-sm" style={{ borderLeft: "4px solid #4f46e5" }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-uppercase-tracking text-muted small d-block">All Leads</span>
                <h2 className="display-6 fw-bold mb-0 mt-1">{totalLeads}</h2>
              </div>
              <div className="bg-light p-2 rounded text-primary bg-opacity-10 d-flex align-items-center justify-content-center">
                <i className="bi bi-folder-fill fs-5"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card h-100 bg-white border-0 shadow-sm" style={{ borderLeft: "4px solid #0ea5e9" }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-uppercase-tracking text-muted small d-block">New</span>
                <h2 className="display-6 fw-bold mb-0 mt-1">{newLeads}</h2>
              </div>
              <div className="bg-info p-2 rounded text-info bg-opacity-10 d-flex align-items-center justify-content-center">
                <i className="bi bi-lightning-charge-fill fs-5"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card h-100 bg-white border-0 shadow-sm" style={{ borderLeft: "4px solid #10b981" }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-uppercase-tracking text-muted small d-block">Won Deals</span>
                <h2 className="display-6 fw-bold mb-0 mt-1">{wonDeals}</h2>
              </div>
              <div className="bg-success p-2 rounded text-success bg-opacity-10 d-flex align-items-center justify-content-center">
                <i className="bi bi-trophy-fill fs-5"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card h-100 bg-white border-0 shadow-sm" style={{ borderLeft: "4px solid #ef4444" }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-uppercase-tracking text-muted small d-block">Lost Deals</span>
                <h2 className="display-6 fw-bold mb-0 mt-1">{lostLeads}</h2>
              </div>
              <div className="bg-danger p-2 rounded text-danger bg-opacity-10 d-flex align-items-center justify-content-center">
                <i className="bi bi-hand-thumbs-down-fill fs-5"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card h-100 bg-white border-0 shadow-sm" style={{ borderLeft: "4px solid #f59e0b" }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-uppercase-tracking text-muted small d-block">In Progress</span>
                <h2 className="display-6 fw-bold mb-0 mt-1">{activeLeads}</h2>
              </div>
              <div className="bg-warning p-2 rounded text-warning bg-opacity-10 d-flex align-items-center justify-content-center">
                <i className="bi bi-activity fs-5"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card h-100 bg-white border-0 shadow-sm" style={{ borderLeft: "4px solid #8b5cf6" }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-uppercase-tracking text-muted small d-block">Success Rate</span>
                <h2 className="display-6 fw-bold mb-0 mt-1">{conversionRate}%</h2>
              </div>
              <div className="bg-purple-light p-2 rounded text-purple bg-opacity-10 d-flex align-items-center justify-content-center">
                <i className="bi bi-percent fs-5"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {

      }
      <div className="card border-0 shadow-sm p-4 bg-white">
        <div className="d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-bar-chart-line text-primary fs-5"></i>
          <h5 className="fw-bold text-dark m-0">Total Leads by Stage</h5>
        </div>
        {

        }
        <div style={{ height: "350px", position: "relative" }}>
          {chartData ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <div className="text-center py-5 text-muted small">Loading chart data...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;