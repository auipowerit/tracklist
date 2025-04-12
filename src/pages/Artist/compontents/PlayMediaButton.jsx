import { faHeadphones } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "react-tooltip";

export default function PlayMediaButton() {
  return (
    <div
      className="cursor-pointer transition-all duration-300 hover:text-gray-400"
      data-tooltip-id="play-tooltip"
      data-tooltip-content="Listen"
    >
      <FontAwesomeIcon icon={faHeadphones} />
      <Tooltip id="play-tooltip" place="top" type="dark" effect="float" />
    </div>
  );
}
