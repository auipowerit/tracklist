import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function UserCard({ user, onClick }) {
  return (
    <div
      className="border-whit2 flex cursor-pointer items-center justify-evenly gap-4 rounded-lg border-2 px-6 py-4 text-white transition-all duration-200 hover:scale-110"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faUserCircle} className="text-5xl" />
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-xl font-bold">{user.username}</p>
        <p className="text-xl">
          {user.firstname} {user.lastname}
        </p>
      </div>
    </div>
  );
}
