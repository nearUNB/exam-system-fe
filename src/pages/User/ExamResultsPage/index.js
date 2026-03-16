import ExamResults from "../../../components/User/ExamResults/ExamResults";
import usePageTitle from "../../../hooks/usePageTitle";

export default function ExamResultsPage() {
  usePageTitle("Шалгалтын үр дүн");
  return <ExamResults />;
}
