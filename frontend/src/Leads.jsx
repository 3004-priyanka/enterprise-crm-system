import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Leads(){
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [phone,setPhone]=useState("");
  const [company,setCompany]=useState("");

  const [leads,setLeads]=useState([]);
  const [editId,setEditId]=useState(null);
  const [search,setSearch]=useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const getLeads = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/leads",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setLeads(res.data);
    } catch (error) {
      console.log("ERROR:", error);
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    getLeads();
  },[]);

  // Pure browser side CSV engine
  const exportToCSV = () => {
    if (leads.length === 0) {
      toast.warning("No operational data available to export.");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Company", "Status", "Database Entry ID"];

    const rows = leads.map(lead => [
      `"${lead.name.replace(/"/g, '""')}"`,
      `"${lead.email.replace(/"/g, '""')}"`,
      `"${(lead.phone || '').replace(/"/g, '""')}"`,
      `"${(lead.company || '').replace(/"/g, '""')}"`,
      `"${lead.status}"`,
      `"${lead._id}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CRM_Pipeline_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
    
    toast.success("Excel CSV Pipeline Report Exported!");
  };

  const addLead=()=>{
    if (!name || !email || !company) {
      toast.warning("Please fill out all primary operational fields.");
      return;
    }

    if(editId){
      axios.put(
        `http://localhost:5000/leads/${editId}`,
        { name, email, phone, company },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )
      .then(()=>{
        toast.success("Lead Updated Successfully");
        getLeads();
        setEditId(null);
        setName(""); setEmail(""); setPhone(""); setCompany("");
      });
    } else {
      axios.post(
        "http://localhost:5000/leads",
        { name, email, phone, company },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )
      .then(()=>{
        toast.success("Lead Added Successfully");
        getLeads();
        setName(""); setEmail(""); setPhone(""); setCompany("");
      });
    }
  };

  const deleteLead = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this lead?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/leads/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      toast.success("Lead Deleted Successfully");
      getLeads();
    } catch (error) {
      toast.error("Failed to delete lead");
    }
  };

  const sendEmail = async (lead) => {
    try {
      await axios.post(
        "http://localhost:5000/activities/email",
        { leadName: lead.name, email: lead.email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      toast.success("Email Sent Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const editLead = (lead)=>{
    setEditId(lead._id);
    setName(lead.name);
    setEmail(lead.email);
    setPhone(lead.phone);
    setCompany(lead.company);
  };

  const updateStatus = (id, status) => {
    axios.put(
      `http://localhost:5000/leads/${id}`,
      { status: status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    )
    .then(() => {
      getLeads();
      toast.info(`Status modified to ${status}`);
    });
  };

  const getStatusBadgeStyle = (status) => {
    switch(status) {
      case "New": return { backgroundColor: "#eeebff", color: "#4f46e5", fontWeight: "600" };
      case "Contacted": return { backgroundColor: "#e0f2fe", color: "#0ea5e9", fontWeight: "600" };
      case "Qualified": return { backgroundColor: "#f1f5f9", color: "#64748b", fontWeight: "600" };
      case "Won": return { backgroundColor: "#ecfdf5", color: "#10b981", fontWeight: "600" };
      case "Lost": return { backgroundColor: "#fef2f2", color: "#ef4444", fontWeight: "600" };
      default: return {};
    }
  };

  // Helper utility to isolate the array filtering logic so it stays consistent
  const getFilteredLeads = () => {
    return leads.filter((lead) => {
      const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) || 
                            lead.company.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  return(
    <div className="px-1 py-2">
      <div className="mb-4">
        <h2 className="fw-bold tracking-tight text-dark mb-1">Leads Pipeline</h2>
        <p className="text-muted small mb-0">Capture new business entries and manage active transitions directly inside the pipeline grid.</p>
      </div>

      <div className="row g-4">
        {/* Left Form Grid Block */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 bg-white sticky-top" style={{ top: "90px", zIndex: "10" }}>
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
              <i className={`bi ${editId ? "bi-pencil-square text-warning" : "bi-plus-circle text-primary"} fs-5`}></i>
              <h5 className="fw-bold m-0 text-dark">{editId ? "Modify Lead Parameters" : "Intake New Lead"}</h5>
            </div>
            
            <div className="mb-3">
              <label className="text-muted small fw-semibold text-uppercase mb-1 d-block">Contact Name</label>
              <input className="form-control bg-light border-0 py-2 px-3" style={{ fontSize: "0.9rem" }} placeholder="John Doe" value={name} onChange={(e)=>setName(e.target.value)} />
            </div>

            <div className="mb-3">
              <label className="text-muted small fw-semibold text-uppercase mb-1 d-block">Email Address</label>
              <input type="email" className="form-control bg-light border-0 py-2 px-3" style={{ fontSize: "0.9rem" }} placeholder="john@company.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>

            <div className="mb-3">
              <label className="text-muted small fw-semibold text-uppercase mb-1 d-block">Phone Number</label>
              <input className="form-control bg-light border-0 py-2 px-3" style={{ fontSize: "0.9rem" }} placeholder="+1 (555) 000-0000" value={phone} onChange={(e)=>setPhone(e.target.value)} />
            </div>

            <div className="mb-4">
              <label className="text-muted small fw-semibold text-uppercase mb-1 d-block">Corporate Entity</label>
              <input className="form-control bg-light border-0 py-2 px-3" style={{ fontSize: "0.9rem" }} placeholder="Acme Corp LLC" value={company} onChange={(e)=>setCompany(e.target.value)} />
            </div>

            <button className="btn w-100 py-2 fw-semibold border-0 text-white" style={{ backgroundColor: editId ? "#f59e0b" : "#4f46e5", borderRadius: "8px", fontSize: "0.9rem" }} onClick={addLead}>
              {editId ? "Apply Modifications" : "Save Record Entry"}
            </button>
            {editId && (
              <button className="btn btn-link w-100 text-muted mt-2 btn-sm text-decoration-none" onClick={() => { setEditId(null); setName(""); setEmail(""); setPhone(""); setCompany(""); }}>
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {/* Right Active Grid Pipeline Matrix */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 bg-white mb-4">
            
            {/* Search, Filter, and Export Button Row */}
            <div className="row g-2 mb-3 align-items-center">
              <div className="col-md-5">
                <div className="input-group">
                  <span className="input-group-text bg-light border-0 text-muted"><i className="bi bi-search"></i></span>
                  <input className="form-control bg-light border-0 py-2" placeholder="Search accounts by name..." value={search} onChange={(e)=>setSearch(e.target.value)} />
                </div>
              </div>
              <div className="col-md-4">
                <select className="form-select bg-light border-0 py-2 fw-medium text-dark" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
                  <option value="All">All Pipeline Stages</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <div className="col-md-3">
                <button 
                  className="btn btn-outline-secondary w-100 py-2 border-dashed d-flex align-items-center justify-content-center gap-2 fw-semibold shadow-sm" 
                  style={{ border: "1px dashed #cbd5e1", fontSize: "0.85rem", borderRadius: "8px", color: "#475569" }}
                  onClick={exportToCSV}
                >
                  <i className="bi bi-download text-primary"></i> Export CSV
                </button>
              </div>
            </div>

            {/* UI Polish Element: Small Result Counter Badge */}
            <div className="d-flex justify-content-between align-items-center mb-2 px-1">
              <span className="text-muted" style={{ fontSize: "0.82rem" }}>
                Showing <strong>{getFilteredLeads().length}</strong> out of <strong>{leads.length}</strong> total pipeline items
              </span>
            </div>

            {loading && (
              <div className="text-center my-4">
                <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
              </div>
            )}

            <div className="table-responsive border-0">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th className="border-bottom-0 text-muted text-uppercase small tracking-wider px-3">Contact</th>
                    <th className="border-bottom-0 text-muted text-uppercase small tracking-wider px-3">Company</th>
                    <th className="border-bottom-0 text-muted text-uppercase small tracking-wider px-2">Pipeline Stage</th>
                    <th className="border-bottom-0 text-muted text-uppercase small tracking-wider text-end px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredLeads().length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted small">
                          <i className="bi bi-folder-x d-block fs-3 mb-2 text-muted text-opacity-25"></i>
                          No corresponding pipeline records identified.
                        </td>
                      </tr>
                    ) : (
                    getFilteredLeads().map((lead) => (
                      <tr key={lead._id} className="align-middle border-bottom" style={{ borderColor: "#f1f5f9" }}>
                        <td className="px-3 py-3">
                          <div className="fw-semibold text-dark mb-0" style={{ fontSize: "0.92rem" }}>{lead.name}</div>
                          <div className="text-muted small d-flex flex-column" style={{ fontSize: "0.82rem" }}>
                            <span><i className="bi bi-envelope me-1"></i>{lead.email}</span>
                            {lead.phone && <span><i className="bi bi-telephone me-1"></i>{lead.phone}</span>}
                          </div>
                        </td>
                        <td className="px-3 text-dark fw-medium" style={{ fontSize: "0.9rem" }}>{lead.company || "N/A"}</td>
                        <td className="px-2">
                          <select 
                            className="form-select border-0 rounded-pill px-3 py-1.5 small shadow-none" 
                            style={getStatusBadgeStyle(lead.status)}
                            value={lead.status} 
                            onChange={(e)=>updateStatus(lead._id,e.target.value)}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Won">Won</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </td>
                        <td className="px-3 text-end">
                          <div className="d-inline-flex gap-1">
                            <button className="btn btn-light btn-sm text-warning bg-opacity-20 border-0 p-2 d-flex align-items-center justify-content-center rounded" title="Edit Parameters" onClick={()=>editLead(lead)}>
                              <i className="bi bi-pencil-square fs-6"></i>
                            </button>
                            <button className="btn btn-light btn-sm text-success bg-opacity-20 border-0 p-2 d-flex align-items-center justify-content-center rounded" title="Send Fast Dispatch Email" onClick={() => sendEmail(lead)}>
                              <i className="bi bi-envelope-at fs-6"></i>
                            </button>
                            {localStorage.getItem("role") === "Admin" && (
                              <button className="btn btn-light btn-sm text-danger bg-opacity-20 border-0 p-2 d-flex align-items-center justify-content-center rounded" title="Delete Permanent Log" onClick={() => deleteLead(lead._id)}>
                                <i className="bi bi-trash3 fs-6"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leads;