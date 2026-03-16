import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiKey } from "react-icons/fi";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setUsername(decoded.first_name);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <img src="/logo.png" className="headerLogo" />
        </Link>
        <nav>
          {!token && (
            <>
              <Link to="/login" className="btn-primary">
                Нэвтрэх
              </Link>
              <Link to="/register" className="btn-secondary">
                Бүртгүүлэх
              </Link>
            </>
          )}

          {token && (
            <>
              {role === "user" && (
                <>
                  <Link to="/user/lessons">Хичээлүүд</Link>
                  <Link to="/user/exam/history">Шалгалтын түүх</Link> |{" "}
                </>
              )}
              {role === "admin" && (
                <>
                  <Link to="/admin/exam/history">Шалгалтын түүх</Link>
                  <Link to="/admin/lessons">Хичээл</Link> |{" "}
                </>
              )}
              <div
                className="dropdown"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {username} ▼
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link
                      to={
                        role === "admin"
                          ? "/admin/change-password"
                          : "/user/change-password"
                      }
                      className="dropdown-item"
                    >
                      <FiKey style={{ marginRight: "8px" }} /> Нууц үг солих
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item">
                      <FiLogOut style={{ marginRight: "8px" }} /> Гарах
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
