import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../buttons/Button";
import "./mobile-banner.scss";

export default function MobileBanner(props) {
  const { title, link, icon = false, canGoBack = false, onClick } = props;

  return (
    <section className="mobile-banner">
      {(canGoBack || onClick) && <BackButton onClick={onClick} />}
      <Title title={title} link={link} />
      <Logo icon={icon} />
    </section>
  );
}

function Title({ title, link }) {
  if (link) {
    return (
      <Link to={link} className="mobile-banner__title">
        <h1>{title}</h1>
      </Link>
    );
  }

  return <h1 className="mobile-banner__title">{title}</h1>;
}

function Logo({ icon }) {
  if (icon) {
    return (
      <img
        src="/images/logo/logo-primary-small.png"
        className="mobile-banner__logo"
      />
    );
  }
}

function BackButton({ onClick }) {
  const canGoBack =
    window.history.length > 1 &&
    window.history.state &&
    window.history.state.idx > 0;

  const handleClick = () => {
    window.history.back();
  };

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
