import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSpotifyContext } from "../context/Spotify/SpotifyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faHome } from "@fortawesome/free-solid-svg-icons";
import Artist from "../components/Artist";
import Album from "../components/Album";
import Header from "../components/Header";

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
    return (
      <div className="h-full w-full py-2 text-center">
        <div className="flex h-[80vh] w-full flex-col justify-center gap-4 py-2 text-center align-middle text-5xl">
          <FontAwesomeIcon icon={faSpinner} spin />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full py-2">
      <Header />

      <div className="m-auto flex w-fit flex-col items-center justify-center gap-4 align-middle">
        <Link
          to="/"
          className="m-auto w-fit rounded-md px-5 py-2 text-2xl hover:bg-green-900"
        >
          <p className="flex items-center gap-2">
            <FontAwesomeIcon icon={faHome} />
            Go to home
          </p>
        </Link>

        {artist && (
          <Artist
            artist={artist}
            onClick={() => window.open(artist.external_urls.spotify)}
          />
        )}
        {albums && albums.length > 0 && (
          <div className="grid grid-cols-4 gap-6">
            {albums.map((album) => {
              return <Album key={album.id} album={album} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
