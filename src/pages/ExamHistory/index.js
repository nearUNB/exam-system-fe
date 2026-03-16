import ExamHistory from "../../components/ExamHistory/ExamHistory";
import usePageTitle from "../../hooks/usePageTitle";

export default function AdminExamHistoryPage() {
  usePageTitle("Шалгалтын түүх");
  return <ExamHistory />;
}
