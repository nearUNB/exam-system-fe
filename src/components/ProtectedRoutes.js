import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    if (role && decoded.role !== role) {
      return <Navigate to="/" />;
    }
    return children;
  } catch (err) {
    return <Navigate to="/login" />;
  }
}
