import Navbar from "./Navbar";
import ToTopButton from "../Buttons/ToTopButton";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <ToTopButton />
    </div>
  );
}
