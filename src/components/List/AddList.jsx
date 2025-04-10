import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useListContext } from "src/context/List/ListContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import FormInput from "../Inputs/FormInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function AddList(props) {
  const { isModalOpen, setIsModalOpen, mediaId, listId, category, setNewList } =
    props;

  const { globalUser } = useAuthContext();
  const { getListsByUserId, addToList, getListById } = useListContext();
  const { defaultImg, getMediaById, searchByName } = useSpotifyContext();

  const [media, setMedia] = useState(null);
  const [listResults, setListResults] = useState([]);
  const [mediaResults, setMediamediaResults] = useState([]);
  const [lists, setLists] = useState([]);
  const [currentLists, setCurrentLists] = useState([]);
  const [type, setType] = useState("artist");

  const mediaInputRef = useRef(null);
  const listInputRef = useRef(null);

  async function handleSearch() {
    const data = await searchByName(mediaInputRef.current.value, type, 20);

    const items =
      data?.artists?.items || data?.albums?.items || data?.tracks?.items || [];

    const ids = items.map((item) => item?.id) || [];
    const names = items.map((item) => item?.name) || [];
    const subtitles = items.map((item) => item.artists?.[0].name || []) || [];

    setMediamediaResults(
      ids.map((id, index) => ({
        id,
        name: names[index],
        subtitle: subtitles[index],
      })),
    );
  }

  function handleChange(e) {
    setType(e.target.value);

    setMediamediaResults([]);
    setMedia(null);
  }

  async function handleClick(id, name) {
    mediaInputRef.current.value = name;

    const fetchedMedia = await getMediaById(id, type);
    setMedia(fetchedMedia);

    setMediamediaResults([]);
  }

  function searchForList() {
    if (!globalUser) return;

    const searchString = listInputRef.current.value;

    if (searchString === "") {
      setListResults([]);
      return;
    }

    const filteredLists = lists.filter((item) =>
      item.name.toLowerCase().includes(searchString.toLowerCase()),
    );

    setListResults(filteredLists);
  }

  function addToCurrentLists(list) {
    setCurrentLists([...currentLists, list.name]);

    listInputRef.current.value = "";
    setListResults([]);
    setLists(lists.filter((item) => item.name !== list.name));
  }

  function removeFromCurrentLists(name) {
    setCurrentLists(currentLists.filter((item) => item !== name));
    setLists([...lists, { name }]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!globalUser || !media) return;

    if (currentLists.length === 0) return;

    for (const list of currentLists) {
      await addToList(media.id, type, list, globalUser.uid);
    }

    setIsModalOpen(false);
    resetValues();
    window.location.reload();
  }

  function resetValues() {
    setMedia(null);
    setListResults([]);
    setMediamediaResults([]);
    setLists([]);
    setCurrentLists([]);
    setType("artist");
    mediaInputRef.current.value = "";
    listInputRef.current.value = "";
  }

  useEffect(() => {
    const fetchData = async () => {
      if (listId) {
        const fetchedList = await getListById(listId, globalUser.uid);
        setCurrentLists([fetchedList.name]);
      }

      if (!mediaId || !category) return;

      const fetchedMedia = await getMediaById(mediaId, category);
      if (mediaInputRef.current) {
        mediaInputRef.current.value = fetchedMedia.name;
      }
      setMedia(fetchedMedia);
      setType(category);

      const fetchedLists = await getListsByUserId(globalUser.uid);
      setLists(fetchedLists);
    };

    if (isModalOpen) resetValues();

    return fetchData;
  }, [isModalOpen]);

  return (
    <form
      onSubmit={handleSubmit}
      className="m-auto flex w-full flex-col items-center justify-center gap-6 py-6"
    >
      <p className="w-full border-b-1 border-white pb-2 text-left text-2xl font-bold">
        Add to list
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-center gap-6">
          <img
            src={media?.image || defaultImg}
            className="aspect-square h-48 object-cover shadow-lg"
          />

          <div className="flex flex-col gap-2">
            <div className="relative flex gap-2">
              <FormInput
                type="search"
                ref={mediaInputRef}
                placeholder={`Search for ${type === "track" ? "a " : "an "}${type}...`}
                onKeyUp={handleSearch}
                classes="border-1"
              />

              <select value={type} onChange={handleChange}>
                <option value="artist">artist</option>
                <option value="album">album</option>
                <option value="track">song</option>
              </select>

              <div
                className={`absolute top-10 right-0 left-0 z-10 flex flex-col bg-green-700 ${mediaResults.length > 0 && "h-46 overflow-auto"}`}
              >
                {mediaResults.map(({ id, name, subtitle }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleClick(id, name)}
                    className="px-2 py-1 text-start hover:bg-gray-600"
                  >
                    <p>{name}</p>
                    {type !== "artist" && <p className="text-sm">{subtitle}</p>}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex gap-2">
              <FormInput
                type="search"
                ref={listInputRef}
                placeholder="Search for a list..."
                onKeyUp={searchForList}
                classes="border-1"
              />

              <div
                className={`absolute top-10 right-0 left-0 flex w-full flex-col items-start bg-green-700 ${listResults.length > 0 && "overflow-auto p-2"}`}
              >
                {listResults?.map((list, index) => {
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

            <div className="flex h-20 flex-col items-start gap-2 overflow-auto p-2">
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
        </div>
        <button
          type="submit"
          className="m-auto flex w-fit items-center gap-2 rounded-sm bg-green-700 px-3 py-1"
        >
          <FontAwesomeIcon icon={faPlus} />
          <p>Add</p>
        </button>
      </div>
    </form>
  );
}
