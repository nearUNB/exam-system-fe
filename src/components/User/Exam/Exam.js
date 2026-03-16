import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./Exam.css";
import CustomButton from "../../Common/CustomButton";

export default function ExamPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const timerRef = useRef();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/exams/lesson/${lessonId}`);
        setQuestions(res.data.questions);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, [lessonId]);

  const autoSubmitExam = useCallback(async () => {
    try {
      const formattedAnswers = questions.map((q) => ({
        question_id: q.id,
        answer_id: answers[q.id] || null,
      }));

      const res = await api.post("/exams/submit", {
        lessonId,
        answers: formattedAnswers,
        time_taken: 600,
        remaining_time: 0,
      });

      navigate(`/user/exam/result/${res.data.result.id}`);
    } catch (err) {
      console.error(err);
    }
  }, [answers, lessonId, navigate, questions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          autoSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoSubmitExam]);

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async (auto = false) => {
    clearInterval(timerRef.current);

    const formattedAnswers = questions.map((q) => ({
      question_id: q.id,
      answer_id: answers[q.id] || null,
    }));

    try {
      const res = await api.post("/exams/submit", {
        lessonId,
        answers: formattedAnswers,
        time_taken: 600 - timeLeft,
        remaining_time: timeLeft,
      });

      if (auto) alert("Time is up! Exam has been submitted automatically.");

      navigate(`/user/exam/result/${res.data.result.id}`);
    } catch (err) {
      console.error(err);
      if (auto)
        alert(
          "Time is up! Failed to submit automatically. Try submitting manually.",
        );
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="exam-container">
      <div className="exam-header">
        <h1>Шалгалт</h1>
        <div className={`timer ${timeLeft <= 10 ? "timer-alert" : ""}`}>
          Үлдсэн хугацаа: {formatTime(timeLeft)}
        </div>
      </div>

      <form
        className="exam-form"
        onSubmit={(e) => {
          e.preventDefault();
          const confirmSubmit = window.confirm("Та шалгалтыг илгээхдээ итгэлтэй байна уу?");
          if (!confirmSubmit) return;
          handleSubmit();
        }}
      >
        {questions.map((q, idx) => (
          <div className="question-card" key={q.id}>
            <h3>
              {idx + 1}. {q.question_text}
            </h3>
            {q.media_url && (
              <div className="question-media">
                {q.media_type === "image" && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}${q.media_url}`}
                    alt="q"
                  />
                )}
                {q.media_type === "audio" && (
                  <audio
                    controls
                    src={`${process.env.REACT_APP_API_URL}${q.media_url}`}
                  />
                )}
                {q.media_type === "video" && (
                  <video
                    controls
                    width={300}
                    src={`${process.env.REACT_APP_API_URL}${q.media_url}`}
                  />
                )}
              </div>
            )}
            <div className="answers-list">
              {q.answers.map((a) => (
                <label key={a.id}>
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={a.id}
                    checked={answers[q.id] === a.id}
                    onChange={() => handleAnswerSelect(q.id, a.id)}
                  />
                  {a.answer_text}
                </label>
              ))}
            </div>
          </div>
        ))}

        <CustomButton type="submit" variant="primary" className="submit-btn">
          Шалгалтыг илгээх
        </CustomButton>
      </form>
    </div>
  );
}
