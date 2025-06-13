import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import Discography from "./Discography";
import Tabs from "src/features/shared/components/buttons/Tabs";
import MediaReviews from "../reviews/MediaReviews";
import "./artist-profile.scss";

export default function ArtistProfile() {
  const tabs = [
    { id: "albums", label: "Albums" },
    { id: "singles", label: "Singles" },
    { id: "reviews", label: "Reviews" },
  ];

  const context = useOutletContext();
  const { artist, activeTab, setActiveTab, filter, setFilter } = context;

  const [albums, setAlbums] = useState(null);
  const [isMoreAlbums, setIsMoreAlbums] = useState(false);
  const [singles, setSingles] = useState(null);
  const [isMoreSingles, setIsMoreSingles] = useState(false);

  const { getArtistAlbums, getArtistSingles } = useSpotifyContext();

  useEffect(() => {
    setActiveTab("albums");

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

  const loadAlbums = async (start) => {
    const fetchedAlbums = await getArtistAlbums(artist?.id, start, 7);

    setIsMoreAlbums(fetchedAlbums.length === 7);
    setAlbums([...(albums || []), ...fetchedAlbums.splice(0, 6)]);
  };

  const loadSingles = async (start) => {
    const fetchedSingles = await getArtistSingles(artist?.id, start, 7);

    setIsMoreSingles(fetchedSingles.length === 7);
    setSingles([...(singles || []), ...fetchedSingles.splice(0, 6)]);
  };

  if (!albums && !singles) {
    return;
  }

  return (
    <section className="media__section">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "reviews" ? (
        <MediaReviews
          mediaId={artist?.id}
          filter={filter}
          setFilter={setFilter}
        />
      ) : activeTab === "albums" ? (
        <Discography
          media={albums}
          setMedia={setAlbums}
          isMore={isMoreAlbums}
          loadMedia={loadAlbums}
        />
      ) : (
        <Discography
          media={singles}
          setMedia={setSingles}
          isMore={isMoreSingles}
          loadMedia={loadSingles}
        />
      )}
    </section>
  );
}
