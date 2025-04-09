import { useNavigate } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BackButton() {
  const navigate = useNavigate();

  function handleClick() {
    navigate(-1);
  }

  return (
    <button
      onClick={handleClick}
      className="flex w-fit items-center gap-2 rounded-sm bg-green-700 px-2 py-1 hover:text-gray-400"
    >
      <FontAwesomeIcon icon={faArrowLeft} />
      <p>Back</p>
    </button>
  );
}
