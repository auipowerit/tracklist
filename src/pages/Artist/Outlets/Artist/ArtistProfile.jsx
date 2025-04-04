import { memo, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ListButton from "src/components/Buttons/ListButton";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import MediaList from "./MediaList";
import MediaBanner from "../../MediaBanner";

function ArtistProfile() {
  const { getArtistAlbums, getArtistSingles } = useSpotifyContext();

  const context = useOutletContext();
  const { artist, colors } = context ?? {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [isMoreAlbums, setIsMoreAlbums] = useState(false);
  const [singles, setSingles] = useState([]);
  const [isMoreSingles, setIsMoreSingles] = useState(false);

  async function loadMedia(start, category) {
    if (category === "album") {
      const fetchedAlbums = await getArtistAlbums(artist?.id, start, 7);

      setIsMoreAlbums(fetchedAlbums.length === 7);
      setAlbums([...albums, ...fetchedAlbums.splice(0, 6)]);
    } else if (category === "track") {
      const fetchedSingles = await getArtistSingles(artist?.id, start, 7);

      setIsMoreSingles(fetchedSingles.length === 7);
      setSingles([...singles, ...fetchedSingles.splice(0, 6)]);
    }
  }

  useEffect(() => {
    const getArtistData = async () => {
      try {
        await loadMedia(0, "album");
        await loadMedia(0, "track");
      } catch (error) {
        console.log(error);
      }
    };

    getArtistData();
  }, []);

  return (
    <div className="m-auto flex min-h-screen w-full flex-2 flex-col items-center gap-8 p-10">
      <MediaBanner
        mediaId={artist?.id}
        spotifyURL={artist?.external_urls.spotify}
        color={colors?.dark}
        image={artist?.images[0].url}
        name={artist?.name}
        subtitle={`${artist?.followers.total.toLocaleString()} followers`}
      />

      <ListButton
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        media={{ mediaId: artist?.id, mediaName: artist?.name }}
        category={"artist"}
      />

      <MediaList
        media={albums}
        setMedia={setAlbums}
        category={"album"}
        loadMedia={loadMedia}
        isMore={isMoreAlbums}
      />

      <MediaList
        media={singles}
        setMedia={setSingles}
        category={"track"}
        loadMedia={loadMedia}
        isMore={isMoreSingles}
      />
    </div>
  );
}

export default memo(ArtistProfile);
