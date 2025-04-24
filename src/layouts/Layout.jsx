import Navbar from "./Navbar";
import ToTop from "./ToTop.jsx";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import "./styles/general.scss";

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
