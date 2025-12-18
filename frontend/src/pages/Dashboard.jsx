import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

// --- ICONS ---
const Icons = {
  Tasks: "✅",
  Docs: "📄",
  Summary: "📝",
  Email: "📧",
  Storage: "📁",
  Menu: "☰",
  Upload: "⬆️",
  Delete: "🗑️",
  Download: "⬇️",
  Send: "🚀",
  Magic: "✨"
};

function Dashboard() {
  const API_URL = "https://build-flow-mern-backend.vercel.app";
  const navigate = useNavigate();

  // --- STATES ---
  const [activeTab, setActiveTab] = useState("tasks");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [appPrompt, setAppPrompt] = useState("");
  const [appType, setAppType] = useState("leave_request");
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");

  // --- Axios Instance with JWT ---
  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });

  // --- USER AUTH ---
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    if (userData.role === "Engineer") setActiveTab("summarizer");
    else setActiveTab("tasks");
  }, [navigate, token]);

  // --- FETCH MODULE DATA ---
  useEffect(() => {
    if (!user) return;
    if (activeTab === "tasks") fetchTasks();
    if (activeTab === "documents") fetchDocuments();
  }, [activeTab, user]);

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("/tasks");
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch tasks.");
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await axiosInstance.get(`/documents?role=${user.role}`);
      setDocuments(res.data.documents);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch documents.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // --- TASK HANDLERS ---
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskDesc) return;
    try {
      const res = await axiosInstance.post("/tasks", { description: newTaskDesc });
      setTasks([res.data.task, ...tasks]);
      setNewTaskDesc("");
    } catch (err) {
      alert("Failed to create task.");
    }
  };

  const handleUpdateTaskStatus = async (id, newStatus) => {
    try {
      const res = await axiosInstance.put(`/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map(t => (t._id === id ? res.data.task : t)));
    } catch (err) {
      alert("Failed to update task.");
    }
  };

  const handleRequestDeleteClick = (taskId) => {
    setDeleteTaskId(taskId);
    setShowDeleteModal(true);
  };

  const handleRequestDeleteSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(`/tasks/request-delete/${deleteTaskId}`, { reason: deleteReason });
      setTasks(tasks.map(t => (t._id === deleteTaskId ? res.data.task : t)));
      alert("Request submitted.");
    } catch (err) {
      alert("Failed to request deletion.");
    } finally {
      setDeleteReason("");
      setShowDeleteModal(false);
    }
  };

  const handleManagerAction = async (taskId, action) => {
    if (!window.confirm(`Are you sure?`)) return;
    try {
      await axiosInstance.put(`/tasks/manager-action/${taskId}`, { action });
      if (action === "approve") setTasks(tasks.filter(t => t._id !== taskId));
      else fetchTasks();
    } catch (err) {
      alert("Action failed.");
    }
  };

  // --- PDF / DOCUMENTS ---
  const handleGeneratePDF = async (e) => {
    e.preventDefault();
    if (!appPrompt) return alert("Enter prompt!");
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        "/applications/generate",
        { userName: user.name, letterType: appType, prompt: appPrompt },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${appType}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Generation failed.");
    }
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select file!");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userName", user.name);
    formData.append("role", user.role);
    setLoading(true);
    try {
      const res = await axiosInstance.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDocuments([res.data.document, ...documents]);
      alert("Uploaded!");
      setFile(null);
    } catch (err) {
      alert("Upload failed.");
    }
    setLoading(false);
  };

  const handleFileDelete = async (id) => {
    if (!window.confirm("Delete file?")) return;
    try {
      await axiosInstance.delete(`/documents/${id}`);
      setDocuments(documents.filter(d => d._id !== id));
    } catch (err) {
      alert("Delete failed.");
    }
  };

  // --- SUMMARY ---
  const handleSummarize = async () => {
    if (!inputText) return alert("Enter text!");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/summary", { text: inputText });
      setSummary(res.data.summary);
    } catch (err) {
      alert("Summary failed.");
    }
    setLoading(false);
  };

  // --- EMAIL ---
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/email/send", { to: emailTo, subject: emailSubject, body: emailBody });
      alert("Email Sent!");
      setEmailTo(""); setEmailSubject(""); setEmailBody("");
    } catch (err) {
      alert("Email failed.");
    }
    setLoading(false);
  };

  if (!user) return <div style={styles.loadingScreen}>Loading BuildFlow...</div>;

  const userRole = user.role;
  const pendingRequests = tasks.filter(t => t.status === "Pending Manager Approval");
  const activeTasks = tasks.filter(t => t.status !== "Pending Manager Approval");

  return (
    <div style={styles.container}>
      {/* MODAL */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <form onSubmit={handleRequestDeleteSubmit} style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Request Deletion</h3>
            <p style={styles.modalText}>Reason is required for Manager approval.</p>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              rows="3"
              style={styles.input}
              required
            />
            <div style={styles.modalButtons}>
              <button type="button" onClick={() => setShowDeleteModal(false)} style={styles.btnSecondary}>
                Cancel
              </button>
              <button type="submit" style={styles.btnDanger}>
                Send Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={styles.mobileMenuBtn}
          >
            {Icons.Menu}
          </button>
          <h1 style={styles.logo}>BuildFlow</h1>
        </div>
        <div style={styles.navRight}>
          <span style={styles.userInfo}>
            {user.name} <span style={styles.roleBadge}>{user.role}</span>
          </span>
          <button onClick={handleLogout} style={styles.btnLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <div style={styles.layout}>
        <aside style={{ ...styles.sidebar, ...(isSidebarOpen ? styles.sidebarOpen : {}) }}>
          <div style={styles.menu}>
            <MenuButton
              active={activeTab === "tasks"}
              onClick={() => { setActiveTab("tasks"); setIsSidebarOpen(false); }}
              icon={Icons.Tasks}
              label="Task Tracker"
            />
            {userRole === "Manager" && (
              <MenuButton
                active={activeTab === "requests"}
                onClick={() => { setActiveTab("requests"); setIsSidebarOpen(false); }}
                icon="🚨"
                label={`Requests (${pendingRequests.length})`}
                isAlert
              />
            )}
            {(userRole === "Manager" || userRole === "HR") && (
              <>
                <MenuButton
                  active={activeTab === "applications"}
                  onClick={() => { setActiveTab("applications"); setIsSidebarOpen(false); }}
                  icon={Icons.Docs}
                  label="AI Doc Gen"
                />
                <MenuButton
                  active={activeTab === "email"}
                  onClick={() => { setActiveTab("email"); setIsSidebarOpen(false); }}
                  icon={Icons.Email}
                  label="Email"
                />
                <MenuButton
                  active={activeTab === "documents"}
                  onClick={() => { setActiveTab("documents"); setIsSidebarOpen(false); }}
                  icon={Icons.Storage}
                  label="Documents"
                />
              </>
            )}
            {(userRole === "Engineer" || userRole === "Manager") && (
              <MenuButton
                active={activeTab === "summarizer"}
                onClick={() => { setActiveTab("summarizer"); setIsSidebarOpen(false); }}
                icon={Icons.Summary}
                label="Summarizer"
              />
            )}
          </div>
        </aside>

        <main style={styles.main}>
          <div style={styles.contentWrapper}>
            {/* TASKS */}
            {activeTab === "tasks" && (
              <Card title="Task Tracker" subtitle="Manage team tasks efficiently">
                <form onSubmit={handleCreateTask} style={styles.formRow}>
                  <input
                    type="text"
                    placeholder="New task description..."
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    style={styles.inputGrow}
                  />
                  <button type="submit" style={styles.btnPrimary}>Add</button>
                </form>
                <div style={styles.list}>
                  {activeTasks.map(task => (
                    <div key={task._id} style={styles.listItem}>
                      <span style={{ textDecoration: task.status === "Completed" ? "line-through" : "none" }}>
                        {task.description}
                      </span>
                      <div style={styles.actions}>
                        <select value={task.status} onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)} style={styles.select}>
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                        {userRole === "Manager" ? (
                          <button onClick={() => handleManagerAction(task._id, "approve")} style={styles.btnDangerSmall}>{Icons.Delete}</button>
                        ) : (
                          <button onClick={() => handleRequestDeleteClick(task._id)} style={styles.btnWarningSmall}>Req. Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* DOCUMENTS */}
            {activeTab === "documents" && (
              <Card title={`Document Storage (${userRole})`} subtitle="Secure file repository">
                <form onSubmit={handleFileUpload} style={styles.uploadForm}>
                  <input type="file" onChange={(e) => setFile(e.target.files[0])} style={styles.fileInput} />
                  <button type="submit" disabled={loading} style={styles.btnPrimary}>{loading ? "..." : Icons.Upload}</button>
                </form>
                <div style={styles.list}>
                  {documents.map(doc => (
                    <div key={doc._id} style={styles.listItem}>
                      <div>
                        <a href={`${API_URL}${doc.filePath}`} target="_blank" rel="noreferrer" style={styles.link}>
                          {Icons.Docs} {doc.fileName}
                        </a>
                        <div style={styles.metaText}>By {doc.uploadedBy} • {new Date(doc.createdAt).toLocaleDateString()}</div>
                      </div>
                      <button onClick={() => handleFileDelete(doc._id)} style={styles.btnDangerSmall}>{Icons.Delete}</button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* SUMMARIZER */}
            {activeTab === "summarizer" && (
              <Card title="AI Meeting Summarizer" subtitle="Convert notes into actionable summaries">
                <textarea rows="6" placeholder="Paste meeting notes here..." value={inputText} onChange={(e) => setInputText(e.target.value)} style={styles.input} />
                <button onClick={handleSummarize} disabled={loading} style={styles.btnPrimary}>{loading ? "Thinking..." : `${Icons.Magic} Summarize`}</button>
                {summary && <div style={styles.resultBox}><ReactMarkdown>{summary}</ReactMarkdown></div>}
              </Card>
            )}

            {/* EMAIL */}
            {activeTab === "email" && (
              <Card title="Email Sender" subtitle="Send updates to team or clients">
                <form onSubmit={handleSendEmail} style={styles.formColumn}>
                  <input type="email" placeholder="To" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} style={styles.input} required />
                  <input type="text" placeholder="Subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} style={styles.input} required />
                  <textarea rows="5" placeholder="Message" value={emailBody} onChange={(e) => setEmailBody(e.target.value)} style={styles.input} required />
                  <button type="submit" disabled={loading} style={styles.btnPrimary}>{loading ? "Sending..." : `${Icons.Send} Send Email`}</button>
                </form>
              </Card>
            )}

            {/* APPLICATIONS (PDF Gen) */}
            {activeTab === "applications" && (
              <Card title="AI Document Generator" subtitle="Generate professional letters instantly">
                <form onSubmit={handleGeneratePDF} style={styles.formColumn}>
                  <label style={styles.label}>Document Type</label>
                  <select value={appType} onChange={(e) => setAppType(e.target.value)} style={styles.input}>
                    <option value="leave_request">Leave Request</option>
                    <option value="client_update">Client Update</option>
                  </select>
                  <label style={styles.label}>Prompt / Details</label>
                  <textarea rows="4" placeholder="Describe the situation..." value={appPrompt} onChange={(e) => setAppPrompt(e.target.value)} style={styles.input} required />
                  <button type="submit" disabled={loading} style={styles.btnPrimary}>{loading ? "Generating..." : `${Icons.Download} Download PDF`}</button>
                </form>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// --- UI COMPONENTS ---
const MenuButton = ({ active, onClick, icon, label, isAlert }) => (
  <button onClick={onClick} style={{ ...styles.menuBtn, ...(active ? styles.menuBtnActive : {}), ...(isAlert ? styles.menuBtnAlert : {}) }}>
    <span style={styles.menuIcon}>{icon}</span> {label}
  </button>
);

const Card = ({ title, subtitle, children }) => (
  <div style={styles.card}>
    <div style={styles.cardHeader}>
      <h2 style={styles.cardTitle}>{title}</h2>
      <p style={styles.cardSubtitle}>{subtitle}</p>
    </div>
    {children}
  </div>
);

// --- STYLES ---
const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  loadingScreen: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#666' },
  navbar: { height: '60px', background: '#1e293b', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', position: 'sticky', top: 0, zIndex: 50 },
  navLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  logo: { fontSize: '1.2rem', fontWeight: 'bold', margin: 0 },
  mobileMenuBtn: { background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', display: 'none' },
  roleBadge: { background: '#334155', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', marginLeft: '5px' },
  btnLogout: { background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' },
  userInfo: { fontSize: '0.9rem', display: 'flex', alignItems: 'center' },
  layout: { display: 'flex', flex: 1, height: 'calc(100vh - 60px)' },
  sidebar: { width: '260px', background: '#fff', borderRight: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease' },
  sidebarOpen: { transform: 'translateX(0)' },
  menu: { display: 'flex', flexDirection: 'column', gap: '5px' },
  menuBtn: { padding: '12px 15px', border: 'none', background: 'transparent', color: '#64748b', textAlign: 'left', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: '500', transition: 'all 0.2s' },
  menuBtnActive: { background: '#e0f2fe', color: '#0284c7' },
  menuBtnAlert: { color: '#dc2626', background: '#fee2e2' },
  menuIcon: { fontSize: '1.1rem' },
  main: { flex: 1, background: '#f1f5f9', overflowY: 'auto', padding: '20px' },
  contentWrapper: { maxWidth: '900px', margin: '0 auto' },
  card: { background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' },
  cardHeader: { marginBottom: '25px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' },
  cardTitle: { margin: 0, fontSize: '1.5rem', color: '#0f172a' },
  cardSubtitle: { margin: '5px 0 0', color: '#64748b', fontSize: '0.9rem' },
  formRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
  formColumn: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem', width: '100%', fontFamily: 'inherit' },
  inputGrow: { flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' },
  label: { fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '-10px' },
  select: { padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' },
  btnPrimary: { background: '#0284c7', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' },
  btnSecondary: { background: '#94a3b8', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  btnDanger: { background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  btnDangerSmall: { background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' },
  btnWarningSmall: { background: '#ffedd5', color: '#c2410c', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' },
  btnSuccess: { background: '#dcfce7', color: '#16a34a', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', marginRight: '10px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' },
  metaText: { fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' },
  link: { color: '#0284c7', textDecoration: 'none', fontWeight: '500' },
  reasonText: { fontSize: '0.85rem', color: '#ef4444', marginTop: '5px' },
  resultBox: { marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #0284c7', lineHeight: '1.6' },
  uploadForm: { display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center', background: '#f1f5f9', padding: '15px', borderRadius: '8px' },
  fileInput: { flex: 1 },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modalContent: { background: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
  modalTitle: { margin: '0 0 10px 0', fontSize: '1.3rem' },
  modalText: { color: '#64748b', marginBottom: '20px', fontSize: '0.95rem' },
  modalButtons: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
};

export default Dashboard;
