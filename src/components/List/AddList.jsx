import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useListContext } from "src/context/List/ListContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function AddList(props) {
  const { isModalOpen, setIsModalOpen, mediaId, listId, category } = props;

  const { globalUser } = useAuthContext();
  const { getListsByUserId, addToList, getListById } = useListContext();
  const { getMediaById, searchByName } = useSpotifyContext();

  const [media, setMedia] = useState(null);
  const [listResults, setListResults] = useState([]);
  const [mediaResults, setMediaResults] = useState([]);
  const [lists, setLists] = useState([]);
  const [currentLists, setCurrentLists] = useState([]);
  const [type, setType] = useState("artist");

  const mediaInputRef = useRef(null);
  const listInputRef = useRef(null);

  useEffect(() => {
    handleModal();
    handleData();
  }, [isModalOpen]);

  function handleModal() {
    if (isModalOpen) resetValues();
  }

  async function handleData() {
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

  function handleChange(e) {
    setType(e.target.value);

    setMediaResults([]);
    setMedia(null);
  }

  async function handleClick(id, name) {
    mediaInputRef.current.value = name;

    const fetchedMedia = await getMediaById(id, type);
    setMedia(fetchedMedia);

    setMediaResults([]);
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
    setMediaResults([]);
    setLists([]);
    setCurrentLists([]);
    setType("artist");
    mediaInputRef.current.value = "";
    listInputRef.current.value = "";
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
          <div className="flex flex-col gap-2">
            <FormMediaInput
              type={type}
              setType={setType}
              mediaInputRef={mediaInputRef}
              mediaResults={mediaResults}
              setMediaResults={setMediaResults}
              handleClick={handleClick}
              handleSearch={handleSearch}
              handleChange={handleChange}
            />

            <FormListInput
              listInputRef={listInputRef}
              searchForList={searchForList}
              listResults={listResults}
              addToCurrentLists={addToCurrentLists}
            />

            <FormLists
              lists={lists}
              setLists={setLists}
              currentLists={currentLists}
              setCurrentLists={setCurrentLists}
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
  const { defaultImg } = useSpotifyContext();

  return (
    <img
      src={media?.image || defaultImg}
      className="aspect-square h-48 object-cover shadow-lg"
    />
  );
}

function FormMediaInput(props) {
  const {
    type,
    mediaInputRef,
    mediaResults,
    handleClick,
    handleSearch,
    handleChange,
  } = props;

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
  );
}

function FormListInput(props) {
  const { listInputRef, listResults, searchForList, addToCurrentLists } = props;

  return (
    <div className="relative flex gap-2">
      <input
        type="search"
        ref={listInputRef}
        placeholder="Search for a list..."
        onKeyUp={searchForList}
        className="border-1 px-2 py-1 outline-none"
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
  );
}

function FormLists({ lists, setLists, currentLists, setCurrentLists }) {
  function removeFromCurrentLists(name) {
    setCurrentLists(currentLists.filter((item) => item !== name));
    setLists([...lists, { name }]);
  }

  return (
    <div className="flex h-20 flex-col items-start gap-2 overflow-auto p-2">
      {currentLists?.map((name, index) => {
        return (
          <div
            key={index}
            className="flex items-center gap-2 rounded-sm bg-gray-700 px-2 py-1"
          >
            <p>{name}</p>
            <button type="button" onClick={() => removeFromCurrentLists(name)}>
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
