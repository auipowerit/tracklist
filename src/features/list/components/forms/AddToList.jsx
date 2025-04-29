import { useEffect, useRef, useState } from "react";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import Alert from "src/features/shared/components/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useListContext } from "src/features/list/context/ListContext";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";

export default function AddToList(props) {
  const { isModalOpen, mediaId, listId, category, setNewList, setSuccess } =
    props;

  const { globalUser } = useAuthContext();
  const { getListsByUserId, addToList, getListById } = useListContext();
  const { getMediaById } = useSpotifyContext();

  const [error, setError] = useState("");
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
      const fetchedList = await getListById(listId);
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

  async function handleSubmit(e) {
    e.preventDefault();

    if (!globalUser) {
      setError("Please sign in to continue.");
      return;
    }

    if (!media) {
      setError("Please select media to add.");
      return;
    }

    if (currentLists.length <= 0) {
      setError("Please select a list.");
      return;
    }

    await Promise.all(
      currentLists.map((list) => addToList(media.id, type, list.id)),
    );

    setSuccess(true);
    resetValues();
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
    <form onSubmit={handleSubmit} className="form-container list-form">
      <FormHeader />

      <div className="form-content">
        <FormImage media={media} />

        <div className="list-form-inputs">
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

      <Alert message={error} />
      <FormButton />
    </form>
  );
}

function FormHeader() {
  return <p className="form-header">Add to list</p>;
}

function FormImage({ media }) {
  return (
    <img src={media?.image || DEFAULT_MEDIA_IMG} className="form-media-image" />
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
    <div className="list-form-media-input">
      <input
        type="search"
        ref={mediaInputRef}
        placeholder={`Search for ${type === "track" ? "a " : "an "}${type}...`}
        onKeyUp={handleSearch}
        className="form-input"
      />

      <select value={type} onChange={handleChange} className="form-select">
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
      className={`form-media-results ${mediaResults.length > 0 && "active"}`}
    >
      {mediaResults.map(({ id, name, subtitle }) => (
        <button
          key={id}
          type="button"
          onClick={() => handleClick(id, name)}
          className="form-media-result"
        >
          <p>{name}</p>
          {type !== "artist" && <span>{subtitle}</span>}
        </button>
      ))}
    </div>
  );
}

function FormListInput(props) {
  const { selectRef, addToCurrentLists, lists } = props;

  function handleSelect(e) {
    e.stopPropagation();
    addToCurrentLists(e.target.value);
  }

  return (
    <select
      ref={selectRef}
      defaultValue=""
      onChange={handleSelect}
      className="form-select list-form-select"
    >
      <option value="" disabled hidden>
        -- Select a list --
      </option>
      {lists.map((item) => {
        return (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        );
      })}
      <option value="_new">Create new list</option>
    </select>
  );
}

function FormLists({ currentLists, removeFromCurrentLists }) {
  return (
    <div className="list-form-current-lists">
      {currentLists?.map((list) => {
        return (
          <div key={list.id} className="list-form-current-list">
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
    <button type="submit" className="form-submit-button">
      <FontAwesomeIcon icon={faPlus} />
      <p>Add</p>
    </button>
  );
}
