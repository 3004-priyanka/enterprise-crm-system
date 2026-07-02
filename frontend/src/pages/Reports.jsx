import { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Reports() {
  const [stats, setStats] = useState({
    new: 0,
    contacted: 0,
    qualified: 0,
    won: 0,
    lost: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/leads", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      const data = res.data;

      setStats({
        new: data.filter(l => l.status === "New").length,
        contacted: data.filter(l => l.status === "Contacted").length,
        qualified: data.filter(l => l.status === "Qualified").length,
        won: data.filter(l => l.status === "Won").length,
        lost: data.filter(l => l.status === "Lost").length
      });
    });
  }, []);

  const colorPalette = [
    "#4f46e5", // Indigo
    "#0ea5e9", // Sky Blue
    "#64748b", // Slate Grey
    "#10b981", // Emerald Green
    "#ef4444"  // Rose Red
  ];

  const pieData = {
    labels: ["New", "Contacted", "Qualified", "Won", "Lost"],
    datasets: [
      {
        data: [stats.new, stats.contacted, stats.qualified, stats.won, stats.lost],
        backgroundColor: colorPalette,
        borderWidth: 2,
        borderColor: "#ffffff"
      }
    ]
  };

  const barData = {
    labels: ["New", "Contacted", "Qualified", "Won", "Lost"],
    datasets: [
      {
        label: "Lead Count",
        data: [stats.new, stats.contacted, stats.qualified, stats.won, stats.lost],
        backgroundColor: colorPalette,
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="px-1 py-2">
      <div className="mb-4">
        <h2 className="fw-bold tracking-tight text-dark mb-1">Reports & Analytics</h2>
        <p className="text-muted small mb-0">Deep-dive visual distributions of active customer acquisition channels.</p>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 bg-white h-100">
            <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-2">
              <i className="bi bi-pie-chart text-primary fs-5"></i>
              <h5 className="fw-bold m-0 text-dark">Lead Distribution</h5>
            </div>
            <div className="d-flex align-items-center justify-content-center m-auto p-2" style={{ maxWidth: "340px", width: "100%" }}>
              <Pie data={pieData} />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 bg-white h-100">
            <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-2">
              <i className="bi bi-graph-up-arrow text-success fs-5"></i>
              <h5 className="fw-bold m-0 text-dark">Lead Performance</h5>
            </div>
            <div className="p-1">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;