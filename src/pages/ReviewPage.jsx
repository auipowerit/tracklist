import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "src/features/shared/components/Loading";
import { formatDateMDYLong, formatDateMDYShort } from "src/utils/date";
import ReviewMedia from "src/features/review/components/media/ReviewMedia";
import CommentList from "src/features/comment/components/lists/CommentList";
import ReviewStars from "src/features/review/components/rating/ReviewStars";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import ReviewButtons from "src/features/review/components/buttons/ReviewButtons";
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
    <div className="review">
      <Review review={review} />
      <CommentList review={review} />
    </div>
  );
}

function Review({ review }) {
  return (
    <div className="review__container">
      <ReviewMedia review={review} />

      <div className="review__content">
        <div className="review__section">
          <ReviewHeader review={review} />
          <p className="review__text">{review.content}</p>
        </div>

        <ReviewButtons review={review} showComment={false} />
      </div>
    </div>
  );
}

function ReviewHeader({ review }) {
  return (
    <div className="review__header">
      <img src={review.profileUrl} className="review__profile" />

      <div className="review__details">
        <div className="review__title">
          <div className="review__user">
            Review by&nbsp;
            <Link to={`/users/${review.username}`} className="review__username">
              {review.username}
            </Link>
            <p className="review__date review__date--mobile">
              {` on ${formatDateMDYShort(review.createdAt.toDate())}`}
            </p>
          </div>

          <p className="review__date">
            {formatDateMDYLong(review.createdAt.toDate())}
          </p>
        </div>

        <ReviewStars rating={review.rating} />
      </div>
    </div>
  );
}
