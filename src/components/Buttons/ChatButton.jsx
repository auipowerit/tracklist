import {
  faEnvelope,
  faInbox,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ChatButton({ username = "" }) {
  return (
    <Link to={`/messaging/${username}`}>
      {username ? (
        <FaPaperPlane className="cursor-pointer text-gray-400 hover:text-white" />
      ) : (
        <FontAwesomeIcon
          icon={faEnvelope}
          className="cursor-pointer text-gray-400 hover:text-white"
        />
      )}
    </Link>
  );
}
