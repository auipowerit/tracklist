import { memo } from "react";
import { useOutletContext } from "react-router-dom";
import MediaBanner from "../../compontents/MediaBanner";

function TrackProfile() {
  const context = useOutletContext();
  const { track } = context ?? {};

  return (
    <div className="m-auto flex min-h-screen w-fit flex-2 flex-col items-center gap-8 p-10">
      <MediaBanner
        mediaId={track?.id}
        spotifyURL={track?.external_urls.spotify}
        image={track?.album.images[0].url}
        name={track?.name}
        subtitle={track?.album.name}
        category={"track"}
      />
    </div>
  );
}

export default memo(TrackProfile);
