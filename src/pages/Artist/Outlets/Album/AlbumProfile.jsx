import { memo, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { formatDateMDYLong } from "src/utils/date";
import ListButton from "src/components/Buttons/ListButton";
import { useAuthContext } from "src/context/Auth/AuthContext";
import LikeMediaButton from "src/components/Buttons/LikeMediaButton";
import TrackList from "./TrackList";
import MediaBanner from "../../MediaBanner";

function AlbumProfile() {
  const context = useOutletContext();
  const { artist, album, colors } = context ?? {};

  const { globalData } = useAuthContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const tracks = useMemo(() => album?.tracks.items, [album]);

  useEffect(() => {
    setIsLiked(globalData?.likes.find((like) => like.contentId === album?.id));
  }, []);

  return (
    <div className="flex min-h-screen flex-2 flex-col gap-8 p-10">
      <div className="m-auto flex w-fit flex-col items-center justify-center gap-8">
        <MediaBanner
          mediaId={album?.id}
          spotifyURL={album?.external_urls.spotify}
          color={colors?.dark}
          image={album?.images[0].url}
          name={album?.name}
          subtitle={`${album?.tracks.items.length > 0 && album?.tracks.items.length} songs · 
              ${formatDateMDYLong(album?.release_date)}`}
        />

        <ListButton
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          media={{ mediaId: album?.id, mediaName: album?.name }}
          category={"album"}
        />

        {globalData && (
          <LikeMediaButton
            user={globalData}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            id={album?.id}
            category={"album"}
          />
        )}
      </div>

      <TrackList artistId={artist?.id} albumId={album?.id} tracks={tracks} />
    </div>
  );
}
export default memo(AlbumProfile);
