import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MediaList from "./MediaList";
import MediaReviews from "./MediaReviews";
import Loading from "../../components/Loading";
import MediaCard from "../../components/Cards/MediaCard";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";

export default function ArtistPage() {
  const { getArtistById, getArtistAlbums, getArtistSingles } =
    useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [artist, setArtist] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [singles, setSingles] = useState([]);

  const params = useParams();
  const artistId = params?.artistId;

  useEffect(() => {
    const getArtistData = async () => {
      setIsLoading(true);

      try {
        const fetchedArtist = await getArtistById(artistId);
        const fetchedAlbums = await getArtistAlbums(artistId);
        const fetchedSingles = await getArtistSingles(artistId);

        setArtist(fetchedArtist);
        setAlbums(fetchedAlbums);
        setSingles(fetchedSingles);
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
      <div className="flex gap-8">
        <div className="flex h-screen flex-2 flex-col items-center gap-8 overflow-auto p-10">
          {artist && (
            <MediaCard
              media={artist}
              category={"artist"}
              onClick={() => window.open(artist.external_urls.spotify)}
            />
          )}

          <div className="flex gap-2">
            {artist.genres.map((genre) => (
              <p key={genre} className="rounded-sm bg-gray-700 p-2">
                {genre}
              </p>
            ))}
          </div>

          <MediaList media={albums} setMedia={setAlbums} category={"album"} />
          <MediaList media={singles} setMedia={setSingles} category={"track"} />
        </div>
        <div className="h-screen flex-1 overflow-auto py-6">
          <MediaReviews mediaId={artistId} category={"artist"} />
        </div>
      </div>
    </div>
  );
}
