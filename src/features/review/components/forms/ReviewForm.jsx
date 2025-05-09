import { useEffect, useRef, useState } from "react";
import { DEFAULT_MEDIA_IMG, REVIEW_LIMIT } from "src/data/const";
import Alert from "src/features/shared/components/Alert";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import StarRating from "../rating/StarRating";
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

  const formRef = useRef(null);
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

  async function handleSearch(e) {
    e.target.classList.remove("form__input--invalid");

    // Confirm search time contains characters
    if (inputRef.current.value.trim() !== "") {
      const data = (await searchByName(inputRef.current.value, type, 20)) || [];
      const items = getMediaData(data) || [];
      setResults(items);
    }

    // Clear results if search term is empty
    // Necessary due to async while typing
    if (inputRef.current.value.trim() === "") {
      setResults([]);
      return;
    }
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

    if (!validateData()) return;

    submitReview();
  }

  function validateData() {
    const mediaInput = formRef.current.elements["media"];
    const reviewText = formRef.current.elements["review"];

    if (!globalUser) {
      setError("Please sign in to submit a review.");
      return false;
    }

    if (!media || !media.id) {
      mediaInput.classList.add("form__input--invalid");
      setError("Please select media to review.");
      return false;
    }

    if (rating <= 0) {
      setError("Please provide a star rating.");
      return false;
    }

    if (content === "") {
      setError("Please provide a review.");
      reviewText.classList.add("form__input--invalid");
      return false;
    }

    if (content.length > 1000) {
      setError("Please keep your review under 1000 characters.");
      return false;
    }

    return true;
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
          profileUrl: globalUser.profileUrl,
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
    formRef.current.elements["media"].classList.remove("form__input--invalid");
    formRef.current.elements["review"].classList.remove("form__input--invalid");
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="form review-form">
      <FormHeader />

      <div className="review-form__content">
        <FormImage media={media} />
        <FormInput
          inputRef={inputRef}
          type={type}
          results={results}
          handleSearch={handleSearch}
          handleChange={handleChange}
          handleClick={handleClick}
        />
      </div>

      <StarRating rating={rating} setRating={setRating} />
      <FormReview content={content} setContent={setContent} />

      <Alert message={error} />
      <FormButton />
    </form>
  );
}

function FormHeader() {
  const { globalUser } = useAuthContext();

  return (
    <div className="form__header">
      {globalUser && <img src={globalUser.profileUrl} className="form__user" />}
      <p>Add a review</p>
    </div>
  );
}

function FormImage({ media }) {
  return (
    <img src={media?.image || DEFAULT_MEDIA_IMG} className="form__image" />
  );
}

function FormInput(props) {
  const { inputRef, type, handleSearch, handleChange, results, handleClick } =
    props;

  return (
    <div className="review-form__search">
      <input
        name="media"
        type="search"
        ref={inputRef}
        placeholder={`Search for ${type === "track" ? "a " : "an "}${type}...`}
        onChange={handleSearch}
        className="form__input"
      />

      <select value={type} onChange={handleChange} className="form__select">
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
    <div className={`form__search-list ${results.length > 0 && "active"}`}>
      {results.map(({ id, name, subtitle }) => (
        <button
          type="button"
          key={id}
          onClick={() => handleClick(id, name)}
          className="form__search-item"
        >
          <p className="form__search-item--title">{name}</p>
          {type !== "artist" && (
            <span className="form__search-item--subtitle">{subtitle}</span>
          )}
        </button>
      ))}
    </div>
  );
}

function FormReview({ content, setContent }) {
  function handleChange(e) {
    e.target.classList.remove("form__input--invalid");

    if (e.target.value.length > REVIEW_LIMIT) {
      setContent(e.target.value.slice(0, REVIEW_LIMIT));
      return;
    }

    setContent(e.target.value);
  }

  const color = content.length >= REVIEW_LIMIT ? "red" : "gray";

  return (
    <div className="form__textarea">
      <div className="form__textarea--label">
        <p>Your review</p>
        <p style={{ color: color }}>
          {content.length || 0}/{REVIEW_LIMIT}
        </p>
      </div>
      <textarea
        name="review"
        placeholder="Write your review..."
        value={content}
        onChange={handleChange}
        rows="5"
        className="form__textarea--input"
      />
    </div>
  );
}

function FormButton() {
  return (
    <button type="submit" className="form__submit">
      Post
    </button>
  );
}
