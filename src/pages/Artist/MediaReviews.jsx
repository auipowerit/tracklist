import { useEffect, useState } from "react";
import Loading from "src/components/Loading";
import PostButton from "src/components/Buttons/PostButton";
import MediaReviewCard from "src/components/Cards/MediaReviewCard";
import { useReviewContext } from "src/context/Review/ReviewContext";

export default function MediaReviews({ mediaId, category }) {
  const { getReviewsByMediaId } = useReviewContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaReviews, setMediaReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const fetchedReviews = await getReviewsByMediaId(mediaId);

        setMediaReviews(
          [...fetchedReviews].sort((a, b) => b.createdAt - a.createdAt),
        );
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    return fetchReviews;
  }, [category, mediaId]);

  return (
    <div className="flex-1 overflow-auto py-6">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between align-middle">
          <p className="text-2xl">User Reviews</p>

          <PostButton
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            mediaId={mediaId}
            category={category}
          />
        </div>

        <div className="flex-gap flex flex-col gap-6 overflow-y-scroll border-t-1 border-white py-10">
          {isLoading ? (
            <Loading />
          ) : mediaReviews.length > 0 ? (
            mediaReviews.map((review) => {
              return <MediaReviewCard key={review.id} review={review} />;
            })
          ) : (
            <p className="py-20 text-center text-4xl italic">
              No reviews found!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
