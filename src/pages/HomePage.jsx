import { useRef, useState } from "react";
import Loading from "../components/Loading";
import ReviewCard from "../components/Cards/ReviewCard";
import SortReviews from "../components/Sort/SortReviews";
import { useAuthContext } from "../context/Auth/AuthContext";
import { useReviewContext } from "../context/Review/ReviewContext";

export default function HomePage() {
  const { globalUser } = useAuthContext();
  const { reviews, addReview } = useReviewContext();

  const [isLoading, setIsLoading] = useState(false);
  const inputReview = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const content = inputReview.current?.value.trim();

    if (!globalUser || !content) return;

    const reviewInfo = {
      content,
      userId: globalUser.uid,
      category: "album",
      mediaId: "3TstA7Or7ds5kL4bNWvRok",
      likes: [],
      dislikes: [],
      replyingTo: "",
      replies: [],
    };

    await addReview(reviewInfo);
    inputReview.current.value = "";
  }

  if (!reviews) {
    return <Loading />;
  }

  return (
    <div className="m-auto flex w-full flex-col items-center justify-center gap-4">
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

      {reviews && (
        <div className="w-2/3 border-x-1 border-white px-10">
          <SortReviews />
          <div className="mt-6 flex h-screen flex-col overflow-auto">
            {reviews.map((review) => {
              return <ReviewCard key={review.id} review={review} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
