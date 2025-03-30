import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../components/Loading";
import { useReview } from "../../hooks/useReview";
import ReviewButtons from "../Home/ReviewButtons";
import ReviewStars from "../../components/Review/ReviewStars";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";

export default function ReviewPage() {
  const { getReviewById } = useReview();
  const { getMediaLinks } = useSpotifyContext();

  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [review, setReview] = useState({});
  const [mediaData, setMediaData] = useState({});

  useEffect(() => {
    const fetchReview = async () => {
      setIsLoading(true);

      try {
        const fetchedReview = await getReviewById(params.reviewId);
        setReview(fetchedReview);

        const fetchedMedia = getMediaLinks(fetchedReview.media);
        setMediaData(fetchedMedia);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    return fetchReview;
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="m-auto mt-6 flex h-full w-3/5 flex-col gap-4">
      <Link
        to="/"
        className="flex w-fit items-center gap-2 rounded-sm bg-green-700 px-3 py-2"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Back
      </Link>

      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-4 border-b-1 border-white pb-4">
          <img src={review.media.image} className="w-40" />
          <div className="flex w-full flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUserCircle} />
                <p>Review by {review.username}</p>
              </div>
              <p className="text-sm text-gray-400">
                {review.createdAt.toDate().toDateString()}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-xl">{review.content}</p>
              <ReviewStars rating={review.rating} />
            </div>
            <ReviewButtons review={review} onPage={true} />
          </div>
        </div>
      </div>
      <div>comments</div>
    </div>
  );
}
