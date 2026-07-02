import { useState, useEffect } from "react";
import axios from "axios";

function ActivityLogs() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/activities")
      .then((res) => {
        
        const sorted = res.data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        setActivities(sorted);
      })
      .catch((err) => console.log(err));
  }, []);

  const getActivityIconAndClass = (action) => {
    const text = action ? action.toLowerCase() : "";
    if (text.includes("email")) {
      return { icon: "bi-envelope-check-fill text-success", bg: "#ecfdf5" };
    } else if (text.includes("delete")) {
      return { icon: "bi-trash-fill text-danger", bg: "#fef2f2" };
    } else if (text.includes("update") || text.includes("status")) {
      return { icon: "bi-arrow-left-right text-warning", bg: "#fffbpb", color: "#d97706" };
    }
    return { icon: "bi-lightning-charge-fill text-primary", bg: "#eeebff" };
  };

  return (
    <div className="p-0 border-0 bg-transparent">
      {
    }
      <div className="overflow-auto custom-activity-scrollbar" style={{ maxHeight: "280px" }}>
        {activities.length === 0 ? (
          <div className="text-center py-4 text-muted small">
            <i className="bi bi-clock-history d-block fs-4 mb-1 text-opacity-20"></i>
            No system audit configurations registered inside this window sequence.
          </div>
        ) : (
          <div className="table-responsive border-0">
            <table className="table align-middle mb-0">
              <thead className="position-sticky top-0 bg-white" style={{ zIndex: "1" }}>
                <tr className="border-bottom">
                  <th className="text-muted fw-bold text-uppercase border-bottom-0 py-2 px-3 bg-white" style={{ fontSize: "0.72rem", letterSpacing: "0.04em" }}>Client Targeted</th>
                  <th className="text-muted fw-bold text-uppercase border-bottom-0 py-2 px-3 bg-white" style={{ fontSize: "0.72rem", letterSpacing: "0.04em" }}>Executed Operation</th>
                  <th className="text-muted fw-bold text-uppercase border-bottom-0 py-2 px-3 bg-white text-end" style={{ fontSize: "0.72rem", letterSpacing: "0.04em" }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => {
                  const design = getActivityIconAndClass(activity.action);
                  return (
                    <tr key={activity._id} className="border-bottom" style={{ borderColor: "#f1f5f9" }}>
                      <td className="py-2.5 px-3 fw-semibold text-dark" style={{ fontSize: "0.85rem" }}>
                        {activity.leadName || "System Core"}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="d-inline-flex align-items-center gap-2 px-2.5 py-1 rounded" style={{ backgroundColor: design.bg, fontSize: "0.8rem", fontWeight: "500" }}>
                          <i className={`bi ${design.icon.split(" ")[0]} ${design.icon.split(" ")[1]}`}></i>
                          <span style={{ color: design.color || "inherit" }}>{activity.action}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-end text-muted small" style={{ fontSize: "0.8rem" }}>
                        {new Date(activity.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} &middot; {new Date(activity.createdAt).toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityLogs;