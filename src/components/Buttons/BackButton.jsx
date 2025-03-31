import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BackButton({ targetURL }) {
  return (
    <Link
      to={targetURL}
      className="flex w-fit items-center gap-2 rounded-sm bg-green-700 px-3 py-2 hover:text-gray-400"
    >
      <FontAwesomeIcon icon={faArrowLeft} />
      Back
    </Link>
  );
}
