import { useState } from "react";
import ListButton from "src/components/Buttons/ListButton";
import ListList from "./List/ListList";

export default function ListsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex items-center justify-between align-middle">
        <p className="text-2xl text-white">Your Lists</p>
        <ListButton isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </div>

      <ListList />
    </div>
  );
}
