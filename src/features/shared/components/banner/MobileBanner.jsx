import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../buttons/Button";
import "./mobile-banner.scss";

export default function MobileBanner({ title, icon = false, onClick, link }) {
  return (
    <section className="mobile-banner">
      {onClick && <BackButton onClick={onClick} />}
      {link ? (
        <Link to={link} className="mobile-banner__title">
          <h1>{title}</h1>
        </Link>
      ) : icon ? (
        <img
          src="/images/logo/logo-primary-01.png"
          alt="TrackList"
          className="mobile-banner__logo"
        />
      ) : (
        <h1 className="mobile-banner__title">{title}</h1>
      )}
    </section>
  );
}

function BackButton({ onClick }) {
  return (
    <Button onClick={onClick} classes="mobile-banner__back">
      <FontAwesomeIcon icon={faArrowLeft} />
    </Button>
  );
}
