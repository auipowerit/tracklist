import { Tooltip } from "react-tooltip";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./list-card.scss";

export default function ListCard({ image, list }) {
  return (
    <div className="list-card">
      <img src={image} />
      <div className="list-card-info-container">
        <div className="list-card-header">
          <div className="list-card-title-container">
            {list.isPrivate && (
              <div
                data-tooltip-content="Private"
                data-tooltip-id="category-tooltip"
              >
                <FontAwesomeIcon icon={faLock} className="list-card-lock" />
                <Tooltip
                  id="category-tooltip"
                  place="top"
                  type="dark"
                  effect="float"
                />
              </div>
            )}
            <p className="list-card-title">{list.name}</p>
          </div>

          <p className="list-card-count">
            {list.media.length === 0 ? "No" : list.media.length}&nbsp;
            {list.media.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <p className="list-card-description">{list.description}</p>
      </div>
    </div>
  );
}
