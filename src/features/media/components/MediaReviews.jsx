import { useEffect, useState } from "react";
import SortReviews from "src/features/sort/components/SortReviews";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import FilterReviews from "src/features/review/components/buttons/FilterButton";
import MediaReviewCard from "src/features/media/components/cards/MediaReviewCard";
import "./styles/media-reviews.scss";

export default function MediaReviews({ mediaId, filter, setFilter }) {
  const { getReviewsByMediaId } = useReviewContext();
  const [reviews, setReviews] = useState(null);
  const [filteredReviews, setFilteredReviews] = useState(null);

  useEffect(() => {
    if (!mediaId) return;
    fetchReviews();
  }, [mediaId]);

  async function fetchReviews() {
    const fetchedReviews = await getReviewsByMediaId(mediaId);
    const sortedReviews = fetchedReviews.sort(
      (a, b) => b.createdAt - a.createdAt,
    );

    setReviews([...sortedReviews]);
    setFilteredReviews([...sortedReviews]);
  }

  return (
    <div className="media-reviews">
      <div className="media-reviews__header">
        <SortReviews
          reviews={filteredReviews}
          setReviews={setFilteredReviews}
        />
        <FilterReviews
          filter={filter}
          setFilter={setFilter}
          review={reviews}
          setFilteredReviews={setFilteredReviews}
        />
      </div>

      {reviews && <Reviews reviews={filteredReviews} />}
    </div>
  );
}

function Reviews({ reviews }) {
  return (
    <div className="media-reviews__list">
      {reviews &&
        (reviews.length > 0 ? (
          reviews.map((review) => {
            return <MediaReviewCard key={review.id} review={review} />;
          })
        ) : (
          <p className="empty__message">No reviews found!</p>
        ))}
    </div>
  );
}
