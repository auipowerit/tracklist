import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import MediaCard from "src/components/Cards/MediaCard";
import ListButton from "src/components/Buttons/ListButton";

export default function TrackProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { track } = useOutletContext();
  console.log("given track:", track);

  if (!track) {
    return (
      <div className="flex h-screen flex-2 flex-col items-center gap-8 p-10"></div>
    );
  }

  return (
    <div className="flex h-screen flex-2 flex-col items-center gap-8 p-10">
      <MediaCard
        media={track}
        onClick={() => window.open(media.external_urls.spotify)}
      />

      <ListButton
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        media={{ mediaId: track.id, mediaName: track.name }}
        category={"track"}
      />
    </div>
  );
}
