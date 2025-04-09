import { useState } from "react";
import ListButton from "src/components/Buttons/ListButton";

export default function ListHeader({ list }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between align-middle">
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-2xl text-white">{list.name}</p>
          <p className="text-gray-400">{list.description}</p>
        </div>

        <ListButton
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          list={list}
        />
      </div>
    </div>
  );
}
