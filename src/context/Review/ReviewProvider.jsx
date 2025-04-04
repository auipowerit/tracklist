import { useEffect, useState } from "react";
import ReviewContext from "./ReviewContext";
import { useReview } from "src/hooks/useReview";
import { useAuthContext } from "../Auth/AuthContext";

export default function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState(null);

  const { globalUser, getFollowingById } = useAuthContext();
  const useReviewMethods = useReview();

  useEffect(() => {
    const fetchData = async () => {
      if (!globalUser) return;

      // Get all reviews from current user
      const currentUserReviews = await useReviewMethods.getReviewsByUserId(
        globalUser.uid,
      );

      // Get users current user is following
      const following = await getFollowingById(globalUser.uid);

      // Get all reviews from all users current user is following
      const followedUserReviews = following
        ? await Promise.all(
            following.map((userId) =>
              useReviewMethods.getReviewsByUserId(userId),
            ),
          )
        : [];

      // Sort by date and set to state
      setReviews(
        [...currentUserReviews.flat(), ...followedUserReviews.flat()].sort(
          (a, b) => b.createdAt - a.createdAt,
        ),
      );
    };

    fetchData();
  }, [globalUser]);

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
