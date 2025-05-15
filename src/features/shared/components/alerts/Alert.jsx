import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./alert.scss";

export default function Alert({ message }) {
  return (
    <div className="alert" aria-expanded={message ? "true" : "false"}>
      <FontAwesomeIcon icon={faCircleExclamation} className="alert__icon" />
      <p>{message}</p>
    </div>
  );
}
