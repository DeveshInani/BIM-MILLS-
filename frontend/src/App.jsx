import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax";

import Layout from "./components/layout";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Shop from "./pages/Shop";
import More from "./pages/More";
import Contact from "./pages/Contact";
import CancelOrder from "./pages/CancelOrder";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";


// Admin
import AdminLogin from "./admin/adminlogin";
import AdminDashboard from "./admin/admindashboard";
import AdminAnalyticsBoard from "./admin/AdminAnalyticsBoard";


function App() {
  const adminLoggedIn = !!localStorage.getItem("adminToken");

  return (
    <ParallaxProvider>
      <BrowserRouter>
        <Routes>

          {/* 🌐 MAIN SITE (WITH NAVBAR + THEME) */}
          <Route
            path="/"
            element={
              <Layout>
                {() => <Home />}
              </Layout>
            }
          />

          <Route
            path="/about"
            element={
              <Layout>
                {(mode) => <About mode={mode} />}
              </Layout>
            }
          />

          <Route
            path="/products"
            element={
              <Layout>
                {(mode) => <Products mode={mode} />}
              </Layout>
            }
          />

          <Route
            path="/shop"
            element={
              <Layout>
                {(mode) => <Shop mode={mode} />}
              </Layout>
            }
          />

          <Route
            path="/more"
            element={
              <Layout>
                {(mode) => <More mode={mode} />}
              </Layout>
            }
          />

          <Route
            path="/contact"
            element={
              <Layout>
                {(mode) => <Contact mode={mode} />}
              </Layout>
            }
          />

          <Route
            path="/cancel-order"
            element={
              <Layout>
                {(mode) => <CancelOrder mode={mode} />}
              </Layout>
            }
          />

          <Route
            path="/login"
            element={
              <Layout>
                {(mode) => <Login mode={mode} />}
              </Layout>
            }
          />

          <Route
            path="/signup"
            element={
              <Layout>
                {(mode) => <Signup mode={mode} />}
              </Layout>
            }
          />

          <Route
            path="/profile"
            element={
              <Layout>
                {(mode) => <Profile mode={mode} />}
              </Layout>
            }
          />

          <Route
            path="/my-orders"
            element={
              <Layout>
                {(mode) => <MyOrders mode={mode} />}
              </Layout>
            }
          />

          {/* 🔐 ADMIN LOGIN (NO NAVBAR) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 🛡️ ADMIN DASHBOARD (WITH NAVBAR + THEME) */}
          <Route
            path="/admin/dashboard"
            element={
              adminLoggedIn ? (
                <Layout>
                  {(mode) => <AdminDashboard mode={mode} />}
                </Layout>
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
          <Route
            path="/admin/analytics"
            element={
              adminLoggedIn ? (
                <Layout>
                  {(mode) => <AdminAnalyticsBoard mode={mode} />}
                </Layout>
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />

        </Routes>
      </BrowserRouter>
    </ParallaxProvider>
  );
}

export default App;
