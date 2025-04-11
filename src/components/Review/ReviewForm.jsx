import { useEffect, useRef, useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReviewContext } from "src/context/Review/ReviewContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import StarRating from "./StarRating";

export default function ReviewForm(props) {
  const { isModalOpen, setIsModalOpen, mediaId, category } = props;

  const { globalUser, getUserById } = useAuthContext();
  const { searchByName, getMediaById } = useSpotifyContext();
  const { addReview, setReviews } = useReviewContext();

  const [type, setType] = useState("artist");
  const [results, setResults] = useState([]);
  const [media, setMedia] = useState({});
  const [rating, setRating] = useState(null);
  const [content, setContent] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    handleModal();
    fetchMedia();
  }, [isModalOpen]);

  function handleModal() {
    if (isModalOpen) resetValues();
  }

  async function fetchMedia() {
    if (!mediaId || !category || !inputRef.current) return;

    const fetchedMedia = await getMediaById(mediaId, category);

    if (!inputRef.current) return;
    inputRef.current.value = fetchedMedia.name;
    setType(category);
    setMedia(fetchedMedia);
  }

  function handleChange(e) {
    setType(e.target.value);

    setResults([]);
    setMedia({});
  }

  async function handleSearch() {
    const data = await searchByName(inputRef.current.value, type, 20);
    const items = getMediaData(data);
    setResults(items);
  }

  function getMediaData(data) {
    const items = data?.[`${type}s`]?.items;

    return items.map((item) => {
      const name = item.name || item.title;
      const subtitle = item.artists?.[0]?.name || item.album?.name || "";

      return {
        id: item.id,
        name,
        subtitle,
      };
    });
  }

  async function handleClick(id, name) {
    inputRef.current.value = name;

    const fetchedMedia = await getMediaById(id, type);
    setMedia(fetchedMedia);

    setResults([]);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!globalUser || !media || content === "" || rating <= 0) return;

    submitReview();
  }

  async function submitReview() {
    if (content === "") return;

    const reviewInfo = {
      content,
      userId: globalUser.uid,
      category: type,
      mediaId: media.id,
      rating: parseFloat(rating),
      likes: [],
      dislikes: [],
      comments: [],
    };

    const newReview = await addReview(reviewInfo);
    const username = (await getUserById(globalUser.uid)).username;

    setReviews((prevReviews) =>
      [
        {
          id: newReview.id,
          ...newReview.data(),
          username,
          profileUrl: globalUser.profileURL,
          media,
        },
        ...(prevReviews || []),
      ].sort((a, b) => b.createdAt - a.createdAt),
    );

    resetValues();
    setIsModalOpen(false);
    window.location.reload();
  }

  function resetValues() {
    setType("artist");
    setResults([]);
    setMedia({});
    setType("artist");
    setRating(0);
    inputRef.current.value = "";
    setContent("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="m-auto flex w-full flex-col items-center justify-center gap-6 py-6"
    >
      <FormHeader />

      <div className="flex flex-col">
        <div className="flex w-full items-center justify-center gap-6">
          <FormImage media={media} />

          <div className="flex h-48 flex-col justify-center gap-2 text-xl">
            <FormInput
              inputRef={inputRef}
              type={type}
              results={results}
              handleSearch={handleSearch}
              handleChange={handleChange}
              handleClick={handleClick}
            />

            <StarRating rating={rating} setRating={setRating} />
          </div>
        </div>

        <FormReview content={content} setContent={setContent} />
      </div>

      <FormButton />
    </form>
  );
}

function FormHeader() {
  return (
    <p className="w-full border-b-1 border-white pb-2 text-left text-2xl font-bold">
      Add a review
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

function FormInput(props) {
  const { inputRef, type, handleSearch, handleChange, results, handleClick } =
    props;

  return (
    <div className="relative flex gap-2">
      <input
        type="search"
        ref={inputRef}
        placeholder={`Search for ${type === "track" ? "a " : "an "}${type}...`}
        onKeyUp={handleSearch}
        className="border-1 px-2 py-1 outline-hidden"
      />

      <select value={type} onChange={handleChange}>
        <option value="artist">artist</option>
        <option value="album">album</option>
        <option value="track">song</option>
      </select>

      <FormSearchResults
        results={results}
        handleClick={handleClick}
        type={type}
      />
    </div>
  );
}

function FormSearchResults({ results, handleClick, type }) {
  return (
    <div
      className={`absolute top-10 right-0 left-0 flex flex-col bg-green-700 ${results.length > 0 && "h-46 overflow-auto"}`}
    >
      {results.map(({ id, name, subtitle }) => (
        <button
          key={id}
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

function FormReview({ content, setContent }) {
  const CHARACTER_LIMIT = 500;

  function handleChange(e) {
    if (e.target.value.length > CHARACTER_LIMIT) {
      setContent(e.target.value.slice(0, CHARACTER_LIMIT));
      return;
    }
    setContent(e.target.value);
  }

  const color =
    content.length >= CHARACTER_LIMIT ? "text-red-600" : "text-gray-400";

  return (
    <div className="flex w-full flex-col gap-2">
      <p className={`self-end ${color}`}>
        {content.length || 0}/{CHARACTER_LIMIT}
      </p>
      <textarea
        placeholder="Write your review..."
        value={content}
        onChange={handleChange}
        rows="5"
        className="w-full border-1 p-2 outline-none"
      />
    </div>
  );
}

function FormButton() {
  return (
    <button
      type="submit"
      className="flex items-center gap-1 rounded-md bg-green-700 p-3 text-2xl hover:text-gray-400"
    >
      <FontAwesomeIcon icon={faPlus} />
      <p>Post</p>
    </button>
  );
}
