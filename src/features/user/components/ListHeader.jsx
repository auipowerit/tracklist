import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ListButton from "src/features/list/components/buttons/ListButton";
import SaveButton from "src/features/list/components/buttons/SaveButton";
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

        <div className="flex items-center gap-4">
          <button
            onClick={() => setOrientation(0)}
            className={`text-xl ${orientation === 0 && "text-green-500"}`}
          >
            <FontAwesomeIcon icon={faTableCellsLarge} />
          </button>

          <button
            onClick={() => setOrientation(1)}
            className={`text-xl ${orientation === 1 && "text-green-500"}`}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

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

            <div className="flex items-center gap-2">
              <p className="text-gray-400">Edit mode</p>
              <label className="relative inline-block h-[26px] w-[50px]">
                <input
                  type="checkbox"
                  onClick={handleToggle}
                  checked={isEditing}
                  className="peer h-0 w-0 opacity-0"
                />
                <span className="slider bg-gray-700 peer-checked:bg-green-700"></span>
              </label>
            </div>
          </div>
        ) : (
          <SaveButton list={list} user={user} />
        )}
      </div>
    </div>
  );
}
