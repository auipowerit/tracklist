import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MediaCard from "src/components/Cards/MediaCard";
import ListButton from "src/components/Buttons/ListButton";
import { useReviewContext } from "src/context/Review/ReviewContext";
import TrackList from "./TrackList";

export default function AlbumProfile() {
  const { artist, album } = useOutletContext();
  const { isModalOpen, setIsModalOpen } = useReviewContext();

  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    setTracks(album?.tracks?.items);
  }, [album]);

  if (!album) {
    return (
      <div className="flex h-screen flex-2 flex-col items-center gap-8 p-10"></div>
    );
  }

  return (
    <div className="flex h-screen flex-2 justify-center gap-8 p-10">
      <div className="flex flex-col items-center gap-8">
        <MediaCard
          media={album}
          onClick={() => window.open(album.external_urls.spotify)}
        />

        <ListButton
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          media={{ mediaId: album.id, mediaName: album.name }}
          category={"album"}
        />
      </div>

      <TrackList artistId={artist.id} albumId={album.id} tracks={tracks} />
    </div>
  );
}
