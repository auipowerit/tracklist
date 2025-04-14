import Navbar from "./Navbar";
import ToTop from "./ToTop.jsx";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <ToTop />

      <Footer />
    </div>
  );
}
