import { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SaveButton from "src/features/list/components/buttons/SaveButton";
import EditListButton from "src/features/list/components/buttons/EditListButton";
import AddToListButton from "src/features/list/components/buttons/AddToListButton";
import {
  faBars,
  faCaretSquareDown,
  faLock,
  faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";

export default function ListHeader(props) {
  const { list } = props;
  const { user } = useOutletContext();

  return (
    <div className="account-list__header">
      <div className="account-list__info">
        <div className="account-list__title">
          {list.isPrivate && <LockIcon />}
          <p className="account-list__name">{list.name}</p>
          <SaveButton list={list} user={user} />
        </div>
        <p className="account-list__description">{list.description}</p>
      </div>

      <ListDropdown {...props} />
    </div>
  );
}

function LockIcon() {
  return (
    <div data-tooltip-content="Private" data-tooltip-id="category-tooltip">
      <FontAwesomeIcon icon={faLock} className="account-list__lock" />
      <Tooltip id="category-tooltip" place="top" type="dark" effect="float" />
    </div>
  );
}

function ListDropdown(props) {
  const {
    list,
    canEdit,
    isEditing,
    setIsEditing,
    orientation,
    setOrientation,
  } = props;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="account-list__dropdown">
      <DropdownButton
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
      />

      <div
        className={`account-list__dropdown-menu ${showDropdown ? "account-list__dropdown-menu--active" : ""}`}
      >
        <OrientationButtons
          orientation={orientation}
          setOrientation={setOrientation}
        />

        {canEdit && (
          <>
            <EditToggle isEditing={isEditing} setIsEditing={setIsEditing} />

            <div className="account-list__dropdown-buttons">
              <AddToListButton
                isModalOpen={isAddModalOpen}
                setIsModalOpen={setIsAddModalOpen}
                list={list}
              />
              <EditListButton
                isModalOpen={isEditModalOpen}
                setIsModalOpen={setIsEditModalOpen}
                list={list}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DropdownButton({ showDropdown, setShowDropdown }) {
  function handleUserClick() {
    setShowDropdown(!showDropdown);
  }

  return (
    <button onClick={handleUserClick} className="account-list__dropdown-button">
      <FontAwesomeIcon icon={faCaretSquareDown} />
    </button>
  );
}

function OrientationButtons({ orientation, setOrientation }) {
  return (
    <div className="account-list__orientation">
      <p className="account-list__label">Layout</p>

      <button
        onClick={() => setOrientation("horizontal")}
        className={`account-list__button
         ${orientation === "horizontal" ? "account-list__button--active" : ""}`}
      >
        <FontAwesomeIcon icon={faTableCellsLarge} />
      </button>

      <button
        onClick={() => setOrientation("vertical")}
        className={`account-list__button
         ${orientation === "vertical" ? "account-list__button--active" : ""}
        `}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>
  );
}

function EditToggle({ isEditing, setIsEditing }) {
  function handleToggle() {
    setIsEditing(!isEditing);
  }

  return (
    <div className="account-list__edit">
      <p className="account-list__label">Edit mode</p>
      <label className="toggle">
        <input
          type="checkbox"
          onChange={handleToggle}
          checked={isEditing}
          className="toggle__input"
        />
        <span className="toggle__slider"></span>
      </label>
    </div>
  );
}
