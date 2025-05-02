import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Loading from "src/features/shared/components/Loading";
import ReviewCard from "src/features/review/components/cards/ReviewCard";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import ReviewButton from "src/features/review/components/buttons/AddReviewButton";
import "./account-reviews.scss";

export default function AccountReviews() {
  const { user, canEdit } = useOutletContext();

  return (
    <div className="account-page-outlet-container">
      <Header canEdit={canEdit} />
      <ReviewsList user={user} />
    </div>
  );
}

function Header({ canEdit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("lock-scroll-modal");
    }
  }, [isModalOpen]);

  return (
    <div className="account-page-header">
      <p>Reviews</p>
      {canEdit && (
        <ReviewButton
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
}

function ReviewsList({ user }) {
  const { getReviewsByUserId } = useReviewContext();

  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);

      try {
        const fetchedReviews = await getReviewsByUserId(user.uid);
        setReviews(fetchedReviews);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    reviews &&
    (reviews.length > 0 ? (
      <ul className="account-reviews-list">
        {reviews.map((review) => {
          return <ReviewCard key={review.id} review={review} />;
        })}
      </ul>
    ) : (
      <p className="empty-message">There are no reviews yet!</p>
    ))
  );
}
