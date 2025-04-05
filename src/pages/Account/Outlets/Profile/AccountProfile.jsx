import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { formatDateMDYLong } from "src/utils/date";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCheck,
  faPen,
  faUserCircle,
  faX,
} from "@fortawesome/free-solid-svg-icons";

export default function AccountProfile() {
  const { globalData } = useOutletContext();

  const nameLimit = 20;
  const bioLimit = 155;

  const { updateUserDetails } = useAuthContext();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(globalData.displayname);
  const [bio, setBio] = useState(globalData.bio);

  const [nameInput, setNameInput] = useState(name);
  const [bioInput, setBioInput] = useState(bio);

  async function handleEdit(e) {
    e.preventDefault();

    isEditing ? await handleSave() : setIsEditing(true);
  }

  function limitName(e) {
    if (e.target.value.length > nameLimit) {
      setNameInput(e.target.value.slice(0, nameLimit));
      return;
    }
    setNameInput(e.target.value);
  }

  function limitBio(e) {
    if (e.target.value.length > bioLimit) {
      setBioInput(e.target.value.slice(0, bioLimit));
      return;
    }
    setBioInput(e.target.value);
  }

  async function handleSave() {
    if (nameInput === "" || bioInput === "") return;
    if (nameInput.length > nameLimit || bioInput.length > bioLimit) return;

    await updateUserDetails(nameInput, bioInput);

    setName(nameInput);
    setBio(bioInput);

    setIsEditing(false);
  }

  function resetValues() {
    setNameInput(name);
    setBioInput(bio);
    setIsEditing(false);
  }

  return (
    <div className="flex w-full items-center gap-4">
      <FontAwesomeIcon icon={faUserCircle} className="text-8xl" />
      <form onSubmit={handleEdit} className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                name="name"
                type="text"
                value={nameInput}
                placeholder="Your name"
                onChange={limitName}
                className="w-full border-1 border-white px-2 py-1 outline-none"
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
              name="bio"
              type="text"
              value={bioInput}
              placeholder="Your bio"
              onChange={limitBio}
              className="w-full border-1 border-white px-2 py-1 outline-none"
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
            type="submit"
            className="flex items-center gap-2 rounded-sm bg-green-700 px-3 py-1"
          >
            <FontAwesomeIcon icon={isEditing ? faCheck : faPen} />
            <p>{isEditing ? "Save" : "Edit"}</p>
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetValues}
              className="flex items-center gap-2 rounded-sm bg-green-700 px-3 py-1"
            >
              <FontAwesomeIcon icon={faX} />
              <p>Cancel</p>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
