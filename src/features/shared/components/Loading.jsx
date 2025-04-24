import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Loading() {
  return (
    <div className="flex h-[80vh] flex-col justify-center gap-4 text-center text-5xl">
      <FontAwesomeIcon icon={faSpinner} spin />
      <p>Loading...</p>
    </div>
  );
}
