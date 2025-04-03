import { memo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ListButton from "src/components/Buttons/ListButton";
import MediaBanner from "../../MediaBanner";

function TrackProfile() {
  const context = useOutletContext();
  const { track, colors } = context ?? {};

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-2 flex-col items-center gap-8 p-10">
      <MediaBanner
        mediaId={track?.id}
        spotifyURL={track?.external_urls.spotify}
        image={track?.album.images[0].url}
        color={colors?.dark}
        name={track?.name}
        artistName={track?.artists[0].name}
        subtitle={track?.album.name}
      />

      <ListButton
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        media={{ mediaId: track?.id, mediaName: track?.name }}
        category={"track"}
      />
    </div>
  );
}

export default memo(TrackProfile);
