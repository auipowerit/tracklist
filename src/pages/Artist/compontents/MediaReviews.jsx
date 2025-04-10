import { useState } from "react";
import Placeholder from "src/components/Placeholder";
import {
  ReviewContent,
  ReviewStars,
} from "src/components/Review/ReviewContent";
import SortReviews from "src/components/Sort/SortReviews";
import { Link } from "react-router-dom";

export default function MediaReviews(props) {
  const { reviews, setReviews } = props;

  return (
    <div className="flex flex-col gap-2 p-6">
      <div className="flex items-center justify-between align-middle">
        <div className="flex items-center gap-4">
          <p className="text-2xl">User Reviews</p>
          <SortReviews reviews={reviews} setReviews={setReviews} />
        </div>
      </div>

      <div className="flex flex-col gap-6 border-t-1 border-white py-6">
        {reviews ? (
          reviews.length > 0 ? (
            reviews.map((review) => {
              return <MediaReviewCard key={review.id} review={review} />;
            })
          ) : (
            <p className="py-20 text-center text-4xl italic">
              No reviews found!
            </p>
          )
        ) : (
          <MediaReviewCard />
        )}
      </div>
    </div>
  );
}

function MediaReviewCard({ review }) {
  return (
    <div>
      {review ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <img src={review.profileUrl} className="h-12 w-12 rounded-full" />

            <div className="flex w-full items-start justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-gray-400">
                  Review by{" "}
                  <Link
                    to={`/users/${review.userId}`}
                    className="font-bold text-white hover:text-gray-400"
                  >
                    {review.username}
                  </Link>
                </p>
                <ReviewStars rating={review.rating} />
              </div>

              <p className="text-sm text-gray-400">
                {review.createdAt.toDate().toDateString()}
              </p>
            </div>
          </div>

          <div className="w-120">
            <ReviewContent review={review} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <Placeholder />
              <Placeholder />
            </div>
            <Placeholder />
          </div>
          <Placeholder />
        </div>
      )}
    </div>
  );
}
