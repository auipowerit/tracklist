import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ListHeader({ username, name, tags }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1 text-lg">
        <FontAwesomeIcon icon={faUserCircle} />
        <p className="font-semibold">{username} </p>
      </div>
      <div className="flex items-center justify-between align-middle">
        <p className="text-2xl text-gray-400">{name}</p>
        <div className="flex gap-2">
          {tags.map((tag, index) => {
            return (
              <p key={index} className="rounded-sm bg-gray-600 p-2">
                {tag}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
