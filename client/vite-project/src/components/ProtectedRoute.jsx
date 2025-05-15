import React, { useEffect, useState } from "react";
import { GetCurrentUser } from "../apiCalls/users";
import { useNavigate, Link } from "react-router-dom";
import { message, Layout, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
  CloseOutlined
} from "@ant-design/icons";
import "./ProtectedRoute.css";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getValidUser = async () => {
    try {
      const response = await GetCurrentUser();
      dispatch(setUser(response.data));
    } catch (error) {
      dispatch(setUser(null));
      message.error(error.message);
      navigate("/login");
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getValidUser();
    } else {
      navigate("/login");
    }
  }, []);

  const handleNavigateToProfile = () => {
    if (user.role === "admin") {
      navigate("/admin");
    } else if (user.role === "partner") {
      navigate("/partner");
    } else {
      navigate("/user");
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const filteredChildren = React.cloneElement(children, { searchQuery });

  if (loadingUser) {
    return (
      <div className="protected-loader">
        <Spin size="large" />
      </div>
    );
  }

  return (
    user && (
      <Layout className="premium-layout">
        <header className="premium-header">
          <div className="premium-navbar">
            <div className="premium-brand">
              <Link to="/">
                <span className="premium-logo">BookURShow</span>
              </Link>
            </div>

            <div className="premium-search-bar">
              <input
                type="text"
                placeholder="Search for movies..."
                className="premium-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchOutlined />
            </div>

            <div className="premium-nav-actions">
              {/* Home Button */}
              <Link to="/" className="premium-home-button">
                <HomeOutlined />
              </Link>

              {/* User Menu */}
              <div className="premium-user-menu">
                <button className="premium-user-button">
                  <UserOutlined />
                  <span>{user?.name}</span>
                </button>
                <div className="premium-dropdown">
                  <div className="premium-dropdown-item" onClick={handleNavigateToProfile}>
                    <ProfileOutlined />
                    <span>My Profile</span>
                  </div>
                  <div className="premium-dropdown-item" onClick={handleLogout}>
                    <LogoutOutlined />
                    <span>Log Out</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="premium-mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          </div>
        </header>

        <Layout.Content className="premium-content">
          {filteredChildren}
        </Layout.Content>
      </Layout>
    )
  );
}

export default ProtectedRoute;
