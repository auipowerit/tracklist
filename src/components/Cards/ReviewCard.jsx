import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import RatingStars from "../RatingStars";
import LikeButton from "../Buttons/LikeButton";
import { getTimeSince } from "../../utils/date";
import DeleteButton from "../Buttons/DeleteButton";
import DislikeButton from "../Buttons/DislikeButton";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";

export default function ReviewCard({ review }) {
  const { globalUser } = useAuthContext();
  const { getArtistById, getAlbumById, getTrackById } = useSpotifyContext();

  const defaultImg = "/images/default-img.jpg";

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState(defaultImg);

  async function setMediaDetails(mediaId) {
    let fetchedMedia;

    switch (review.category) {
      case "artist":
        fetchedMedia = await getArtistById(mediaId);

        setTitle(fetchedMedia?.name);
        setImage(fetchedMedia?.images[0]?.url || defaultImg);

        break;
      case "album":
        fetchedMedia = await getAlbumById(mediaId);

        setTitle(fetchedMedia.name);
        setSubtitle(fetchedMedia?.artists[0]?.name || "");
        setImage(fetchedMedia?.images[0]?.url || defaultImg);

        break;
      case "track":
        fetchedMedia = await getTrackById(mediaId);

        setTitle(fetchedMedia.name);
        setSubtitle(fetchedMedia?.artists[0]?.name || "");
        setImage(
          fetchedMedia?.album?.images[0]?.url ||
            fetchedMedia?.images[0]?.url ||
            defaultImg,
        );

        break;
    }
  }

  useEffect(() => {
    const fetchMedia = async () => {
      const mediaId = review.mediaId;
      setMediaDetails(mediaId);
    };

    return fetchMedia;
  }, []);

  return (
    <div className="flex cursor-pointer flex-col gap-2 p-2 transition-colors duration-75 hover:bg-slate-800">
      <div className="flex items-center gap-4">
        <img src={image} className="h-[150px] shadow-lg shadow-black" />

        <div className="flex flex-col justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-lg">
              <div className="bg- flex items-center gap-1 hover:text-gray-400">
                <FontAwesomeIcon icon={faUserCircle} />
                <p className="font-semibold">{review.username} </p>
              </div>
              <span>&#x2022;</span>
              <p className="text-sm font-light">
                {getTimeSince(review.createdAt.toDate())}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-3xl font-bold hover:text-gray-400">{title}</p>
              <p className="font-light">{subtitle}</p>
            </div>

            <RatingStars rating={4.5} />
          </div>
        </div>
      </div>

      <p className="text-xl">{review.content}</p>

      <div className="ml-1 flex items-center">
        <LikeButton review={review} />
        <DislikeButton review={review} />

        {globalUser && globalUser.uid === review.userId && (
          <DeleteButton review={review} />
        )}
      </div>
    </div>
  );
}
