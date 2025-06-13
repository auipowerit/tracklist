import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Loading from "src/features/shared/components/Loading";
import ReviewCard from "src/features/review/components/cards/ReviewCard";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import AddReviewButton from "src/features/review/components/buttons/AddReviewButton";
import "./account-reviews.scss";

export default function AccountReviews() {
  const { user, canEdit } = useOutletContext();

  return (
    <section className="account__section account-reviews">
      <Header canEdit={canEdit} />
      <ReviewsList user={user} />
    </section>
  );
}

function Header({ canEdit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("lock-scroll");
    }
  }, [isModalOpen]);

  return (
    <div className="account__header">
      <h2 className="account__title">Reviews</h2>
      {canEdit && (
        <AddReviewButton
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
}

function ReviewsList({ user }) {
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const { getReviewsByUserId } = useReviewContext();

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
    return null;
  }

  return (
    reviews &&
    (reviews.length > 0 ? (
      <ul className="account-reviews__list">
        {reviews.map((review) => {
          return <ReviewCard key={review.id} review={review} />;
        })}
      </ul>
    ) : (
      <p className="empty__message">There are no reviews yet!</p>
    ))
  );
}
