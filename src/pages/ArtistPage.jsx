import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import AlbumCard from "../components/Cards/AlbumCard";
import RatingProvider from "../context/Rating/RatingProvider";
import ArtistCard from "../components/Cards/ArtistCard";
import { useSpotifyContext } from "../context/Spotify/SpotifyContext";

export default function ArtistPage() {
  const { searchArtistById, getArtistAlbums } = useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [artist, setArtist] = useState([]);
  const [albums, setAlbums] = useState([]);

  const params = useParams();
  const artistId = params?.artistId;

  useEffect(() => {
    const getArtistData = async () => {
      setIsLoading(true);

      try {
        const fetchedArtist = await searchArtistById(artistId);
        const fetchedAlbums = await getArtistAlbums(artistId);

        setArtist(fetchedArtist);
        setAlbums(fetchedAlbums);
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
    <div className="flex w-full flex-col items-center justify-center gap-6 p-6">
      {artist && (
        <ArtistCard
          artist={artist}
          onClick={() => window.open(artist.external_urls.spotify)}
        />
      )}
      {albums && albums.length > 0 && (
        <div className="grid grid-cols-4 gap-8">
          {albums.map((album) => {
            return (
              <RatingProvider key={album.id}>
                <AlbumCard album={album} />
              </RatingProvider>
            );
          })}
        </div>
      )}
    </div>
  );
}
