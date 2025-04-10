import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import RatingBar from "src/components/Review/RatingBar";
import PostButton from "src/components/Buttons/PostButton";
import ListButton from "src/components/Buttons/ListButton";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { ReviewStars } from "src/components/Review/ReviewContent";
import { useReviewContext } from "src/context/Review/ReviewContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import LikeMediaButton from "src/pages/Artist/compontents/LikeMediaButton";
import ShareMediaButton from "./ShareMediaButton";

export default function MediaBanner(props) {
  const { mediaId, spotifyURL, image, name, subtitle, category } = props;

  const { getAvgRating } = useReviewContext();
  const { defaultImg } = useSpotifyContext();

  const [rating, setRating] = useState({
    avgRating: 0,
    count: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { avgRating, count } = (await getAvgRating(mediaId)) || {};
      setRating({ avgRating, count });
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-64 items-center text-center shadow-md shadow-black/50">
      <div
        onClick={() => window.open(spotifyURL)}
        data-tooltip-id="media-tooltip"
        data-tooltip-content="Open in Spotify"
        className="cursor-pointer shadow-black/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/75"
      >
        <img src={image || defaultImg} className="h-64 w-64" />
        <Tooltip id="media-tooltip" place="top" type="dark" effect="float" />
      </div>
      <div className="flex h-full flex-col items-center justify-between bg-black/40 p-2">
        <div className="m-auto flex w-80 flex-col items-center gap-1">
          <p className="text-4xl font-bold">{name}</p>
          <p className="text-gray-300">{subtitle}</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <RatingBar mediaId={mediaId} />
            <div className="mt-auto flex items-center justify-center gap-1">
              <p>{rating.avgRating?.toFixed(1) || ""}</p>
              <ReviewStars rating={rating.avgRating || 0} />
              <p>{(rating.avgRating && `(${rating.count})`) || ""}</p>
            </div>
            <MediaButtons mediaId={mediaId} name={name} category={category} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MediaButtons({ mediaId, name, category }) {
  const { globalUser } = useAuthContext();

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(
      globalUser?.likes
        .filter((like) => like.category === "artist")
        .flatMap((like) => like.content)
        .includes(mediaId),
    );
  }, []);
  return (
    <div className="flex items-center gap-6 text-2xl">
      <LikeMediaButton
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        id={mediaId}
        category={category}
      />
      <ListButton
        isModalOpen={isListModalOpen}
        setIsModalOpen={setIsListModalOpen}
        showIcon={true}
        media={{ mediaId, mediaName: name }}
        category={category}
      />
      <PostButton
        isModalOpen={isReviewModalOpen}
        setIsModalOpen={setIsReviewModalOpen}
        showIcon={true}
        mediaId={mediaId}
        category={category}
      />

      <ShareMediaButton />
    </div>
  );
}
