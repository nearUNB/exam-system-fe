import Register from "../components/Register/Register";
import usePageTitle from "../hooks/usePageTitle";

export default function RegisterPage() {
  usePageTitle("Бүртгүүлэх");
  return <Register />;
}
