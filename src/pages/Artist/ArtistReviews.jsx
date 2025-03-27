import { useEffect, useState } from "react";
import PostButton from "../../components/Buttons/PostButton";
import MediaReviewCard from "../../components/Cards/MediaReviewCard";
import { useReviewContext } from "../../context/Review/ReviewContext";

export default function ArtistReviews({ artistId }) {
  const { getReviewsByMediaId } = useReviewContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artistReviews, setArtistReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const fetchedReviews = await getReviewsByMediaId(artistId);
      setArtistReviews(
        [...fetchedReviews].sort((a, b) => b.createdAt - a.createdAt),
      );
    };
    return fetchReviews;
  }, []);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between align-middle">
        <p className="text-2xl text-gray-400">Newest Reviews</p>
        <PostButton
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          mediaId={artistId}
          category={"artist"}
        />
      </div>

      <div className="flex-gap flex flex-col gap-6 overflow-y-scroll border-t-1 border-white py-10">
        {artistReviews.length > 0 ? (
          artistReviews.map((review) => {
            return <MediaReviewCard key={review.id} review={review} />;
          })
        ) : (
          <p className="py-20 text-center text-4xl italic">No reviews found!</p>
        )}
      </div>
    </div>
  );
}
