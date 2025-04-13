import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useListContext } from "src/context/List/ListContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function AddToList(props) {
  const { isModalOpen, setIsModalOpen, mediaId, listId, category, setNewList } =
    props;

  const { globalUser } = useAuthContext();
  const { getListsByUserId, addToList, getListById } = useListContext();
  const { getMediaById } = useSpotifyContext();

  const [media, setMedia] = useState(null);
  const [mediaResults, setMediaResults] = useState([]);
  const [lists, setLists] = useState([]);
  const [currentLists, setCurrentLists] = useState([]);
  const [type, setType] = useState("artist");

  const selectRef = useRef(null);
  const mediaInputRef = useRef(null);

  useEffect(() => {
    handleModal();
    handleData();
  }, [isModalOpen]);

  function handleModal() {
    if (isModalOpen) resetValues();
  }

  async function handleData() {
    if (!globalUser) return;

    if (listId) {
      const fetchedList = await getListById(listId, globalUser.uid);
      setCurrentLists([fetchedList]);
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
  }

  function addToCurrentLists(id) {
    if (id === "_new") {
      setNewList(true);
      return;
    }

    const selectedList = lists.find((list) => list.id === id);
    setCurrentLists([...currentLists, selectedList]);

    setLists(lists.filter((item) => item.id !== id));
    selectRef.current.value = "";
  }

  function removeFromCurrentLists(list) {
    setCurrentLists(currentLists.filter((item) => item.id !== list.id));
    setLists([...lists, list]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!globalUser || !media || currentLists.length === 0) return;

    await Promise.all(
      currentLists.map((list) =>
        addToList(media.id, type, list.name, globalUser.uid),
      ),
    );

    setIsModalOpen(false);
    resetValues();
    window.location.reload();
  }

  function resetValues() {
    setMedia(null);
    setMediaResults([]);
    setLists([]);
    setCurrentLists([]);
    setType("artist");
    selectRef.current.value = "";
    mediaInputRef.current.value = "";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="m-auto flex w-full flex-col items-center justify-center gap-6 py-6"
    >
      <FormHeader />

      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-center gap-6">
          <FormImage media={media} />

          <div className="flex flex-col items-stretch gap-2">
            <FormMediaInput
              type={type}
              setType={setType}
              mediaInputRef={mediaInputRef}
              setMedia={setMedia}
              mediaResults={mediaResults}
              setMediaResults={setMediaResults}
            />

            <FormListInput
              selectRef={selectRef}
              addToCurrentLists={addToCurrentLists}
              lists={lists}
            />

            <FormLists
              currentLists={currentLists}
              removeFromCurrentLists={removeFromCurrentLists}
            />
          </div>
        </div>
      </div>
      <FormButton />
    </form>
  );
}

function FormHeader() {
  return (
    <p className="w-full border-b-1 border-white pb-2 text-left text-2xl font-bold">
      Add to list
    </p>
  );
}

function FormImage({ media }) {
  const { DEFAULT_IMG } = useSpotifyContext();

  return (
    <img
      src={media?.image || DEFAULT_IMG}
      className="aspect-square h-48 object-cover shadow-lg"
    />
  );
}

function FormMediaInput(props) {
  const {
    type,
    setType,
    setMedia,
    mediaInputRef,
    mediaResults,
    setMediaResults,
  } = props;

  const { searchByName } = useSpotifyContext();

  function handleChange(e) {
    setType(e.target.value);

    setMediaResults([]);
    setMedia(null);
  }

  async function handleSearch() {
    const data = await searchByName(mediaInputRef.current.value, type, 20);

    const items =
      data?.artists?.items || data?.albums?.items || data?.tracks?.items || [];

    const ids = items.map((item) => item?.id) || [];
    const names = items.map((item) => item?.name) || [];
    const subtitles = items.map((item) => item.artists?.[0].name || []) || [];

    setMediaResults(
      ids.map((id, index) => ({
        id,
        name: names[index],
        subtitle: subtitles[index],
      })),
    );
  }

  return (
    <div className="relative flex gap-2">
      <input
        type="search"
        ref={mediaInputRef}
        placeholder={`Search for ${type === "track" ? "a " : "an "}${type}...`}
        onKeyUp={handleSearch}
        className="border-1 px-2 py-1 outline-none"
      />

      <select value={type} onChange={handleChange}>
        <option value="artist">artist</option>
        <option value="album">album</option>
        <option value="track">song</option>
      </select>

      <FormMediaResults
        mediaInputRef={mediaInputRef}
        setMedia={setMedia}
        mediaResults={mediaResults}
        setMediaResults={setMediaResults}
        type={type}
      />
    </div>
  );
}

function FormMediaResults(props) {
  const { mediaInputRef, setMedia, mediaResults, setMediaResults, type } =
    props;

  const { getMediaById } = useSpotifyContext();

  async function handleClick(id, name) {
    mediaInputRef.current.value = name;

    const fetchedMedia = await getMediaById(id, type);
    setMedia(fetchedMedia);

    setMediaResults([]);
  }

  return (
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
  );
}

function FormListInput(props) {
  const { selectRef, addToCurrentLists, lists } = props;

  return (
    <select
      ref={selectRef}
      defaultValue=""
      onChange={(e) => addToCurrentLists(e.target.value)}
      className="option:bg-gray-700 w-full border-1 px-2 py-1 outline-none"
    >
      <option value="" disabled hidden>
        -- Select an option --
      </option>
      {lists.map((item) => {
        return (
          <option key={item.id} value={item.id} className="bg-gray-700">
            {item.name}
          </option>
        );
      })}
      <option value="_new" className="bg-gray-700">
        Create new list
      </option>
    </select>
  );
}

function FormLists({ currentLists, removeFromCurrentLists }) {
  return (
    <div className="flex h-20 flex-col items-start gap-2 overflow-auto p-2">
      {currentLists?.map((list) => {
        return (
          <div
            key={list.id}
            className="flex items-center gap-2 rounded-sm bg-gray-700 px-2 py-1"
          >
            <p>{list.name}</p>
            <button type="button" onClick={() => removeFromCurrentLists(list)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function FormButton() {
  return (
    <button
      type="submit"
      className="m-auto flex w-fit items-center gap-2 rounded-sm bg-green-700 px-3 py-1"
    >
      <FontAwesomeIcon icon={faPlus} />
      <p>Add</p>
    </button>
  );
}
