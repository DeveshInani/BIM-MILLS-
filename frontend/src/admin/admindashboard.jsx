
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MessageSquare,
  User,
  BarChart3,
} from "lucide-react";
import { getEnquiries, deleteEnquiry } from "./api/adminApi";

export default function AdminDashboard({ mode = "light" }) {
  const darkMode = mode === "dark";
  const navigate = useNavigate();

  // Example stats, replace with real API data if available
  const stats = [
    { label: "Total Enquiries", value: 124, icon: <Mail className="w-6 h-6" /> },
    { label: "New This Week", value: 12, icon: <User className="w-6 h-6" /> },
    { label: "Pending Replies", value: 7, icon: <MessageSquare className="w-6 h-6" /> },
  ];

  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [sortBy] = useState("created_at");
  const [sortOrder] = useState("desc");
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH ---------------- */

  const fetchEnquiries = async () => {
    setLoading(true);
    const data = await getEnquiries();
    const enquiryList = Array.isArray(data) ? data : (data?.enquiries || []);
    setEnquiries(enquiryList);
    setFilteredEnquiries(enquiryList);
    setLoading(false);
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  /* ---------------- FILTER + SORT ---------------- */

  useEffect(() => {
    let filtered = [...enquiries];

    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.phone.includes(searchQuery) ||
          e.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return sortOrder === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
        ? 1
        : -1;
    });

    setFilteredEnquiries(filtered);
  }, [enquiries, searchQuery, sortBy, sortOrder]);

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    await deleteEnquiry(id);
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    setShowDetails(null);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedEnquiries.length} enquiries?`)) return;
    for (const id of selectedEnquiries) {
      await deleteEnquiry(id);
    }
    setEnquiries((prev) =>
      prev.filter((e) => !selectedEnquiries.includes(e.id))
    );
    setSelectedEnquiries([]);
  };

  /* ---------------- CSV EXPORT ---------------- */

  const exportToCSV = () => {
    const headers = ["Date", "Name", "Phone", "Email", "Message"];
    const csv = [
      headers.join(","),
      ...filteredEnquiries.map((e) =>
        [
          new Date(e.created_at).toLocaleString("en-IN"),
          e.name,
          e.phone,
          e.email,
          `"${e.message}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "enquiries.csv";
    a.click();
  };

  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.ceil(filteredEnquiries.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedEnquiries = filteredEnquiries.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedEnquiries.length === paginatedEnquiries.length) {
      setSelectedEnquiries([]);
    } else {
      setSelectedEnquiries(paginatedEnquiries.map((e) => e.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedEnquiries((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ======================= UI ======================= */

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} transition`} style={{ paddingTop: 80 }}>
      {/* HEADER & STATS */}
      <div className={`border-b ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Enquiries Dashboard</h1>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Manage customer enquiries</p>
            </div>
            {/* ACTION BUTTONS */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => navigate("/admin/analytics")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold ${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="hidden sm:inline">Analytics</span>
              </button>
              <button onClick={fetchEnquiries} className={`p-2 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
                <RefreshCw className="w-5 h-5" />
              </button>
              <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2">
            {stats.map((stat, idx) => (
              <div key={idx} className={`flex items-center gap-4 p-5 rounded-2xl shadow-lg ${darkMode ? "bg-gradient-to-br from-blue-900/60 to-gray-900/80 border border-blue-800/30" : "bg-white/80 border border-blue-100"}`}>
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${darkMode ? "bg-blue-800/30" : "bg-blue-100/60"}`}>{stat.icon}</div>
                <div>
                  <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-blue-900"}`}>{stat.value}</div>
                  <div className={`text-sm ${darkMode ? "text-blue-200" : "text-gray-600"}`}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6">
        {/* SEARCH & BULK ACTIONS */}
        <div className={`p-4 rounded-xl mb-6 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search enquiries..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg border outline-none ${darkMode ? "bg-gray-900 border-gray-700 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
            />
          </div>
          {selectedEnquiries.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
            >
              <Trash2 className="inline w-4 h-4 mr-2" />
              Delete Selected
            </button>
          )}
        </div>

        {/* TABLE */}
        <div className={`rounded-xl overflow-x-auto shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          {loading ? (
            <div className="py-20 flex justify-center">
              <RefreshCw className="animate-spin w-8 h-8 text-blue-500" />
            </div>
          ) : (
            <>
              <table className="w-full min-w-[700px]">
                <thead className={darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-700"}>
                  <tr>
                    <th className="p-4">
                      <input
                        type="checkbox"
                        onChange={toggleSelectAll}
                        checked={selectedEnquiries.length === paginatedEnquiries.length && paginatedEnquiries.length > 0}
                      />
                    </th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Contact</th>
                    <th className="p-4 text-left">Message</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEnquiries.map((e) => (
                    <tr key={e.id} className={darkMode ? "border-t border-gray-700 hover:bg-gray-900/40" : "border-t hover:bg-gray-50"}>
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedEnquiries.includes(e.id)}
                          onChange={() => toggleSelect(e.id)}
                        />
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <Calendar className="inline w-4 h-4 mr-2" />
                        {new Date(e.created_at).toLocaleString("en-IN")}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold">{e.name}</div>
                        <div className="text-xs flex gap-2 items-center mt-1">
                          <Mail className="w-4 h-4" />
                          <span className="truncate max-w-[120px] md:max-w-[200px]" title={e.email}>{e.email}</span>
                        </div>
                        <div className="text-xs flex gap-2 items-center mt-1">
                          <Phone className="w-4 h-4" />
                          <span className="truncate max-w-[120px] md:max-w-[200px]" title={e.phone}>{e.phone}</span>
                        </div>
                      </td>
                      <td className="p-4 max-w-xs truncate" title={e.message}>{e.message}</td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => setShowDetails(e)} className={`rounded-full p-2 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`} title="View Details">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="text-red-600 rounded-full p-2 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* PAGINATION */}
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-2">
                <span className="text-sm">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className={`rounded-lg px-2 py-1 ${page === 1 ? "opacity-50 cursor-not-allowed" : darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className={`rounded-lg px-2 py-1 ${page === totalPages ? "opacity-50 cursor-not-allowed" : darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-2">
          <div className={`w-full max-w-xl rounded-2xl shadow-2xl p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
            <h2 className="text-xl font-bold mb-4">Enquiry Details</h2>
            <DetailRow icon={<User />} label="Name" value={showDetails.name} darkMode={darkMode} />
            <DetailRow icon={<Mail />} label="Email" value={showDetails.email} darkMode={darkMode} />
            <DetailRow icon={<Phone />} label="Phone" value={showDetails.phone} darkMode={darkMode} />
            <DetailRow icon={<Calendar />} label="Date" value={new Date(showDetails.created_at).toLocaleString("en-IN") } darkMode={darkMode} />
            <DetailRow icon={<MessageSquare />} label="Message" value={showDetails.message} darkMode={darkMode} />
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDetails(null)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(showDetails.id)}
                className="bg-red-600 text-white px-4 rounded-lg font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- SMALL COMPONENT ---------------- */

function DetailRow({ icon, label, value, darkMode }) {
  return (
    <div className={`flex gap-4 p-3 rounded-lg mb-2 items-center ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
      {icon}
      <div>
        <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{label}</div>
        <div className="font-medium break-words max-w-xs">{value}</div>
      </div>
    </div>
  );
}
