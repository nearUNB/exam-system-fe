import { Link, Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import "./Layout.css";

export default function AdminLayout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
