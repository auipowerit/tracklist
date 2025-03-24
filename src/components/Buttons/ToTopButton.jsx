import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function ToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      window.scrollY > 200 ? setIsVisible(true) : setIsVisible(false);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      href="#"
      className={`fixed right-0 bottom-0 m-6 flex aspect-square cursor-pointer items-center justify-center rounded-full bg-green-900 p-3 text-center text-2xl text-white transition-all duration-200 hover:scale-120 ${isVisible ? "opacity-100" : "opacity-0"}`}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </button>
  );
}
