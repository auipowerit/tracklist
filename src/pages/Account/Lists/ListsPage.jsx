import { useState } from "react";
import ListButton from "../../../components/Buttons/ListButton";
import ListList from "./List/ListList";

export default function ListsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="m-auto mt-6 flex h-full w-3/5 flex-col gap-4">
      <div className="flex items-center justify-between align-middle">
        <p className="text-2xl text-gray-400">Your Lists</p>
        <ListButton isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </div>

      <ListList />
    </div>
  );
}
