import ExamHistory from "../../../components/User/ExamHistory/ExamHistory";
import usePageTitle from "../../../hooks/usePageTitle";

export default function ExamHistoryPage() {
  usePageTitle("Шалгалтын түүх");
  return <ExamHistory />;
}
