import api from "../../api/axiosClient";

// ADMIN LOGIN → /auth/login
export const adminLogin = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// GET ALL ENQUIRIES → /admin/enquiries
export const getEnquiries = async () => {
  const token = localStorage.getItem("adminToken");

  const res = await api.get("/admin/enquiries", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deleteEnquiry = async (id) => {
  const token = localStorage.getItem("adminToken");

  const res = await api.delete(`/admin/enquiries/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};