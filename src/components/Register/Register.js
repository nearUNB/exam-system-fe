import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { first_name, last_name, email, phone, password } = form;

    if (!first_name || !last_name || !email || !phone || !password) {
      setError("Бүх талбарыг бөглөнө үү");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("И-мэйл алдаатай байна");
      return false;
    }

    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(phone)) {
      setError("Утасны дугаар алдаатай байна");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await API.post("/users/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit}>
        <h2>Бүртгүүлэх</h2>

        {error && <div className="error">{error}</div>}

        <div className="form-row">
          <input
            type="text"
            name="last_name"
            placeholder="Овог"
            value={form.last_name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="first_name"
            placeholder="Нэр"
            value={form.first_name}
            onChange={handleChange}
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="И-мэйл"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Утас"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Нууц үг"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
        </button>

        <p className="login-link">
          <span onClick={() => navigate("/login")}>Нэвтрэх</span>
        </p>
      </form>
    </div>
  );
}
