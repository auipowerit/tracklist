import { useState } from "react";
import PostButton from "src/components/Buttons/PostButton";
import ReviewsList from "./components/ReviewsList";

export default function AccountReviews() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Header />

      <div className="h-screen overflow-y-scroll">
        <ReviewsList />
      </div>
    </div>
  );
}

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-b-1 border-white pb-4 align-middle">
      <p className="text-2xl text-white">Reviews</p>
      <PostButton isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}
