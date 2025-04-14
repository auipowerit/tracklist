import { useEffect, useState } from "react";
import ReviewButton from "src/components/Buttons/ReviewButton";
import ListButton from "src/components/Buttons/ListButton";
import { useAuthContext } from "src/context/Auth/AuthContext";
import LikeMediaButton from "./LikeMediaButton";
import PlayMediaButton from "./PlayMediaButton";

export default function BannerButtons({ mediaId, name, category }) {
  const { globalUser } = useAuthContext();

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(
      globalUser?.likes
        .filter((like) => like.category === "artist")
        .flatMap((like) => like.content)
        .includes(mediaId),
    );
  }, []);

  return (
    <div className="flex items-center gap-6 text-2xl">
      <LikeMediaButton
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        id={mediaId}
        category={category}
      />

      <ReviewButton
        isModalOpen={isReviewModalOpen}
        setIsModalOpen={setIsReviewModalOpen}
        showIcon={true}
        mediaId={mediaId}
        category={category}
      />
      <ListButton
        isModalOpen={isListModalOpen}
        setIsModalOpen={setIsListModalOpen}
        showIcon={true}
        media={{ mediaId, mediaName: name }}
        category={category}
      />
      <PlayMediaButton />
    </div>
  );
}
