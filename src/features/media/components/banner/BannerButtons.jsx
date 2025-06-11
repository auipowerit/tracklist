import { useEffect, useState } from "react";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import ShareButton from "src/features/shared/components/buttons/ShareButton";
import HeartButton from "src/features/shared/components/buttons/HeartButton";
import AddToListButton from "src/features/list/components/buttons/AddToListButton";
import AddReviewButton from "src/features/review/components/buttons/AddReviewButton";

export default function BannerButtons({ mediaId, name, category }) {
  const { globalUser, getUserLikes } = useAuthContext();

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const isModalOpen = isListModalOpen || isReviewModalOpen || isShareModalOpen;

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!globalUser) return;

      const userLikes = await getUserLikes(globalUser.uid);
      if (!userLikes || !userLikes[category]) return;

      setIsLiked(userLikes[category].includes(mediaId));
    };

    checkIfLiked();

    return () => {
      setIsLiked(false);
    };
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("lock-scroll");
    }
  }, [isModalOpen]);

  return (
    <div className="media-banner__buttons">
      <HeartButton
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        id={mediaId}
        category={category}
      />

      <AddReviewButton
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
