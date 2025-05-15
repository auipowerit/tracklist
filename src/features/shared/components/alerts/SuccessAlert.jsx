import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Button from "../buttons/Button";
import "./success-alert.scss";

export default function SuccessAlert({ message, link, icon, onClick }) {
  return (
    <div className="success">
      <div className="success__message">
        <FontAwesomeIcon icon={faCircleCheck} /> <p>{message}</p>
      </div>

      <Button onClick={onClick} classes="success__button" ariaLabel="continue">
        <p>{link}</p>
        <FontAwesomeIcon icon={icon} />
      </Button>
    </div>
  );
}
