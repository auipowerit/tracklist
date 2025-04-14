import { useState } from "react";
import ReviewButton from "src/components/Buttons/ReviewButton";
import ReviewsList from "./components/ReviewsList";
import { useOutletContext } from "react-router-dom";

export default function AccountReviews() {
  const { user, canEdit } = useOutletContext();

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Header canEdit={canEdit} />

      <div className="h-screen overflow-y-scroll">
        <ReviewsList user={user} />
      </div>
    </div>
  );
}

function Header({ canEdit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-b-1 border-white pb-4 align-middle">
      <p className="text-2xl text-white">Reviews</p>
      {canEdit && (
        <ReviewButton
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
}
