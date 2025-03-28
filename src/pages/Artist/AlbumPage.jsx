import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TrackList from "./TrackList";
import MediaReviews from "./MediaReviews";
import Loading from "../../components/Loading";
import { formatDateMDYLong } from "../../utils/date";
import MediaCard from "../../components/Cards/MediaCard";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";
import ListButton from "../../components/Buttons/ListButton";
import { useReviewContext } from "../../context/Review/ReviewContext";

export default function AlbumPage() {
  const { getAlbumById } = useSpotifyContext();
  const { isModalOpen, setIsModalOpen } = useReviewContext();

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
      <Link
        to={`/artists/${artistId}`}
        className="flex w-fit items-center gap-2 rounded-sm bg-green-700 p-2"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <p>Artist</p>
      </Link>
      <div className="flex gap-8">
        <div className="flex flex-2 items-start justify-center gap-8 py-6">
          <div className="flex flex-col items-center gap-4">
            <MediaCard
              media={album}
              defaultSubtitle={formatDateMDYLong(album.release_date)}
              onClick={() => window.open(album.external_urls.spotify)}
            />

            <ListButton
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              media={{ mediaId: album.id, mediaName: album.name }}
              category={"album"}
            />
          </div>

          <div className="h-screen overflow-auto px-8">
            <TrackList artistId={artistId} album={album} tracks={tracks} />
          </div>
        </div>
        <div className="h-screen flex-1 overflow-auto py-6">
          <MediaReviews mediaId={album.id} category={"album"} />
        </div>
      </div>
    </div>
  );
}
