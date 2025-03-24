import Navbar from "./Navbar";
import ToTopButton from "../Buttons/ToTopButton";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <ToTopButton />
    </>
  );
}
