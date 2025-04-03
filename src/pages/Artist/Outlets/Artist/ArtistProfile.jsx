import { memo, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ListButton from "src/components/Buttons/ListButton";
import { useReviewContext } from "src/context/Review/ReviewContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import MediaList from "./MediaList";
import MediaBanner from "../../MediaBanner";

function ArtistProfile() {
  const { isModalOpen, setIsModalOpen } = useReviewContext();
  const { getArtistAlbums, getArtistSingles } = useSpotifyContext();

  const context = useOutletContext();
  const { artist, colors } = context ?? {};

  const [albums, setAlbums] = useState(null);
  const [singles, setSingles] = useState(null);

  useEffect(() => {
    const getArtistData = async () => {
      try {
        const fetchedAlbums = await getArtistAlbums(artist?.id);
        const fetchedSingles = await getArtistSingles(artist?.id);
        setAlbums(fetchedAlbums);
        setSingles(fetchedSingles);
      } catch (error) {
        console.log(error);
      }
    };

    getArtistData();
  }, []);

  return (
    <div className="flex min-h-screen flex-2 flex-col items-center gap-8 p-10">
      <MediaBanner
        mediaId={artist?.id}
        spotifyURL={artist?.external_urls.spotify}
        color={colors?.dark}
        image={artist?.images[0].url}
        name={artist?.name}
        subtitle={artist && `${artist?.followers.total} followers`}
      />

      <ListButton
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        media={{ mediaId: artist?.id, mediaName: artist?.name }}
        category={"artist"}
      />

      <MediaList media={albums} setMedia={setAlbums} category={"album"} />
      <MediaList media={singles} setMedia={setSingles} category={"track"} />
    </div>
  );
}

export default memo(ArtistProfile);
