import Navbar from "./Navbar";
import ToTopButton from "../Buttons/ToTopButton";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <ToTopButton />

      <Footer />
    </div>
  );
}
