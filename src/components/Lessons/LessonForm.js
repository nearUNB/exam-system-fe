import { useEffect, useState } from "react";
import api from "../../services/api";

export default function LessonForm({
  fetchLessons,
  editingLesson,
  setEditingLesson,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (editingLesson) {
      setTitle(editingLesson.title);
      setDescription(editingLesson.description);
      setImage(null);
    } else {
      setTitle("");
      setDescription("");
      setImage(null);
    }
  }, [editingLesson]);

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
        setEditingLesson(null);
      } else {
        await api.post("/lessons", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchLessons();
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border mb-4">
      <h2>{editingLesson ? "Хичээл засах" : "Хичээл нэмэх"}</h2>
      <div>
        <label>Гарчиг:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Тайлбар:</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Зураг:</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      </div>
      <button type="submit">{editingLesson ? "Шинэчлэх" : "Нэмэх"}</button>
      {editingLesson && (
        <button type="button" onClick={() => setEditingLesson(null)}>
          Болих
        </button>
      )}
    </form>
  );
}
