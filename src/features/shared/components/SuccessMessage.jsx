import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export default function SuccessMessage({ message, link, icon, onClick }) {
  return (
    <div className="success-container">
      <div className="success-message">
        <FontAwesomeIcon icon={faCircleCheck} /> <p>{message}</p>
      </div>

      <button className="success-button" onClick={onClick}>
        <p>{link}</p>
        <FontAwesomeIcon icon={icon} />
      </button>
    </div>
  );
}
