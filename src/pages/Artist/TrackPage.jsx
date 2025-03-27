import { useState } from "react";
import { useParams } from "react-router-dom";
import MediaReviews from "./MediaReviews";
import Loading from "../../components/Loading";
import MediaCard from "../../components/Cards/MediaCard";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";

export default function TrackPage() {
  const { getTrackById } = useSpotifyContext();

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
      <div className="flex items-center gap-2 font-bold tracking-wider">
        <Link to={`/artists/${artistId}`}>{artistId}</Link>
        <span>&#x2022;</span>
        <Link to={`/artists/${artistId}/albums/${albumId}`}>{albumId}</Link>
        <span>&#x2022;</span>
        <Link
          to={`/artists/${artistId}/albums/${albumId}/track/${trackId}`}
          className="text-green-700"
        >
          {track.name}
        </Link>
      </div>
      <div className="flex gap-8">
        <div className="flex h-screen flex-2 flex-col items-center gap-8 overflow-auto py-6">
          <MediaCard
            media={track}
            onClick={() => window.open(track.external_urls.spotify)}
          />
        </div>
        <div className="h-screen flex-1 overflow-auto py-6">
          <MediaReviews mediaId={trackId} category={"track"} />
        </div>
      </div>
    </div>
  );
}
