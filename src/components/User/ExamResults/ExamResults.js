import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./ExamResults.css";
import { jwtDecode } from "jwt-decode";
import CustomButton from "../../Common/CustomButton";

export default function ExamResultPage() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(
          role === "admin"
            ? `/exam-results/admin/${resultId}`
            : `/exam-results/${resultId}`,
        );
        setResult(res.data.result);
        setAnswers(res.data.user_answers);
        setQuestions(res.data.questions);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Үр дүнг ачаалах үед алдаа гарлаа");
      }
    };
    if (role) {
      fetchResult();
    }
  }, [resultId, role]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) return <p>Үр дүнг ачаалж байна...</p>;

  return (
    <div className="exam-result-page">
      <h1>Шалгалтын үр дүн</h1>
      <p>
        Оноо: {result.score} / {questions.length}
      </p>
      <p>Зарцуулсан хугацаа: {formatTime(result.time_taken)}</p>
      <p>Үлдсэн хугацаа: {formatTime(result.remaining_time)}</p>

      <h2>Асуултуудын тойм</h2>
      {questions.map((q, idx) => {
        const userAnswer = answers.find((a) => a.question_id === q.id);
        const correctAnswer = q.answers.find((a) => a.is_correct);
        const isCorrect = userAnswer?.answer_id === correctAnswer?.id;

        return (
          <div
            key={q.id}
            className={`question-card ${isCorrect ? "correct" : "incorrect"}`}
          >
            <p>
              {idx + 1}. {q.question_text}
            </p>
            {q.media_url && q.media_type === "image" && (
              <img
                src={`${process.env.REACT_APP_API_URL}${q.media_url}`}
                alt="question"
                width={200}
              />
            )}
            {q.media_url && q.media_type === "audio" && (
              <audio
                controls
                src={`${process.env.REACT_APP_API_URL}${q.media_url}`}
              />
            )}
            {q.media_url && q.media_type === "video" && (
              <video
                controls
                width={300}
                src={`${process.env.REACT_APP_API_URL}${q.media_url}`}
              />
            )}
            <p>
              Таны хариулт:{" "}
              {userAnswer
                ? q.answers.find((a) => a.id === userAnswer.answer_id)
                    ?.answer_text
                : "Хариулт сонгоогүй"}
            </p>
            <p>Зөв хариулт: {correctAnswer?.answer_text}</p>
          </div>
        );
      })}

      <CustomButton
        variant="primary-outline"
        onClick={() => navigate("/")}
        style={{ marginTop: "20px" }}
      >
        Хичээл рүү буцах
      </CustomButton>
    </div>
  );
}
