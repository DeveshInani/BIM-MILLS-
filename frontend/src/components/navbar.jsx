import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Tooltip,
  useMediaQuery,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  User as UserIcon,
  ShoppingBag,
  LogOut,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';



export default function Navbar({ mode, setMode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Keep original breakpoint logic
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName") || "User";
  const userLoggedIn = !!userToken;

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    handleClose();
    navigate("/");
    window.location.reload();
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Shop", to: "/shop" },
    { label: "Fabric", to: "/products" },
    { label: "Contact", to: "/contact" },
  ];

  const renderProfileDropdown = () => {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("userToken");
    const userName = localStorage.getItem("userName") || "User";
    const isLoggedIn = !!(userToken || adminToken);

    if (isLoggedIn) {
      return (
        <>
          <Tooltip title="Profile & Portal">
            <IconButton onClick={handleMenu} sx={{ ml: 1, p: 0.5, border: '2px solid rgba(255,255,255,0.2)' }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: adminToken ? 'error.main' : 'secondary.main', fontSize: '1rem' }}>
                {adminToken ? 'A' : userName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 4,
              sx: {
                width: 220,
                mt: 1.5,
                borderRadius: 2,
                overflow: 'visible',
              },
            }}
          >
            {/* Show Admin Dashboard if Admin Token exists */}
            {adminToken && (
              <MenuItem onClick={() => { handleClose(); navigate("/admin/dashboard"); }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Settings size={18} className="text-blue-500" />
                  <Typography variant="body2" fontWeight={700}>Admin Dashboard</Typography>
                </Box>
              </MenuItem>
            )}

            {/* Show User links if User Token exists */}
            {userToken && (
              <>
                {adminToken && <Divider />}
                <MenuItem onClick={() => { handleClose(); navigate("/profile"); }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <UserIcon size={18} />
                    <Typography variant="body2">My Profile</Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate("/my-orders"); }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <ShoppingBag size={18} />
                    <Typography variant="body2">My Orders</Typography>
                  </Box>
                </MenuItem>
              </>
            )}

            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LogOut size={18} />
                <Typography variant="body2" fontWeight={600}>Logout All</Typography>
              </Box>
            </MenuItem>
          </Menu>
        </>
      );
    }

    return (
      <>
        <Tooltip title="Login / Signup">
          <IconButton onClick={handleMenu} sx={{ ml: 1, p: 0.5, border: '2px solid rgba(255,255,255,0.2)' }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', fontSize: '1rem' }}>
              <UserIcon size={20} />
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 4,
            sx: {
              width: 180,
              mt: 1.5,
              borderRadius: 2,
              overflow: 'visible',
            },
          }}
        >
          <MenuItem onClick={() => { handleClose(); navigate("/login"); }}>
            <Typography variant="body2" fontWeight={600}>User Login</Typography>
          </MenuItem>
          <MenuItem onClick={() => { handleClose(); navigate("/signup"); }}>
            <Typography variant="body2" fontWeight={600}>User Sign Up</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { handleClose(); navigate("/admin/login"); }}>
            <Typography variant="body2" color="text.secondary">Admin Portal</Typography>
          </MenuItem>
        </Menu>
      </>
    );
  };

  return (
    <AppBar position="fixed" color="primary" elevation={4} sx={{ zIndex: 1201 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
            fontWeight: 800,
            letterSpacing: 1,
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          <Box sx={{ bgcolor: 'secondary.main', color: 'primary.main', px: 1, borderRadius: 1, fontSize: '0.9rem' }}>BIM</Box>
          MILLS
        </Typography>

        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              PaperProps={{ sx: { width: 280, bgcolor: 'primary.main', color: 'white' } }}
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>Navigation</Typography>
                <List>
                  {navLinks.map((item) => (
                    <ListItem button key={item.to} component={Link} to={item.to} onClick={() => setMobileOpen(false)}>
                      <ListItemText primary={item.label} />
                    </ListItem>
                  ))}
                  <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
                  {(userLoggedIn || localStorage.getItem("adminToken")) ? (
                    <>
                      {localStorage.getItem("adminToken") && (
                        <ListItem button component={Link} to="/admin/dashboard" onClick={() => setMobileOpen(false)}>
                          <ListItemText primary="Admin Dashboard" sx={{ fontWeight: 'bold', color: 'secondary.main' }} />
                        </ListItem>
                      )}
                      {userLoggedIn && (
                        <>
                          <ListItem button component={Link} to="/profile" onClick={() => setMobileOpen(false)}>
                            <ListItemText primary="My Profile" />
                          </ListItem>
                          <ListItem button component={Link} to="/my-orders" onClick={() => setMobileOpen(false)}>
                            <ListItemText primary="My Orders" />
                          </ListItem>
                        </>
                      )}
                      <ListItem button onClick={handleLogout}>
                        <ListItemText primary="Logout All" sx={{ color: '#ff4444', fontWeight: 'bold' }} />
                      </ListItem>
                    </>
                  ) : (
                    <>
                      <ListItem button component={Link} to="/login" onClick={() => setMobileOpen(false)}>
                        <ListItemText primary="User Login" />
                      </ListItem>
                      <ListItem button component={Link} to="/signup" onClick={() => setMobileOpen(false)}>
                        <ListItemText primary="User Sign Up" />
                      </ListItem>
                      <ListItem button component={Link} to="/admin/login" onClick={() => setMobileOpen(false)}>
                        <ListItemText primary="Admin Portal" sx={{ color: 'secondary.main' }} />
                      </ListItem>
                    </>
                  )}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {navLinks.map((item) => (
              <Button
                key={item.to}
                color="inherit"
                component={Link}
                to={item.to}
                sx={{
                  fontWeight: 600,
                  opacity: 0.8,
                  '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                {item.label}
              </Button>
            ))}

            <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"} arrow>
              <IconButton
                color="inherit"
                onClick={() => setMode(mode === "light" ? "dark" : "light")}
                sx={{ ml: 1 }}
              >
                {mode === "dark" ? <SunIcon /> : <MoonIcon />}
              </IconButton>
            </Tooltip>

            <Box sx={{ width: 1, height: 24, bgcolor: 'rgba(255,255,255,0.2)', mx: 1 }} />

            {renderProfileDropdown()}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
