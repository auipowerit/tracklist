import {
  faCalendar,
  faCancel,
  faCheck,
  faPen,
  faUserCircle,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { formatDateMDYLong } from "src/utils/date";

export default function AccountProfile() {
  const { globalData } = useOutletContext();

  const { updateUserDetails } = useAuthContext();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(globalData.displayname);
  const [bio, setBio] = useState(globalData.bio);

  const nameLimit = 20;
  const bioLimit = 155;

  const [nameInput, setNameInput] = useState(name);
  const [bioInput, setBioInput] = useState(bio);

  async function handleEdit() {
    if (isEditing) {
      await handleSave();
    } else {
      setIsEditing(true);
    }
  }

  async function handleSave() {
    if (nameInput === "" || bioInput === "") return;
    if (nameInput.length > nameLimit || bioInput.length > bioLimit) return;

    await updateUserDetails(nameInput, bioInput);

    setName(nameInput);
    setBio(bioInput);

    resetValues();
  }

  function resetValues() {
    setNameInput(name);
    setBioInput(bio);
    setIsEditing(false);
  }

  return (
    <div className="flex w-full items-center gap-4">
      <FontAwesomeIcon icon={faUserCircle} className="text-8xl" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                onChange={(e) => {
                  if (e.target.value.length > nameLimit) {
                    setNameInput(e.target.value.slice(0, nameLimit));
                    return;
                  }
                  setNameInput(e.target.value);
                }}
                value={nameInput}
                className="border-1 border-white px-2 py-1 text-xl outline-none"
              />
              <p
                className={`text-sm text-gray-400 ${nameInput.length >= nameLimit && "text-red-500"}`}
              >
                {nameInput.length || 0}/{nameLimit}
              </p>
            </div>
          ) : (
            <p className="text-xl font-bold">{name}</p>
          )}
          <p className="text-gray-400">@{globalData.username}</p>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              onChange={(e) => {
                if (e.target.value.length > bioLimit) {
                  setBioInput(e.target.value.slice(0, bioLimit));
                  return;
                }
                setBioInput(e.target.value);
              }}
              value={bioInput}
              className="border-1 border-white px-2 py-1 outline-none"
            />
            <p
              className={`text-sm text-gray-400 ${bioInput.length >= bioLimit && "text-red-500"}`}
            >
              {bioInput.length || 0}/{bioLimit}
            </p>
          </div>
        ) : (
          <p>{bio}</p>
        )}
        <div className="flex items-center gap-1 text-gray-400">
          <FontAwesomeIcon icon={faCalendar} className="text-sm" />
          <p>Joined on {formatDateMDYLong(globalData.createdAt.toDate())}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-gray-400">
              <span className="font-bold text-white">
                {globalData.followers.length}
              </span>{" "}
              followers
            </p>
            <p className="text-gray-400">
              <span className="font-bold text-white">
                {globalData.followers.length}
              </span>{" "}
              following
            </p>
          </div>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 rounded-sm bg-green-700 px-3 py-1"
          >
            <FontAwesomeIcon icon={isEditing ? faCheck : faPen} />
            <p>{isEditing ? "Save" : "Edit"}</p>
          </button>
          {isEditing && (
            <button
              onClick={resetValues}
              className="flex items-center gap-2 rounded-sm bg-green-700 px-3 py-1"
            >
              <FontAwesomeIcon icon={faX} />
              <p>Cancel</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
