import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Review from "./Review";
import CommentList from "./CommentList";
import Loading from "src/components/Loading";
import BackButton from "src/components/Buttons/BackButton";
import { useReviewContext } from "src/context/Review/ReviewContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function ReviewPage() {
  const { getReviewById } = useReviewContext();
  const { getMediaLinks } = useSpotifyContext();

  const navigate = useNavigate();

  const params = useParams();
  const reviewId = params?.reviewId;

  const [isLoading, setIsLoading] = useState(true);
  const [review, setReview] = useState({});
  const [mediaData, setMediaData] = useState({});

  useEffect(() => {
    const fetchReview = async () => {
      setIsLoading(true);

      try {
        const fetchedReview = await getReviewById(reviewId);
        setReview(fetchedReview);

        const fetchedMedia = getMediaLinks(fetchedReview?.media || {});
        setMediaData(fetchedMedia);
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
    <div className="m-auto mt-6 flex h-full w-3/5 flex-col gap-6">
      <BackButton />
      <Review review={review} mediaData={mediaData} />
      <CommentList review={review} />
    </div>
  );
}
