import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./ExamHistory.css";
import CustomButton from "../../Common/CustomButton";
import CustomTable from "../../Common/CustomTable";

export default function ExamHistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/exam-history");
        setHistory(res.data.history || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Шалгалтын түүхийг ачаалах үед алдаа гарлаа");
      }
    };
    fetchHistory();
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
        <h1>Миний шалгалтын түүх</h1>
      </div>

      {history.length === 0 ? (
        <p>Одоогоор шалгалт өгөөгүй байна.</p>
      ) : (
        <CustomTable
          headers={["Хичээл", "Оноо", "Зарцуулсан хугацаа", "Огноо", "Үйлдэл"]}
        >
          {history.map((h) => (
            <tr key={h.id}>
              <td>{h.lesson_name}</td>
              <td>{h.score}</td>
                <td>{formatTime(h.time_taken)}</td>
              <td>{new Date(h.created_at).toLocaleString()}</td>
              <td>
                <CustomButton
                  variant="primary-outline"
                  onClick={() => navigate(`/user/exam/result/${h.id}`)}
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