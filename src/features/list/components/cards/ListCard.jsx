import { Tooltip } from "react-tooltip";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./list-card.scss";

export default function ListCard({ image, list }) {
  return (
    <div className="list-card">
      <Image image={image} />
      <div className="list-card__info">
        <div className="list-card__header">
          <div className="list-card__title">
            {list.isPrivate && <LockIcon />}
            <p className="list-card__name">{list.name}</p>
          </div>

          <Count list={list} />
        </div>
        <Description list={list} />
      </div>
    </div>
  );
}

function Image({ image }) {
  return (
    <img src={image} className="list-card__image" alt="list media image" />
  );
}

function LockIcon() {
  return (
    <div data-tooltip-content="Private" data-tooltip-id="category-tooltip">
      <FontAwesomeIcon icon={faLock} className="list-card__icon" />
      <Tooltip id="category-tooltip" place="top" type="dark" effect="float" />
    </div>
  );
}

function Count({ list }) {
  return (
    <p className="list-card__count">
      {list.media.length === 0 ? "No" : list.media.length}&nbsp;
      {list.media.length === 1 ? "entry" : "entries"}
    </p>
  );
}

function Description({ list }) {
  return <p className="list-card__description">{list.description}</p>;
}
