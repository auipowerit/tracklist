import { useEffect, useRef, useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StarRating from "./StarRating";
import FormInput from "../Inputs/FormInput";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useReviewContext } from "src/context/Review/ReviewContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function ReviewForm(props) {
  const { isModalOpen, setIsModalOpen, mediaId, category } = props;

  const { globalUser, getUserById } = useAuthContext();
  const { defaultImg, searchByName, getMediaById } = useSpotifyContext();
  const { addReview, setReviews } = useReviewContext();

  const [type, setType] = useState("artist");
  const [results, setResults] = useState([]);
  const [media, setMedia] = useState({});
  const [rating, setRating] = useState(null);

  const formRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  function handleChange(e) {
    setType(e.target.value);

    setResults([]);
    setMedia({});
  }

  async function handleSearch() {
    const data = await searchByName(inputRef.current.value, type, 20);

    const items =
      data?.artists?.items || data?.albums?.items || data?.tracks?.items || [];

    const ids = items.map((item) => item?.id) || [];
    const names = items.map((item) => item?.name) || [];
    const subtitles = items.map((item) => item.artists?.[0].name || []) || [];

    setResults(
      ids.map((id, index) => ({
        id,
        name: names[index],
        subtitle: subtitles[index],
      })),
    );
  }

  async function handleClick(id, name) {
    inputRef.current.value = name;

    const fetchedMedia = await getMediaById(id, type);
    setMedia(fetchedMedia);

    setResults([]);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!globalUser || !media || !textareaRef || rating <= 0) return;

    submitReview();
  }

  async function submitReview() {
    const content = textareaRef.current.value.trim();

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
          media,
        },
        ...(prevReviews || []),
      ].sort((a, b) => b.createdAt - a.createdAt),
    );

    formRef.current.reset();
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
    textareaRef.current.value = "";
  }

  useEffect(() => {
    const fetchMedia = async () => {
      if (!mediaId || !category || !inputRef.current) return;

      const fetchedMedia = await getMediaById(mediaId, category);

      inputRef.current.value = fetchedMedia.name;
      setType(category);
      setMedia(fetchedMedia);
    };

    if (isModalOpen) resetValues();

    return fetchMedia;
  }, [isModalOpen]);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="m-auto flex w-full flex-col items-center justify-center gap-6 py-6"
    >
      <p className="text-3xl font-bold">Add a review</p>
      <div className="flex w-full items-center justify-center gap-6">
        <img
          src={media.image || defaultImg}
          className="aspect-square h-48 object-cover shadow-lg"
        />
        <div className="flex h-48 flex-col justify-center gap-2 text-xl">
          <div className="relative flex gap-2">
            <FormInput
              type="search"
              ref={inputRef}
              placeholder={`Search for ${type === "track" ? "a " : "an "}${type}...`}
              onKeyUp={handleSearch}
              classes="bg-white text-black"
            />

            <select value={type} onChange={handleChange}>
              <option value="artist">artist</option>
              <option value="album">album</option>
              <option value="track">song</option>
            </select>

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
          </div>

          <div className="text-xl">
            <StarRating rating={rating} setRating={setRating} />
          </div>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        placeholder="Write your review..."
        rows="5"
        className="w-full bg-white p-2 text-black outline-none"
      />

      <button
        type="submit"
        className="flex items-center gap-1 rounded-md bg-green-700 p-3 text-2xl hover:text-gray-400"
      >
        <FontAwesomeIcon icon={faPlus} />
        <p>Add Post</p>
      </button>
    </form>
  );
}
