import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import ListButton from "src/components/Buttons/ListButton";
import SaveButton from "src/components/Buttons/SaveButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";

export default function ListHeader(props) {
  const {
    list,
    canEdit,
    isEditing,
    setIsEditing,
    orientation,
    setOrientation,
  } = props;

  const { user } = useOutletContext();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  function handleOrientation() {
    setOrientation(orientation === 0 ? 1 : 0);
  }

  function handleToggle() {
    setIsEditing(!isEditing);
  }

  return (
    <div className="flex items-center justify-between align-middle">
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-2xl text-white">{list.name}</p>
          <p className="text-gray-400">{list.description}</p>
        </div>

        <button onClick={handleOrientation} className="text-xl">
          <FontAwesomeIcon
            icon={orientation === 0 ? faTableCellsLarge : faBars}
          />
        </button>

        {canEdit ? (
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
        ) : (
          <SaveButton list={list} user={user} />
        )}
      </div>
    </div>
  );
}
