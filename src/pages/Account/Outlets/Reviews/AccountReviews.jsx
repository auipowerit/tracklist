import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PostButton from "src/components/Buttons/PostButton";
import FeedReviewCard from "src/components/Cards/FeedReviewCard";
import Loading from "src/components/Loading";
import { useReviewContext } from "src/context/Review/ReviewContext";

export default function AccountReviews() {
  const { globalUser } = useOutletContext();

  const { getReviewsByUserId } = useReviewContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!globalUser) return;

      setIsLoading(true);

      try {
        const fetchedReviews = await getReviewsByUserId(globalUser.uid);
        setReviews(fetchedReviews);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [globalUser]);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex items-center justify-between border-b-1 border-white pb-4 align-middle">
        <p className="text-2xl text-white">Your Reviews</p>
        <PostButton isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </div>

      <div className="h-screen overflow-y-scroll">
        {isLoading && <Loading />}

        {reviews &&
          (reviews.length > 0 ? (
            <ul className="flex w-full flex-col gap-4">
              {reviews.map((review) => {
                return <FeedReviewCard key={review.id} review={review} />;
              })}
            </ul>
          ) : (
            <p className="m-20 text-center text-2xl text-gray-300 italic">
              You don't have any reviews yet.
            </p>
          ))}
      </div>
    </div>
  );
}
