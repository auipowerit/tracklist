import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SongsList from "./SongsList";
import AlbumsList from "./AlbumsList";
import ArtistReviews from "./ArtistReviews";
import Loading from "../../components/Loading";
import MediaCard from "../../components/Cards/MediaCard";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";

export default function ArtistPage() {
  const { getArtistById, getArtistAlbums, getArtistSingles } =
    useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [artist, setArtist] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);

  const params = useParams();
  const artistId = params?.artistId;

  useEffect(() => {
    const getArtistData = async () => {
      setIsLoading(true);

      try {
        const fetchedArtist = await getArtistById(artistId);
        const fetchedAlbums = await getArtistAlbums(artistId);
        const fetchedTracks = await getArtistSingles(artistId);

        setArtist(fetchedArtist);
        setAlbums(fetchedAlbums);
        setTracks(fetchedTracks);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getArtistData();
  }, [artistId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="mx-10 mt-6 flex gap-8">
      <div className="flex h-screen flex-2 flex-col items-center gap-8 overflow-auto py-6">
        {artist && (
          <MediaCard
            media={artist}
            category={"artist"}
            onClick={() => window.open(artist.external_urls.spotify)}
          />
        )}

        <AlbumsList albums={albums} setAlbums={setAlbums} />
        <SongsList tracks={tracks} setTracks={setTracks} />
      </div>
      <div className="h-screen flex-1 overflow-auto py-6">
        <ArtistReviews artistId={artistId} />
      </div>
    </div>
  );
}
