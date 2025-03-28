import { useEffect, useRef, useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "../../context/Auth/AuthContext";

export default function AddToList(props) {
  const { isModalOpen, setIsModalOpen, media, category, setNewList } = props;
  const { mediaId, mediaName } = media;

  const { globalUser, getUserLists, addMediaToList } = useAuthContext();

  const inputRef = useRef(null);
  const [lists, setLists] = useState(null);
  const [results, setResults] = useState([]);

  function handleSearch() {
    if (!globalUser) return;

    const searchString = inputRef.current.value;

    if (searchString === "") {
      setResults([]);
      return;
    }

    const filteredLists = lists.filter((item) =>
      item.name.includes(searchString),
    );
    setResults(filteredLists);
  }

  function handleClick(list) {
    inputRef.current.value = list.name;
    setResults([]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!globalUser) return;

    const searchString = inputRef.current.value;
    if (searchString === "") return;

    await addMediaToList(mediaId, searchString, globalUser.uid);

    setIsModalOpen(false);
  }

  function resetValues() {
    inputRef.current.value = "";
    setLists(null);
    setResults([]);
    setNewList(false);
  }

  useEffect(() => {
    const fetchLists = async () => {
      if (!category || !globalUser || !mediaId || !mediaName) {
        setIsModalOpen(false);
        return;
      }

      const fetchedLists = await getUserLists(globalUser.uid);
      setLists(fetchedLists);
    };

    if (!isModalOpen) resetValues();

    return fetchLists;
  }, [isModalOpen]);

  return (
    <form
      onSubmit={handleSubmit}
      className="m-auto flex flex-col items-center justify-center gap-6 py-6 text-xl"
    >
      <p>Add "{mediaName}" to your list</p>

      <div className="flex w-full items-center justify-center gap-4">
        <div className="flex items-center justify-center gap-4">
          <div className="relative">
            <input
              ref={inputRef}
              onKeyUp={handleSearch}
              type="text"
              placeholder="List name"
              className="border-1 border-white px-2 py-1"
            />
            <div
              className={`absolute top-10 right-0 left-0 flex w-full flex-col items-start bg-green-700 ${results.length > 0 && "overflow-auto p-2"}`}
            >
              {results?.map((list, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => handleClick(list)}
                    className="hover:text-gray-400"
                  >
                    {list.name}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setNewList(true)}
            className="flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            <p>New List</p>
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="m-auto flex w-fit items-center gap-2 rounded-md bg-green-700 px-4 py-2"
      >
        <FontAwesomeIcon icon={faPlus} />
        <p>Add</p>
      </button>
    </form>
  );
}
