import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/Auth/AuthContext";

export default function ListCard({ id, image, name, length, description }) {
  const { globalUser, deleteMediaList } = useAuthContext();

  async function deleteList(id) {
    if (!globalUser || !id) return;

    try {
      await deleteMediaList(id, globalUser.uid);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="border-box flex gap-4 border-t-1 border-white pt-6">
      <img src={image} className="w-46" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <Link to={`${id}`} className="text-2xl font-bold hover:text-gray-400">
            {name}
          </Link>
          <p className="text-gray-400">
            {length === 0 ? "No" : length} {length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
}
