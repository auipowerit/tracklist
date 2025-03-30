import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MediaReviews from "./MediaReviews";
import Loading from "../../components/Loading";
import MediaCard from "../../components/Cards/MediaCard";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";

export default function TrackPage() {
  const { getArtistById, getAlbumById, getTrackById } = useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [artist, setArtist] = useState([]);
  const [album, setAlbum] = useState([]);
  const [track, setTrack] = useState([]);

  const params = useParams();
  const artistId = params?.artistId;
  const albumId = params?.albumId;
  const trackId = params?.trackId;

  useEffect(() => {
    const getArtistData = async () => {
      setIsLoading(true);

      try {
        const fetchedArtist = await getArtistById(artistId);
        const fetchedAlbum = await getAlbumById(albumId);
        const fetchedTrack = await getTrackById(trackId);

        setArtist(fetchedArtist);
        setAlbum(fetchedAlbum);
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
        <Link to={`/artists/${artistId}`}>{artist.name}</Link>
        <span>&#x2022;</span>
        <Link to={`/artists/${artistId}/albums/${albumId}`}>{album.name}</Link>
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
