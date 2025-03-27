import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TrackList from "./TrackList";
import MediaReviews from "./MediaReviews";
import Loading from "../../components/Loading";
import MediaCard from "../../components/Cards/MediaCard";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function AlbumPage() {
  const { getAlbumById, getAlbumTracks } = useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [album, setAlbum] = useState({});
  const [tracks, setTracks] = useState([]);

  const params = useParams();
  const artistId = params?.artistId;
  const albumId = params?.albumId;

  useEffect(() => {
    const getArtistData = async () => {
      setIsLoading(true);

      try {
        const fetchedAlbum = await getAlbumById(albumId);
        const fetchedTracks = await getAlbumTracks(albumId);

        setAlbum(fetchedAlbum);
        setTracks(fetchedTracks);
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
        to={`/artists/${artistId}`}
        className="flex w-fit items-center gap-2 rounded-sm bg-green-700 p-2"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <p>Back</p>
      </Link>
      <div className="flex gap-8">
        <div className="flex h-screen flex-2 items-start justify-center gap-8 overflow-auto py-6">
          <MediaCard
            media={album}
            onClick={() => window.open(album.external_urls.spotify)}
          />
          <TrackList artistId={artistId} album={album} tracks={tracks} />
        </div>
        <div className="h-screen flex-1 overflow-auto py-6">
          <MediaReviews mediaId={album.id} category={"album"} />
        </div>
      </div>
    </div>
  );
}
