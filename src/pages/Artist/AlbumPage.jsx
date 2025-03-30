import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TrackList from "./TrackList";
import MediaReviews from "./MediaReviews";
import Loading from "../../components/Loading";
import { formatDateMDYLong } from "../../utils/date";
import MediaCard from "../../components/Cards/MediaCard";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";
import ListButton from "../../components/Buttons/ListButton";
import { useReviewContext } from "../../context/Review/ReviewContext";

export default function AlbumPage() {
  const { getArtistById, getAlbumById, getAlbumTracks } = useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [artist, setArtist] = useState([]);
  const [album, setAlbum] = useState({});
  const [tracks, setTracks] = useState([]);

  const params = useParams();
  const artistId = params?.artistId;
  const albumId = params?.albumId;

  useEffect(() => {
    const getArtistData = async () => {
      setIsLoading(true);

      try {
        const fetchedArtist = await getArtistById(artistId);
        const fetchedAlbum = await getAlbumById(albumId);
        const fetchedTracks = await getAlbumTracks(albumId);

        setArtist(fetchedArtist);
        setAlbum(fetchedAlbum);
        setTracks(fetchedAlbum.tracks.items);
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
        <Link
          to={`/artists/${artistId}/albums/${albumId}`}
          className="text-green-700"
        >
          {album.name}
        </Link>
      </div>
      <div className="flex gap-8">
        <div className="flex h-screen flex-2 items-start justify-center gap-8 overflow-auto py-6">
          <MediaCard
            media={album}
            onClick={() => window.open(album.external_urls.spotify)}
          />
          <TrackList artistId={artistId} albumId={albumId} tracks={tracks} />
        </div>
        <div className="h-screen flex-1 overflow-auto py-6">
          <MediaReviews mediaId={album.id} category={"album"} />
        </div>
      </div>
    </div>
  );
}
