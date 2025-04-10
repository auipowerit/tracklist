import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "react-tooltip";

export default function ShareMediaButton() {
  return (
    <div
      className="cursor-pointer transition-all duration-300 hover:text-gray-400"
      data-tooltip-id="share-tooltip"
      data-tooltip-content="Share"
    >
      <FontAwesomeIcon icon={faShare} />
      <Tooltip id="share-tooltip" place="top" type="dark" effect="float" />
    </div>
  );
}
