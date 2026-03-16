import { useEffect, useState } from "react";
import api from "../../services/api";
import "./LessonList.css";
import { useNavigate } from "react-router-dom";
import CustomButton from "../Common/CustomButton";
import CustomTable from "../Common/CustomTable";
import CustomModal from "../Common/CustomModal";

export default function LessonList() {
  const [lessons, setLessons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const fetchLessons = async () => {
    try {
      const res = await api.get("/lessons");
      setLessons(res.data.lessons);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const openCreateModal = () => {
    setEditingLesson(null);
    setTitle("");
    setDescription("");
    setImage(null);
    setModalOpen(true);
  };

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    setTitle(lesson.title);
    setDescription(lesson.description);
    setImage(null);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      if (editingLesson) {
        await api.put(`/lessons/${editingLesson.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/lessons", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchLessons();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await api.delete(`/lessons/${id}`);
      fetchLessons();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="lesson-page">
      <div className="header">
        <h1>Хичээлүүд</h1>
        <CustomButton variant="primary" onClick={openCreateModal}>
          + Нэмэх
        </CustomButton>
      </div>

      <CustomTable headers={["Гарчиг", "Тайлбар", "Зураг", "Үйлдэл"]}>
        {lessons.map((lesson) => (
          <tr key={lesson.id}>
            <td>{lesson.title}</td>
            <td>{lesson.description}</td>
            <td>
              {lesson.image_url && (
                <img
                  src={`${process.env.REACT_APP_API_URL + lesson.image_url}`}
                  width="80"
                  alt={lesson.title}
                />
              )}
            </td>
            <td>
              <CustomButton
                variant="primary-outline"
                onClick={() =>
                  navigate(`/admin/lessons/${lesson.id}/questions`)
                }
              >
                Асуултууд
              </CustomButton>
              <CustomButton
                variant="primary-outline"
                onClick={() => openEditModal(lesson)}
              >
                Засах
              </CustomButton>
              <CustomButton
                variant="danger-outline"
                onClick={() => handleDelete(lesson.id)}
              >
                Устгах
              </CustomButton>
            </td>
          </tr>
        ))}
      </CustomTable>

      <CustomModal
        isOpen={modalOpen}
        title={editingLesson ? "Хичээл засах" : "Хичээл нэмэх"}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Гарчиг"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Тайлбар"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <div className="modal-actions">
            <CustomButton type="submit">
              {editingLesson ? "Шинэчлэх" : "Нэмэх"}
            </CustomButton>
            <CustomButton type="button" onClick={closeModal}>
              Болих
            </CustomButton>
          </div>
        </form>
      </CustomModal>
    </div>
  );
}
