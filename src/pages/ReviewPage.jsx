import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "src/features/shared/components/Loading";
import MediaDetails from "src/features/review/components/MediaDetails";
import CommentList from "src/features/comment/components/lists/CommentList";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import ReviewButtons from "src/features/review/components/buttons/ReviewButtons";
import { ReviewStars } from "src/features/review/components/ReviewContent";
import "./styles/review.scss";

export default function ReviewPage() {
  const params = useParams();
  const reviewId = params?.reviewId;

  const navigate = useNavigate();

  const { getReviewById } = useReviewContext();

  const [isLoading, setIsLoading] = useState(true);
  const [review, setReview] = useState({});

  useEffect(() => {
    const fetchReview = async () => {
      setIsLoading(true);

      try {
        const fetchedReview = await getReviewById(reviewId);
        setReview(fetchedReview);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReview();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (!review) {
    navigate("/404");
  }

  return (
    <div className="review-wrapper">
      <Review review={review} />
      <CommentList review={review} />
    </div>
  );
}

function Review({ review }) {
  return (
    <div className="review-section-container">
      <MediaDetails review={review} />

      <div className="review-section">
        <div className="review-section-details-container">
          <ReviewHeader review={review} />
          <p className="review-section-content">{review.content}</p>
        </div>
        <ReviewButtons review={review} showComment={false} />
      </div>
    </div>
  );
}

function ReviewHeader({ review }) {
  return (
    <div className="review-section-header">
      <img src={review.profileUrl} />

      <div className="review-section-info-container">
        <div className="review-section-user-container">
          <p className="review-section-user-info">
            Review by{" "}
            <Link
              to={`/users/${review.username}`}
              className="review-section-username"
            >
              {review.username}
            </Link>
          </p>
          <ReviewStars rating={review.rating} />
        </div>

        <p className="review-section-date">
          {review.createdAt.toDate().toDateString()}
        </p>
      </div>
    </div>
  );
}
