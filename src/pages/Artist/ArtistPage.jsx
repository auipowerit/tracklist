import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";
import Singles from "./Singles";
import Albums from "./Albums";

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
  }, [params]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="mx-10 mt-6 flex flex-col gap-2">
      <div className="flex items-center gap-2 font-bold tracking-wider">
        <Link to={`/artists/${artist.id}`} className="text-green-700">
          {artist.name}
        </Link>
      </div>

      <div className="flex gap-8">
        <div className="flex h-screen flex-2 flex-col items-center gap-8 overflow-auto py-6">
          {artist && (
            <MediaCard
              media={artist}
              category={"artist"}
              onClick={() => window.open(artist.external_urls.spotify)}
            />
          )}

          <Albums artist={artist} albums={albums} setAlbums={setAlbums} />
          <Singles singles={singles} setSingles={setSingles} />
        </div>
        <div className="h-screen flex-1 overflow-auto py-6">
          <MediaReviews mediaId={artist.id} category={"artist"} />
        </div>
      </div>
    </div>
  );
}
