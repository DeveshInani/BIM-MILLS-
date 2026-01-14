import api from "../../api/axiosClient";

export const registerUser = async (data) => {
  const res = await api.post("/users/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/users/login", data);
  return res.data;
};

export const sendEnquiry = async (data) => {
  if (!data.name || !data.phone || !data.email || !data.message) {
    throw new Error("Missing enquiry fields");
  }

  return api.post("/users/enquiry", {
    name: data.name.trim(),
    phone: String(data.phone),
    email: data.email.trim(),
    company: data.company?.trim() || null,
    message: data.message.trim(),
  });
};