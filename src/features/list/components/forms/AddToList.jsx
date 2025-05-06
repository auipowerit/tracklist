import { useEffect, useRef, useState } from "react";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import Alert from "src/features/shared/components/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
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

  const formRef = useRef(null);
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

    if (!validateData()) return;

    await Promise.all(
      currentLists.map((list) => addToList(media.id, type, list.id)),
    );

    setSuccess(true);
    resetValues();
  }

  function validateData() {
    const mediaInput = formRef.current.elements["media"];
    const listInput = formRef.current.elements["list"];

    if (!globalUser) {
      setError("Please sign in to continue.");
      return false;
    }

    if (currentLists.length <= 0) {
      listInput.classList.add("form__input--invalid");
      setError("Please select a list.");
      return false;
    }

    if (!media) {
      mediaInput.classList.add("form__input--invalid");
      setError("Please select media to add.");
      return false;
    }

    return true;
  }

  function resetValues() {
    setError("");
    setMedia(null);
    setMediaResults([]);
    setLists([]);
    setCurrentLists([]);
    setType("artist");
    selectRef.current.value = "";
    mediaInputRef.current.value = "";
    formRef.current.elements["media"].classList.remove("form__input--invalid");
    formRef.current.elements["list"].classList.remove("form__input--invalid");
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="form list-form">
      <FormHeader />

      <div className="form__content">
        <FormImage media={media} />

        <div className="list-form__inputs">
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
  return <p className="form__header">Add to list</p>;
}

function FormImage({ media }) {
  return (
    <img src={media?.image || DEFAULT_MEDIA_IMG} className="form__image" />
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
    <div className="list-form__search">
      <input
        name="media"
        type="search"
        ref={mediaInputRef}
        placeholder={`Search for ${type === "track" ? "a " : "an "}${type}...`}
        onKeyUp={handleSearch}
        onChange={(e) => e.target.classList.remove("form__input--invalid")}
        className="form__input"
      />

      <select value={type} onChange={handleChange} className="form__select">
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
    <div className={`form__search-list ${mediaResults.length > 0 && "active"}`}>
      {mediaResults.map(({ id, name, subtitle }) => (
        <button
          key={id}
          type="button"
          onClick={() => handleClick(id, name)}
          className="form__search-item"
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
    e.target.classList.remove("form__input--invalid");

    addToCurrentLists(e.target.value);
  }

  return (
    <select
      name="list"
      ref={selectRef}
      defaultValue=""
      onChange={handleSelect}
      className="form__select list-form__select"
    >
      <option value="" disabled hidden>
        -- Select a list --
      </option>
      <option value="_new">--Create new list--</option>
      {lists.map((item) => {
        return (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        );
      })}
    </select>
  );
}

function FormLists({ currentLists, removeFromCurrentLists }) {
  return (
    <div className="list-form__lists">
      {currentLists?.map((list) => {
        return (
          <div key={list.id} className="list-form__lists-item">
            <p>{list.name}</p>
            <button
              type="button"
              onClick={() => removeFromCurrentLists(list)}
              className="list-form__lists-item--remove"
            >
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
    <button type="submit" className="form__submit">
      Add to List
    </button>
  );
}
