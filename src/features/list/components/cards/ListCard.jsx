import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ListCard({ image, list }) {
  return (
    <div className="border-box flex cursor-pointer gap-4">
      <img src={image} className="h-48 w-48 object-cover" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {list.isPrivate && (
              <FontAwesomeIcon icon={faLock} className="text-gray-400" />
            )}
            <p className="text-2xl font-bold">{list.name}</p>
          </div>

          <p className="text-gray-400">
            {list.media.length === 0 ? "No" : list.media.length}{" "}
            {list.media.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <p>{list.description}</p>
      </div>
    </div>
  );
}
