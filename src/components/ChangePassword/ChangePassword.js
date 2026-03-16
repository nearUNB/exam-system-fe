import { useState } from "react";
import API from "../../services/api";
import "./ChangePassword.css";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const res = await API.post(
        "/users/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setMessage(res.data.message);
      setError("");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change password");
      setMessage("");
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <h2>Нууц үг солих</h2>
        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Хуучин нууц үг"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Шинэ нууц үг"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Нууц үг солих</button>
        </form>
      </div>
    </div>
  );
}
