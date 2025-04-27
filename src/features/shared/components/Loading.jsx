import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles/loading.scss";

export default function Loading() {
  return (
    <div className="loading-container">
      <FontAwesomeIcon icon={faSpinner} spin />
      <p>Loading...</p>
    </div>
  );
}
