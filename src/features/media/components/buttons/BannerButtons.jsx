import { useEffect, useState } from "react";
import ShareButton from "src/features/shared/components/buttons/ShareButton";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import ReviewButton from "src/features/review/components/buttons/AddReviewButton";
import HeartButton from "src/features/shared/components/buttons/HeartButton";
import AddToListButton from "src/features/list/components/buttons/AddToListButton";

export default function BannerButtons({ mediaId, name, category }) {
  const { globalUser } = useAuthContext();

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(
      globalUser?.likes
        .filter((like) => like.category === category)
        .flatMap((like) => like.content)
        .includes(mediaId),
    );
  }, []);

  return (
    <div className="media-banner__buttons">
      <HeartButton
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

      <AddToListButton
        isModalOpen={isListModalOpen}
        setIsModalOpen={setIsListModalOpen}
        showIcon={true}
        media={{ mediaId, mediaName: name }}
        category={category}
      />

      <ShareButton
        isModalOpen={isShareModalOpen}
        setIsModalOpen={setIsShareModalOpen}
        mediaId={mediaId}
        category={category}
      />
    </div>
  );
}
