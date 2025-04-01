import { faPlus, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/context/Auth/AuthContext";

export default function UserCard({ user }) {
  const { globalUser, followUser } = useAuthContext();

  async function handleClick() {
    if (!globalUser) return;

    await followUser(globalUser.uid, user.id);
  }

  return (
    <div className="border-whit2 flex cursor-pointer items-center justify-evenly gap-4 rounded-lg border-2 px-6 py-4 text-white transition-all duration-200 hover:scale-110">
      <FontAwesomeIcon icon={faUserCircle} className="text-5xl" />
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-xl font-bold">{user.username}</p>
        <p className="text-xl">{user.displayname}</p>
      </div>

      <button
        onClick={handleClick}
        className="flex items-center gap-1 rounded-md bg-green-700 p-3 text-2xl hover:text-gray-400"
      >
        <FontAwesomeIcon icon={faPlus} />
        <p>Follow</p>
      </button>
    </div>
  );
}
