import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { MdDeleteForever } from "react-icons/md";
import "./LessonList.css";
import CustomButton from "../Common/CustomButton";
import CustomTable from "../Common/CustomTable";
import CustomModal from "../Common/CustomModal";

export default function QuestionsPage() {
  const { lessonId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState([{ text: "" }, { text: "" }]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await api.get(`/questions/lesson/${lessonId}`);
      setQuestions(res.data.questions || []);
    } catch (err) {
      console.error(err);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchQuestions();
  }, [lessonId, fetchQuestions]);

  const openCreateModal = () => {
    setEditingQuestion(null);
    setQuestionText("");
    setAnswers([{ text: "" }, { text: "" }]);
    setFile(null);
    setPreview(null);
    setModalOpen(true);
  };

  const handleEditClick = async (id) => {
    try {
      const res = await api.get(`/questions/${id}`);
      const q = res.data;
      setEditingQuestion(q);
      setQuestionText(q.question_text || "");
      setAnswers(q.answers.map((a) => ({ text: a.answer_text })));
      setFile(null);
      setPreview(
        q.media_url ? `${process.env.REACT_APP_API_URL}${q.media_url}` : null,
      );
      setModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const addAnswer = () =>
    answers.length < 6 && setAnswers([...answers, { text: "" }]);
  const removeAnswer = (i) =>
    answers.length > 2 && setAnswers(answers.filter((_, idx) => idx !== i));

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ((!questionText || questionText.trim() === "") && !file)
      return alert("Provide text or media");
    if (answers.some((a) => !a.text)) return alert("Fill all answer fields");

    try {
      const formData = new FormData();
      formData.append("question_text", questionText);
      formData.append("answers", JSON.stringify(answers));
      if (!editingQuestion) formData.append("lesson_id", lessonId);
      if (file) formData.append("media", file);

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editingQuestion) {
        await api.put(`/questions/${editingQuestion.id}`, formData, config);
      } else {
        await api.post("/questions", formData, config);
      }

      setModalOpen(false);
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert("Error creating/updating question");
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  const renderMedia = (q) => {
    if (!q.media_url) return null;
    const url = `${process.env.REACT_APP_API_URL}${q.media_url}`;
    if (q.media_type === "image")
      return <img src={url} width={120} alt="media" />;
    if (q.media_type === "audio") return <audio controls src={url} />;
    if (q.media_type === "video")
      return <video controls width={200} src={url} />;
    return null;
  };

  return (
    <div className="lesson-page">
      <div className="header">
        <h1>Асуултууд</h1>
        <CustomButton variant="primary" onClick={openCreateModal}>
          + Асуулт нэмэх
        </CustomButton>
      </div>

      <CustomTable
        headers={["Асуулт", "Медиа", "Хариултууд", "Үйлдэл"]}
      >
        {questions.map((q) => (
          <tr key={q.id}>
            <td>{q.question_text}</td>
            <td>{renderMedia(q)}</td>
            <td>
              {q.answers?.map((a, i) => (
                <span key={i}>
                  {a.answer_text}
                  {a.is_correct ? " ✅" : ""}
                  {i < q.answers.length - 1 ? ", " : ""}
                </span>
              ))}
            </td>
            <td>
              <CustomButton
                variant="primary-outline"
                onClick={() => handleEditClick(q.id)}
              >
                Засах
              </CustomButton>
              <CustomButton
                variant="danger-outline"
                onClick={() => handleDelete(q.id)}
              >
                Устгах
              </CustomButton>
            </td>
          </tr>
        ))}
      </CustomTable>

      <CustomModal
        isOpen={modalOpen}
        title={editingQuestion ? "Асуулт засах" : "Асуулт нэмэх"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Асуултын текст"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />

          <input type="file" onChange={handleFileChange} />

          {preview && (
            <div style={{ margin: "8px 0" }}>
              {file?.type.startsWith("image/") ||
              (editingQuestion && editingQuestion.media_type === "image") ? (
                <img src={preview} width={120} alt="preview" />
              ) : file?.type.startsWith("audio/") ||
                (editingQuestion && editingQuestion.media_type === "audio") ? (
                <audio controls src={preview} />
              ) : (
                <video controls width={200} src={preview} />
              )}
            </div>
          )}

          {answers.map((a, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: "8px", marginBottom: 4 }}
            >
              <input
                type="text"
            placeholder={i === 0 ? "Зөв хариулт" : "Хариулт"}
                value={a.text}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[i].text = e.target.value;
                  setAnswers(newAnswers);
                }}
              />
              {answers.length > 2 && (
                <CustomButton
                  type="button"
                  variant="danger-outline"
                  onClick={() => removeAnswer(i)}
                >
                  <MdDeleteForever />
                </CustomButton>
              )}
            </div>
          ))}

          {answers.length < 6 && (
            <CustomButton
              type="button"
              variant="primary-outline"
              onClick={addAnswer}
              style={{ marginBottom: 10 }}
            >
              + Хариулт нэмэх
            </CustomButton>
          )}

          <div className="modal-actions">
            <CustomButton type="submit">
              {editingQuestion ? "Шинэчлэх" : "Нэмэх"}
            </CustomButton>
            <CustomButton type="button" onClick={() => setModalOpen(false)}>
              Болих
            </CustomButton>
          </div>
        </form>
      </CustomModal>
    </div>
  );
}
