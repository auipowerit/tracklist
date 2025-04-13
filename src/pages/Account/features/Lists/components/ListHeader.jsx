import { useState } from "react";
import ListButton from "src/components/Buttons/ListButton";

export default function ListHeader({ list, canEdit, isEditing, setIsEditing }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex items-center justify-between align-middle">
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-2xl text-white">{list.name}</p>
          <p className="text-gray-400">{list.description}</p>
        </div>

        {canEdit && (
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-4">
              <ListButton
                isModalOpen={isAddModalOpen}
                setIsModalOpen={setIsAddModalOpen}
                list={list}
                isAdding={true}
              />
              <ListButton
                isModalOpen={isEditModalOpen}
                setIsModalOpen={setIsEditModalOpen}
                list={list}
              />
            </div>

            <button
              className={`w-fit rounded-md bg-gray-500 px-4 py-2 ${isEditing && "bg-green-700"}`}
              onClick={handleToggle}
            >
              {isEditing ? "On" : "Off"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
