import { memo, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { formatDateMDYLong } from "src/utils/date";
import ListButton from "src/components/Buttons/ListButton";
import { useReviewContext } from "src/context/Review/ReviewContext";
import TrackList from "./TrackList";
import MediaBanner from "../../MediaBanner";

function AlbumProfile() {
  const context = useOutletContext();
  const { artist, album, colors } = context ?? {};

  const { isModalOpen, setIsModalOpen } = useReviewContext();
  const tracks = useMemo(() => album?.tracks.items, [album]);

  return (
    <div className="flex min-h-screen flex-2 flex-col gap-8 p-10">
      <div className="flex flex-col items-center gap-8">
        <MediaBanner
          mediaId={album?.id}
          spotifyURL={album?.external_urls.spotify}
          color={colors?.dark}
          image={album?.images[0].url}
          name={album?.name}
          artistName={artist?.name}
          subtitle={formatDateMDYLong(album?.release_date)}
        />

        <ListButton
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          media={{ mediaId: album?.id, mediaName: album?.name }}
          category={"album"}
        />
      </div>

      <TrackList artistId={artist?.id} albumId={album?.id} tracks={tracks} />
    </div>
  );
}
export default memo(AlbumProfile);
