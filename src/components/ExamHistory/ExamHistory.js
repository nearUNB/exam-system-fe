import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./ExamHistory.css";
import CustomButton from "../Common/CustomButton";
import CustomTable from "../Common/CustomTable";

export default function AdminExamHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExamsTaken: 0,
    avgScore: 0,
  });
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/exam-history/all-history");
        setHistory(res.data.history || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Шалгалтын түүхийг ачаалах үед алдаа гарлаа");
      }
    };

    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setStatsError("Самбарын мэдээлэл ачаалахад алдаа гарлаа");
      }
    };

    fetchHistory();
    fetchStats();
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) return <p>Шалгалтын түүхийг ачаалж байна...</p>;

  return (
    <div className="lesson-page">
      <div className="header">
        <h1>Бүх хэрэглэгчийн шалгалтын түүх</h1>
      </div>

      <div className="stats-cards">
        <div className="stats-card">
          <div className="stats-card-label">Нийт хэрэглэгч</div>
          <div className="stats-card-value">{stats.totalUsers}</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-label">Нийт өгсөн шалгалт</div>
          <div className="stats-card-value">{stats.totalExamsTaken}</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-label">Дундаж оноо</div>
          <div className="stats-card-value">
            {Number(stats.avgScore).toFixed(2)}
          </div>
        </div>
      </div>
      {statsError && <p>{statsError}</p>}

      {history.length === 0 ? (
        <p>Одоогоор шалгалт өгөөгүй байна.</p>
      ) : (
        <CustomTable
          headers={[
            "Хэрэглэгч",
            "Хичээл",
            "Оноо",
            "Зарцуулсан хугацаа",
            "Огноо",
            "Үйлдэл",
          ]}
        >
          {history.map((h) => (
            <tr key={h.id}>
              <td>{h.user_name}</td>
              <td>{h.lesson_name}</td>
              <td>{h.score}</td>
              <td>{formatTime(h.time_taken)}</td>
              <td>{new Date(h.created_at).toLocaleString()}</td>
              <td>
                <CustomButton
                  variant="primary-outline"
                  onClick={() => navigate(`/admin/exam/result/${h.id}`)}
                >
                  Хариултыг харах
                </CustomButton>
              </td>
            </tr>
          ))}
        </CustomTable>
      )}
    </div>
  );
}

