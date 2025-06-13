import { Tooltip } from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompactDisc,
  faMicrophoneLines,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";

export default function MediaIcon({ category, className }) {
  const icon =
    category === "track"
      ? faMusic
      : category === "album"
        ? faCompactDisc
        : faMicrophoneLines;

  const capitalizeFirstLetter = (str) => {
    return str[0].toUpperCase() + str.slice(1);
  };

  return (
    <div
      data-tooltip-content={capitalizeFirstLetter(category)}
      data-tooltip-id="category-tooltip"
    >
      <FontAwesomeIcon icon={icon} className={className} />
      <Tooltip id="category-tooltip" place="top" type="dark" effect="float" />
    </div>
  );
}
