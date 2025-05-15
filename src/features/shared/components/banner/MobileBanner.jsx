import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../buttons/Button";
import "./mobile-banner.scss";

export default function MobileBanner({ title, onClick }) {
  return (
    <section className="mobile-banner">
      {onClick && <BackButton onClick={onClick} />}
      <h1 className="mobile-banner__title">{title}</h1>
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
