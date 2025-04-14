import { act, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import MediaBanner from "../../compontents/MediaBanner";
import Discography from "./Discography";
import Tabs from "src/components/Tabs";
import MediaReviews from "../../compontents/MediaReviews";

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
    <div className="flex min-h-screen w-full flex-col items-center gap-8">
      <MediaBanner media={artist} category={"artist"} />

      <div className="mt-6 flex h-full w-full justify-center bg-black/50">
        <div className="flex h-full w-4/6 flex-col items-center gap-6 py-6">
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
      </div>
    </div>
  );
}
