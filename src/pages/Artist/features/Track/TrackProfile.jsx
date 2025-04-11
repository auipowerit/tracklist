import { useOutletContext } from "react-router-dom";
import MediaBanner from "../../compontents/MediaBanner";

export default function TrackProfile() {
  const context = useOutletContext();
  const { track } = context;

  return (
    <div className="m-auto flex min-h-screen w-fit flex-2 flex-col items-center gap-8 p-10">
      <MediaBanner media={track} category={"track"} />
    </div>
  );
}
