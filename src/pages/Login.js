import Login from "../components/Login/Login";
import usePageTitle from "../hooks/usePageTitle";

export default function LoginPage() {
  usePageTitle("Нэвтрэх");
  return <Login />;
}
