import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./mobile-banner.scss";

export default function MobileBanner({ title, onClick }) {
  return (
    <div className="mobile-banner">
      {onClick && <BackButton onClick={onClick} />}
      <h1 className="mobile-banner__title">{title}</h1>
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button onClick={onClick} className="mobile-banner__back">
      <FontAwesomeIcon icon={faArrowLeft} />
    </button>
  );
}
