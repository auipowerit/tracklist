import { memo, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ListButton from "src/components/Buttons/ListButton";
import { useAuthContext } from "src/context/Auth/AuthContext";
import LikeMediaButton from "src/components/Buttons/LikeMediaButton";
import MediaBanner from "../../MediaBanner";

function TrackProfile() {
  const context = useOutletContext();
  const { track } = context ?? {};

  const { globalData } = useAuthContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(
      globalData?.likes
        .filter((like) => like.category === "track")
        .flatMap((like) => like.content)
        .includes(track?.id),
    );
  }, []);

  return (
    <div className="m-auto flex min-h-screen w-fit flex-2 flex-col items-center gap-8 p-10">
      <MediaBanner
        mediaId={track?.id}
        spotifyURL={track?.external_urls.spotify}
        image={track?.album.images[0].url}
        name={track?.name}
        subtitle={track?.album.name}
      />

      <ListButton
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        media={{ mediaId: track?.id, mediaName: track?.name }}
        category={"track"}
      />

      {globalData && (
        <LikeMediaButton
          user={globalData}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          id={track?.id}
          category={"track"}
        />
      )}
    </div>
  );
}

export default memo(TrackProfile);
