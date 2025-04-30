import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import Discography from "./Discography";
import Tabs from "src/layouts/buttons/Tabs";
import MediaReviews from "../MediaReviews";
import "./artist-profile.scss";

export default function ArtistProfile() {
  const context = useOutletContext();
  const { artist } = context;

  const { getArtistAlbums, getArtistSingles } = useSpotifyContext();

  const [albums, setAlbums] = useState(null);
  const [isMoreAlbums, setIsMoreAlbums] = useState(false);
  const [singles, setSingles] = useState(null);
  const [isMoreSingles, setIsMoreSingles] = useState(false);
  const [activeTab, setActiveTab] = useState("albums");

  const tabs = [
    { id: "albums", label: "Albums" },
    { id: "singles", label: "Singles" },
    { id: "reviews", label: "Reviews" },
  ];

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
    setAlbums([...(albums || []), ...fetchedAlbums.splice(0, 6)]);
  }

  async function loadSingles(start) {
    const fetchedSingles = await getArtistSingles(artist?.id, start, 7);

    setIsMoreSingles(fetchedSingles.length === 7);
    setSingles([...(singles || []), ...fetchedSingles.splice(0, 6)]);
  }

  if (!albums && !singles) {
    return;
  }

  return (
    <div className="artist-profile">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "reviews" ? (
        <MediaReviews mediaId={artist?.id} />
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
    </div>
  );
}
