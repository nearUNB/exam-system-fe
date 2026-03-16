import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./LessonsPage.css";
import CustomButton from "../../Common/CustomButton";

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await api.get("/lessons");
        setLessons(res.data.lessons || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLessons();
  }, []);

  const handleSelectLesson = (id) => {
    navigate(`/user/exam/${id}`);
  };

  return (
    <div className="lessons-container">
      <h1 className="lessons-title">Боломжтой хичээлүүд</h1>
      <div className="lessons-grid">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="lesson-card"
            onClick={() => handleSelectLesson(lesson.id)}
          >
            {lesson.image_url ? (
              <img
                src={`${process.env.REACT_APP_API_URL}${lesson.image_url}`}
                alt={lesson.title}
                className="lesson-card-image"
              />
            ) : (
              <div className="lesson-card-placeholder">Зураг алга</div>
            )}
            <div className="lesson-card-content">
              <h2>{lesson.title}</h2>
              <p>{lesson.description}</p>
              <CustomButton
                className="start-test-btn"
                variant="primary"
                onClick={() => handleSelectLesson(lesson.id)}
              >
                Шалгалт эхлэх
              </CustomButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
