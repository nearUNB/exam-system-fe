import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import usePageTitle from "../../hooks/usePageTitle";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  usePageTitle("Нүүр хуудас");

  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (err) {
      console.error("Invalid token");
    }
  }

  return (
    <div className="home-container">
      <section className="hero">
        <h1>Цахим шалгалтын системд тавтай морилно уу!</h1>
        <p>Өөрийн мэдлэгийг шалгаж, чадвараа хөгжүүлэх цахим талбар.</p>

        {!token && (
          <div className="hero-buttons">
            <button onClick={() => navigate("/login")}>Нэвтрэх</button>
            <button className="secondary" onClick={() => navigate("/register")}>
              Бүртгүүлэх
            </button>
          </div>
        )}

        {token && role === "user" && (
          <button onClick={() => navigate("/user/lessons")}>Хичээл</button>
        )}

        {token && role === "admin" && (
          <button onClick={() => navigate("/admin/exam/history")}>
            Шалгалтын түүх
          </button>
        )}
      </section>

      <section className="features">
        <div className="feature">
          <h3>📚 Хичээл сонгох</h3>
          <p>Хүссэн үедээ хичээл сонгон шалгалт өгөх боломж.</p>
        </div>

        <div className="feature">
          <h3>📝 Шалгалт өгөх </h3>
          <p>Асуултанд хариулан мэдлэг сорих.</p>
        </div>

        <div className="feature">
          <h3>📊 Үр дүн</h3>
          <p>Үр дүнгээ дүгнэн илүү сайжрах.</p>
        </div>
      </section>
    </div>
  );
}
