import { useEffect, useRef, useState } from "react";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "../../context/Auth/AuthContext";
import FormInput from "../Inputs/FormInput";

export default function AddToList(props) {
  const { isModalOpen, setIsModalOpen, media, category, setNewList } = props;
  const { mediaId, mediaName } = media;

  const { globalUser, getUserLists, addMediaToList } = useAuthContext();

  const inputRef = useRef(null);
  const [lists, setLists] = useState(null);
  const [currentLists, setCurrentLists] = useState([]);
  const [results, setResults] = useState([]);

  function searchForList() {
    if (!globalUser) return;

    const searchString = inputRef.current.value;

    if (searchString === "") {
      setResults([]);
      return;
    }

    const filteredLists = lists.filter((item) =>
      item.name.toLowerCase().includes(searchString.toLowerCase()),
    );
    setResults(filteredLists);
  }

  function addToCurrentLists(list) {
    setCurrentLists([...currentLists, list.name]);

    inputRef.current.value = "";
    setResults([]);
    setLists(lists.filter((item) => item.name !== list.name));
  }

  function removeFromCurrentLists(name) {
    setCurrentLists(currentLists.filter((item) => item !== name));
    setLists([...lists, { name }]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!globalUser) return;

    if (currentLists.length === 0) return;

    for (const list of currentLists) {
      await addMediaToList(mediaId, category, list, globalUser.uid);
    }

    setIsModalOpen(false);
    resetValues();
  }

  function resetValues() {
    inputRef.current.value = "";
    setLists(null);
    setResults([]);
    setCurrentLists([]);
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

      <div className="flex flex-col">
        <div className="flex w-full items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <FormInput
                type="text"
                ref={inputRef}
                onKeyUp={searchForList}
                placeholder="List name"
                classes="border-1 border-white"
              />
              <div
                className={`absolute top-10 right-0 left-0 flex w-full flex-col items-start bg-green-700 ${results.length > 0 && "overflow-auto p-2"}`}
              >
                {results?.map((list, index) => {
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addToCurrentLists(list)}
                      className="hover:text-gray-400"
                    >
                      {list.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setNewList(true)}
              className="flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              <p>New List</p>
            </button>
          </div>
        </div>
        <div
          className={`flex h-20 flex-col items-start gap-2 overflow-auto p-2`}
        >
          {currentLists?.map((name, index) => {
            return (
              <div
                key={index}
                className="flex items-center gap-2 rounded-sm bg-gray-700 px-2 py-1"
              >
                <p>{name}</p>
                <button
                  type="button"
                  onClick={() => removeFromCurrentLists(name)}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            );
          })}
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
