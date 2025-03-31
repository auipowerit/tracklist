import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentList from "./CommentList";
import Loading from "../../components/Loading";
import { useReview } from "../../hooks/useReview";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";
import { useCommentContext } from "../../context/Comment/CommentContext";
import Review from "./Review";
import BackButton from "../../components/Buttons/BackButton";

export default function ReviewPage() {
  const { getReviewById } = useReview();
  const { getCommentsByReviewId } = useCommentContext();
  const { getMediaLinks } = useSpotifyContext();

  const params = useParams();

  const reviewId = params?.reviewId;

  const [isLoading, setIsLoading] = useState(true);
  const [review, setReview] = useState({});
  const [mediaData, setMediaData] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchReview = async () => {
      setIsLoading(true);

      try {
        const fetchedReview = await getReviewById(reviewId);
        setReview(fetchedReview);

        const fetchedMedia = getMediaLinks(fetchedReview.media);
        setMediaData(fetchedMedia);

        const fetchedComments = await getCommentsByReviewId(reviewId);
        setComments(fetchedComments);
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
    <div className="m-auto mt-6 flex h-full w-3/5 flex-col gap-6">
      <BackButton targetURL="/" />

      <Review
        review={review}
        mediaTitle={mediaData.title}
        mediaSubtitle={mediaData.subtitle}
      />
      <CommentList
        comments={comments}
        setComments={setComments}
        reviewId={reviewId}
      />
    </div>
  );
}
