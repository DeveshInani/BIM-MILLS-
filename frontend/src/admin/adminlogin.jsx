import { useState } from "react";
import { adminLogin } from "./api/adminApi";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";

export default function AdminLogin({ onLoginSuccess }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await adminLogin(form);

      localStorage.setItem("adminToken", data.access_token);

      window.location.href = "/admin/dashboard";

      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      alert(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #bbdefb, #e3f2fd)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{ padding: 4, width: "100%", maxWidth: 400, borderRadius: 3 }}
      >
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
          Admin Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={handleChange}
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ marginTop: 2, paddingY: 1.2 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
