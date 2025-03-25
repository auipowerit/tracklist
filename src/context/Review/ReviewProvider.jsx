import { useEffect, useState } from "react";
import ReviewContext from "./ReviewContext";
import { useReview } from "../../hooks/useReview";

export default function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState(null);

  const useReviewMethods = useReview();

  useEffect(() => {
    const fetchData = async () => {
      const reviews = await useReviewMethods.getReviews();
      setReviews([...reviews.sort((a, b) => b.createdAt - a.createdAt)]);
    };

    fetchData();
  }, []);

  function updateReviewState(review, updatedReview) {
    Object.assign(review, updatedReview);

    setReviews(
      reviews.map((review) =>
        review.id === updatedReview.id ? updatedReview : review,
      ),
    );
  }

  const reviewMethods = {
    reviews,
    setReviews,
    updateReviewState,
    ...useReviewMethods,
  };

  return (
    <ReviewContext.Provider value={reviewMethods}>
      {children}
    </ReviewContext.Provider>
  );
}
