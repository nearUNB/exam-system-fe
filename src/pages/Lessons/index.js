import Lesson from "../../components/Lessons/LessonList";
import usePageTitle from "../../hooks/usePageTitle";

export default function LessonPage() {
  usePageTitle("Админ хичээлүүд");
  return <Lesson />;
}
