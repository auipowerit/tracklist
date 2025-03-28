import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ListHeader({ user, name, tags }) {
  return (
    <div className="flex items-end justify-between gap-2 border-b-2 border-white pb-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1 text-lg">
          <FontAwesomeIcon icon={faUserCircle} />
          <p className="font-semibold">{user.username} </p>
        </div>
        <p className="text-4xl text-gray-400">{name}</p>
      </div>

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
  );
}
