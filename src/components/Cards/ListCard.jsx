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
    <Link
      to={`${id}`}
      className="border-box mt-6 flex cursor-pointer gap-4 hover:bg-gray-800"
    >
      <img src={image} className="w-46" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <p className="text-2xl font-bold">{name}</p>
          <p className="text-gray-400">
            {length === 0 ? "No" : length} {length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <p>{description}</p>
      </div>
    </Link>
  );
}
