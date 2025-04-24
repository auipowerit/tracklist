import { useNavigate } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./shared-buttons.scss";

export default function BackButton() {
  const navigate = useNavigate();

  function handleClick() {
    navigate(-1);
  }

  return (
    <button onClick={handleClick} className="back-btn">
      <FontAwesomeIcon icon={faArrowLeft} />
      <p>Back</p>
    </button>
  );
}
