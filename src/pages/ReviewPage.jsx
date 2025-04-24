import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "src/features/shared/components/Loading";
import ReviewSection from "src/features/review/components/ReviewSection";
import BackButton from "src/features/shared/components/buttons/BackButton";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import CommentList from "../features/comment/components/CommentList";
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

  if (isLoading) return <Loading />;

  if (!review) {
    navigate("/404");
  }

  return (
    <div className="review-wrapper">
      <BackButton />
      <ReviewSection review={review} />
      <CommentList review={review} />
    </div>
  );
}
