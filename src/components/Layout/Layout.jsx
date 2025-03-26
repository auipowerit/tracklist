import Navbar from "./Navbar";
import ToTopButton from "../Buttons/ToTopButton";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />

      <main className="h-full">
        <Outlet />
      </main>

      <ToTopButton />
    </div>
  );
}
