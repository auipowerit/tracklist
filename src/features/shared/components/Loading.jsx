import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles/loading.scss";

export default function Loading() {
  return (
    <div className="loading">
      <FontAwesomeIcon icon={faMusic} bounce className="loading__icon" />
    </div>
  );
}
