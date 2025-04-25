import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ListButton from "src/features/list/components/buttons/ListButton";
import SaveButton from "src/features/list/components/buttons/SaveButton";
import {
  faBars,
  faCaretSquareDown,
  faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";

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
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function handleUserClick() {
    setShowDropdown(!showDropdown);
  }

  function handleToggle() {
    setIsEditing(!isEditing);
  }

  return (
    <div className="account-page-header">
      <div className="account-list-title">
        <p className="account-list-name">{list.name}</p>
        <p className="account-list-description">{list.description}</p>
      </div>

      <div ref={dropdownRef} className="account-list-dropdown-container">
        <button onClick={handleUserClick}>
          <FontAwesomeIcon icon={faCaretSquareDown} />
        </button>

        <div className={`account-list-dropdown ${showDropdown && "active"}`}>
          <div className="account-list-orientation">
            <p className="account-list-label">Layout</p>
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
            <>
              <div className="account-list-edit">
                <p className="account-list-label">Edit mode</p>
                <label className="toggle-container">
                  <input
                    type="checkbox"
                    onClick={handleToggle}
                    checked={isEditing}
                    className="toggle-input"
                  />
                  <span className="toggle"></span>
                </label>
              </div>

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
            </>
          ) : (
            <SaveButton list={list} user={user} />
          )}
        </div>
      </div>
    </div>
  );
}
