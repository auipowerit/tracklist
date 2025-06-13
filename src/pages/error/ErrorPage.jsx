import { Link, useRouteError } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import "./error.scss";

export default function ErrorPage({ is404 }) {
  const errorMessage = is404
    ? "404 - Page Not Found"
    : "Oops! Something went wrong :(";

  const error = useRouteError();

  return (
    <section className="error">
      <FontAwesomeIcon icon={faExclamationTriangle} className="error__icon" />

      <h1 className="error__header">{errorMessage}</h1>
      {error && <p className="error__message">"{error.message}"</p>}

      <Link to="/home" className="error__button">
        <FontAwesomeIcon icon={faHome} />
        Go to home
      </Link>
    </section>
  );
}
