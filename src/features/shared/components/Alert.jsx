import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles/alert.scss";

export default function Alert({ message }) {
  return (
    <div className={`alert-container ${message && "active"}`}>
      <FontAwesomeIcon icon={faCircleExclamation} className="alert-icon" />
      <p>{message}</p>
    </div>
  );
}
