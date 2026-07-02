import { useEffect, useState } from "react";
import axios from "axios";

function Accounts() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/leads", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      const grouped = {};

      res.data.forEach((lead) => {
        if (!grouped[lead.company]) {
          grouped[lead.company] = {
            company: lead.company,
            totalLeads: 0,
            active: 0,
            won: 0
          };
        }

        grouped[lead.company].totalLeads++;

        if (lead.status === "Won") {
          grouped[lead.company].won++;
        } else {
          grouped[lead.company].active++;
        }
      });

      setAccounts(Object.values(grouped));
    });
  }, []);

  return (
    <div className="px-1 py-2">
      <div className="mb-4">
        <h2 className="fw-bold tracking-tight text-dark mb-1">Company Accounts</h2>
        <p className="text-muted small mb-0">Overview metrics grouped by targeted client firms and organizations.</p>
      </div>

      <div className="card border-0 shadow-sm bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-dark">
            <thead style={{ backgroundColor: "#f8fafc" }}>
              <tr>
                <th className="text-muted fw-bold text-uppercase border-bottom-0 py-3 px-4" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>Company Name</th>
                <th className="text-muted fw-bold text-uppercase border-bottom-0 py-3 px-4" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>Total Associated Leads</th>
                <th className="text-muted fw-bold text-uppercase border-bottom-0 py-3 px-4" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>Active Opportunities</th>
                <th className="text-muted fw-bold text-uppercase border-bottom-0 py-3 px-4" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>Won Deals</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted small">
                    <i className="bi bi-inbox d-block fs-3 mb-2 text-opacity-50"></i>
                    No account parameters captured yet.
                  </td>
                </tr>
              ) : (
                accounts.map((acc, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td className="py-3 px-4 fw-semibold text-dark">{acc.company || "N/A"}</td>
                    <td className="py-3 px-4">
                      <span className="badge rounded-pill px-3 py-2 text-primary bg-light fw-medium">
                        {acc.totalLeads} Leads
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="badge rounded-pill px-3 py-2 text-warning bg-warning bg-opacity-10 fw-medium">
                        {acc.active} Active
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="badge rounded-pill px-3 py-2 text-success bg-success bg-opacity-10 fw-medium">
                        {acc.won} Settled
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Accounts;