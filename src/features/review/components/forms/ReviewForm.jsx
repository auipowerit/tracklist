import { useEffect, useRef, useState } from "react";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import Alert from "src/features/shared/components/Alert";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import StarRating from "../StarRating";
import "./review-form.scss";

export default function ReviewForm(props) {
  const { isModalOpen, mediaId, category, setSuccess } = props;

  const { globalUser, getUserById } = useAuthContext();
  const { searchByName, getMediaById } = useSpotifyContext();
  const { addReview, setReviews } = useReviewContext();

  const [error, setError] = useState("");
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
    const data = (await searchByName(inputRef.current.value, type, 20)) || [];
    const items = getMediaData(data) || [];
    setResults(items);
  }

  function getMediaData(data) {
    const items = data?.[`${type}s`]?.items;

    return items?.map((item) => {
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

  function handleSubmit(e) {
    e.preventDefault();

    if (!globalUser) {
      setError("Please sign in to submit a review.");
      return;
    }

    if (content === "") {
      setError("Please provide a review.");
      return;
    }

    if (content.length > 1000) {
      setError("Please keep your review under 1000 characters.");
      return;
    }

    if (!media || !media.id) {
      setError("Please select media to review.");
      return;
    }

    if (rating <= 0) {
      setError("Please provide a star rating.");
      return;
    }

    submitReview();
  }

  async function submitReview() {
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
    setSuccess(true);
  }

  function resetValues() {
    setType("artist");
    setResults([]);
    setMedia({});
    setType("artist");
    setRating(0);
    inputRef.current.value = "";
    setContent("");
    setError("");
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <FormHeader />

      <div className="form-content">
        <FormImage media={media} />

        <div className="review-form-info-container">
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

      <Alert message={error} />
      <FormButton />
    </form>
  );
}

function FormHeader() {
  return <p className="form-header">Add a review</p>;
}

function FormImage({ media }) {
  return (
    <img src={media?.image || DEFAULT_MEDIA_IMG} className="form-media-image" />
  );
}

function FormInput(props) {
  const { inputRef, type, handleSearch, handleChange, results, handleClick } =
    props;

  function handleInputChange(element) {
    element.target.classList.remove("invalid-field");
  }

  return (
    <div className="review-form-input-container">
      <input
        type="search"
        ref={inputRef}
        placeholder={`Search for ${type === "track" ? "a " : "an "}${type}...`}
        onKeyUp={handleSearch}
        onChange={handleInputChange}
        className="form-input review-input"
      />

      <select value={type} onChange={handleChange} className="form-select">
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
    <div className={`form-media-results ${results.length > 0 && "active"}`}>
      {results.map(({ id, name, subtitle }) => (
        <button
          type="button"
          key={id}
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

function FormReview({ content, setContent }) {
  const CHARACTER_LIMIT = 1000;

  function handleChange(e) {
    e.target.classList.remove("invalid-field");

    if (e.target.value.length > CHARACTER_LIMIT) {
      setContent(e.target.value.slice(0, CHARACTER_LIMIT));
      return;
    }

    setContent(e.target.value);
  }

  const color = content.length >= CHARACTER_LIMIT ? "red" : "gray";

  return (
    <div className="form-textarea-container">
      <p style={{ color: color }}>
        {content.length || 0}/{CHARACTER_LIMIT}
      </p>
      <textarea
        placeholder="Write your review..."
        value={content}
        onChange={handleChange}
        rows="5"
      />
    </div>
  );
}

function FormButton() {
  return (
    <button type="submit" className="form-submit-button">
      <FontAwesomeIcon icon={faPlus} />
      <p>Post</p>
    </button>
  );
}
