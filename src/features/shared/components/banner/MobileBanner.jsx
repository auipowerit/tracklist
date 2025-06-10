import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../buttons/Button";
import "./mobile-banner.scss";

export default function MobileBanner({
  title,
  link,
  icon = false,
  canGoBack = false,
  onClick,
}) {
  return (
    <section className="mobile-banner">
      {(canGoBack || onClick) && <BackButton onClick={onClick} />}
      {link ? (
        <Link to={link} className="mobile-banner__title">
          <h1>{title}</h1>
        </Link>
      ) : icon ? (
        <img
          src="/images/logo/logo-primary-small.png"
          className="mobile-banner__logo"
        />
      ) : (
        <h1 className="mobile-banner__title">{title}</h1>
      )}
    </section>
  );
}

function BackButton({ onClick }) {
  const handleClick = () => {
    window.history.back();
  };

  const canGoBack =
    window.history.length > 1 &&
    window.history.state &&
    window.history.state.idx > 0;

  // If the user can't go back, don't show the button
  if (!canGoBack && !onClick) {
    return null;
  }

  return (
    <Button onClick={onClick || handleClick} classes="mobile-banner__back">
      <FontAwesomeIcon icon={faArrowLeft} />
    </Button>
  );
}
