import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/login", { login, password });
      const { accessToken, refreshToken } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const decoded = jwtDecode(accessToken);

      if (decoded.role === "admin") {
        navigate("/");
      } else {
        navigate("/user/lessons");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Нэвтрэлт амжилтгүй");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit}>
        <h2>Нэвтрэх</h2>

        {error && <div className="error">{error}</div>}

        <input
          type="text"
          placeholder="И-мэйл эсвэл утас"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <input
          type="password"
          placeholder="Нууц үг"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Нэвтэрж байна..." : "Нэвтрэх"}
        </button>

        <p className="login-link">
          <span onClick={() => navigate("/register")}>Бүртгүүлэх</span>
        </p>
      </form>
    </div>
  );
}
