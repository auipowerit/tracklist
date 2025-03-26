import { useRef } from "react";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useReviewContext } from "../../context/Review/ReviewContext";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";

export default function ReviewInput() {
  const { globalUser, getUserById } = useAuthContext();
  const { getMediaById } = useSpotifyContext();
  const { setReviews, addReview } = useReviewContext();

  const inputReview = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const content = inputReview.current?.value.trim();

    if (!globalUser || !content) return;

    const reviewInfo = {
      content,
      userId: globalUser.uid,
      category: "artist",
      mediaId: "1btWGBz4Uu1HozTwb2Lm8A",
      likes: [],
      dislikes: [],
      comments: [],
    };

    const newReview = await addReview(reviewInfo);
    const username = (await getUserById(globalUser.uid)).username;
    const media = await getMediaById(reviewInfo.mediaId, reviewInfo.category);

    setReviews((prevData) => [
      {
        id: newReview.id,
        ...newReview.data(),
        username,
        media,
      },
      ...prevData,
    ]);

    inputReview.current.value = "";
  }

  return (
    <div>
      <p className="text-2xl">Post a review</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputReview}
          className="border-2 border-white px-2 text-2xl"
        />
        <button
          type="submit"
          className="rounded-md bg-green-900 px-5 py-2 text-2xl"
        >
          Review
        </button>
      </form>
    </div>
  );
}
