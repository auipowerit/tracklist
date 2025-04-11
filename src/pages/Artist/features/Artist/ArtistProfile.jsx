import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import MediaBanner from "../../compontents/MediaBanner";
import Discography from "./Discography";

export default function ArtistProfile() {
  const context = useOutletContext();
  const { artist } = context;

  const { getArtistAlbums, getArtistSingles } = useSpotifyContext();

  const [albums, setAlbums] = useState([]);
  const [isMoreAlbums, setIsMoreAlbums] = useState(false);
  const [singles, setSingles] = useState([]);
  const [isMoreSingles, setIsMoreSingles] = useState(false);

  useEffect(() => {
    const getArtistData = async () => {
      try {
        await loadAlbums(0);
        await loadSingles(0);
      } catch (error) {
        console.log(error);
      }
    };
    getArtistData();
  }, []);

  async function loadAlbums(start) {
    const fetchedAlbums = await getArtistAlbums(artist?.id, start, 7);

    setIsMoreAlbums(fetchedAlbums.length === 7);
    setAlbums([...albums, ...fetchedAlbums.splice(0, 6)]);
  }

  async function loadSingles(start) {
    const fetchedSingles = await getArtistSingles(artist?.id, start, 7);

    setIsMoreSingles(fetchedSingles.length === 7);
    setSingles([...singles, ...fetchedSingles.splice(0, 6)]);
  }

  if (!albums && !singles) {
    return;
  }

  return (
    <div className="m-auto flex min-h-screen w-full flex-2 flex-col items-center gap-8 p-10">
      <MediaBanner
        mediaId={artist?.id}
        spotifyURL={artist?.external_urls.spotify}
        image={artist?.images[0].url}
        name={artist?.name}
        subtitle={`${artist?.followers.total.toLocaleString()} followers`}
        category={"artist"}
      />

      <Discography
        media={albums}
        setMedia={setAlbums}
        category={"album"}
        title={"Albums"}
        loadMedia={loadAlbums}
        isMore={isMoreAlbums}
      />

      <Discography
        media={singles}
        setMedia={setSingles}
        category={"track"}
        title={"Singles"}
        loadMedia={loadSingles}
        isMore={isMoreSingles}
      />
    </div>
  );
}
