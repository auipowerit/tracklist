import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MediaReviews from "./MediaReviews";
import Loading from "../../components/Loading";
import MediaCard from "../../components/Cards/MediaCard";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ListButton from "../../components/Buttons/ListButton";
import { useReviewContext } from "../../context/Review/ReviewContext";

export default function TrackPage() {
  const { getTrackById } = useSpotifyContext();
  const { isModalOpen, setIsModalOpen } = useReviewContext();

  const [isLoading, setIsLoading] = useState(true);
  const [track, setTrack] = useState([]);

  const params = useParams();
  const artistId = params?.artistId;
  const albumId = params?.albumId;
  const trackId = params?.trackId;

  useEffect(() => {
    const getArtistData = async () => {
      setIsLoading(true);

      try {
        const fetchedTrack = await getTrackById(trackId);
        setTrack(fetchedTrack);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getArtistData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="mx-10 mt-6 flex flex-col gap-2">
      <Link
        to={`/artists/${artistId}/albums/${albumId}`}
        className="flex w-fit items-center gap-2 rounded-sm bg-green-700 p-2"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <p>Album</p>
      </Link>

      <div className="flex gap-8">
        <div className="flex h-screen flex-2 flex-col items-center gap-4 py-6">
          <MediaCard
            media={track}
            onClick={() => window.open(track.external_urls.spotify)}
          />

          <ListButton
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            media={{ mediaId: track.id, mediaName: track.name }}
            category={"track"}
          />
        </div>
        <div className="h-screen flex-1 overflow-auto py-6">
          <MediaReviews mediaId={trackId} category={"track"} />
        </div>
      </div>
    </div>
  );
}
