import Navbar from "./navbar/Navbar.jsx";
import ToTop from "./buttons/ToTop.jsx";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="wrapper">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <ToTop />
      <Footer />
    </div>
  );
}
