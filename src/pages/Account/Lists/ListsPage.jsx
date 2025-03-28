import { useEffect, useState } from "react";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import Loading from "../../../components/Loading";
import { Link } from "react-router-dom";

export default function ListsPage() {
  const { globalUser, getUserLists } = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);
  const [lists, setLists] = useState(null);

  useEffect(() => {
    const fetchLists = async () => {
      if (!globalUser) return;

      setIsLoading(true);

      try {
        const fetchedLists = await getUserLists(globalUser.uid);
        setLists(fetchedLists);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, [globalUser]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="m-auto w-fit">
      <p className="w-fit border-b-1 border-white text-4xl">Your Lists</p>
      {lists && (
        <ul className="flex w-full flex-col gap-4">
          {lists.map((list) => {
            return (
              <li
                key={list.id}
                className="mt-4 w-full cursor-pointer rounded-md p-4 hover:bg-gray-400"
              >
                <Link to={`${list.id}`}>
                  <p className="font-bold">{list.name}</p>
                  <p>{list.tagArray}</p>
                  <div className="flex items-center justify-center gap-2">
                    {list.tags.map((tag, index) => {
                      return (
                        <p
                          key={index}
                          className="rounded-sm bg-gray-600 px-2 py-1"
                        >
                          {tag}
                        </p>
                      );
                    })}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
