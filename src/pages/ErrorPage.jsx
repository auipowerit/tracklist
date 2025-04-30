import { Link, useRouteError } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/error.scss";

export default function ErrorPage({ is404 }) {
  const error = useRouteError();

  const errorMessage = is404
    ? "404 - Page Not Found"
    : "Oops! Something went wrong :(";

  return (
    <div className="error-container">
      <FontAwesomeIcon icon={faExclamationTriangle} className="error-logo" />

      <h1 className="error-header">{errorMessage}</h1>
      {error && <p className="error-message">"{error.message}"</p>}

      <Link to="/" className="error-button">
        <FontAwesomeIcon icon={faHome} />
        Go to home
      </Link>
    </div>
  );
}
