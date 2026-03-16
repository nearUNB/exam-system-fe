import ChangePassword from "../components/ChangePassword/ChangePassword";
import usePageTitle from "../hooks/usePageTitle";

export default function ChangePasswordPage() {
  usePageTitle("Нууц үг солих");
  return <ChangePassword />;
}
