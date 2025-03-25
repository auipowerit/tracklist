import { useEffect, useRef, useState } from "react";
import Loading from "../components/Loading";
import ReviewCard from "../components/Cards/ReviewCard";
import { useAuthContext } from "../context/Auth/AuthContext";
import { useReviewContext } from "../context/Review/ReviewContext";
import SortReviews from "../components/Sort/SortReviews";

export default function HomePage() {
  const { globalUser } = useAuthContext();
  const { getReviews, addReview } = useReviewContext();

  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState(null);
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

  useEffect(() => {
    async function fetchReviews() {
      setIsLoading(true);

      try {
        const fetchedReviews = await getReviews();
        setReviews(fetchedReviews);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    return fetchReviews;
  }, []);

  if (isLoading) {
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
          <SortReviews reviews={reviews} setReviews={setReviews} />
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
