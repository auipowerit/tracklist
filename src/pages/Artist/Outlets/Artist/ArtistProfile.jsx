import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MediaCard from "src/components/Cards/MediaCard";
import ListButton from "src/components/Buttons/ListButton";
import { useReviewContext } from "src/context/Review/ReviewContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import MediaList from "./MediaList";

export default function ArtistProfile() {
  const { isModalOpen, setIsModalOpen } = useReviewContext();
  const { getArtistAlbums, getArtistSingles } = useSpotifyContext();

  const { artist } = useOutletContext();

  const [albums, setAlbums] = useState([]);
  const [singles, setSingles] = useState([]);

  useEffect(() => {
    const getArtistData = async () => {
      try {
        const fetchedAlbums = await getArtistAlbums(artist.id);
        const fetchedSingles = await getArtistSingles(artist.id);

        setAlbums(fetchedAlbums);
        setSingles(fetchedSingles);
      } catch (error) {
        console.log(error);
      }
    };

    getArtistData();
  }, []);

  if (!artist) {
    return (
      <div className="flex h-screen flex-2 flex-col items-center gap-8 overflow-auto p-10"></div>
    );
  }

  return (
    <div className="flex min-h-screen flex-2 flex-col items-center gap-8 p-10">
      <MediaCard
        media={artist}
        category={"artist"}
        onClick={() => window.open(artist.external_urls.spotify)}
      />

      <ListButton
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        media={{ mediaId: artist.id, mediaName: artist.name }}
        category={"artist"}
      />

      <MediaList media={albums} setMedia={setAlbums} category={"album"} />
      <MediaList media={singles} setMedia={setSingles} category={"track"} />
    </div>
  );
}
