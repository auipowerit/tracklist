import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function AccountForm({ isModalOpen, setIsModalOpen }) {
  const { globalData, updateUserDetails } = useAuthContext();
  const { redirectToSpotifyAuth } = useSpotifyContext();

  const nameLimit = 25;
  const bioLimit = 100;

  const [name, setName] = useState(globalData?.displayname || "");
  const [bio, setBio] = useState(globalData?.bio || "");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!globalData || name === "" || bio === "") return;

    await updateUserDetails(globalData.id, name, bio);

    setIsModalOpen(false);
    window.location.reload();
    resetValues();
  }

  function resetValues() {
    setName("");
    setBio("");
  }

  useEffect(() => {
    if (!isModalOpen) resetValues();

    if (globalData) {
      setName(globalData.displayname);
      setBio(globalData.bio);
    }
  }, [isModalOpen, globalData]);

  return (
    <form
      onSubmit={handleSubmit}
      className="m-auto flex flex-col items-center justify-center gap-8 py-6 text-xl"
    >
      <p className="w-full border-b-1 border-white pb-2 text-2xl font-bold">
        Edit Account
      </p>
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-4">
          <img
            src={globalData?.profileUrl}
            className="h-48 w-48 rounded-full"
          />
          <button
            type="button"
            onClick={redirectToSpotifyAuth}
            className="flex items-center justify-center gap-2 rounded-md border-2 border-white px-3 py-2 hover:text-gray-400"
          >
            <FaSpotify />
            <p>{globalData.spotifyUrl ? "Resync" : "Sync"}</p>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="name">Display name</label>
              <p
                className={`text-sm ${name.length >= nameLimit ? "text-red-600" : "text-gray-400"}`}
              >
                {name.length || 0}/{nameLimit}
              </p>
            </div>
            <input
              name="name"
              type="text"
              value={name}
              onChange={(e) => {
                if (e.target.value.length > nameLimit) {
                  setName(e.target.value.slice(0, nameLimit));
                  return;
                }
                setName(e.target.value);
              }}
              className="border-1 border-white px-2 py-1"
            />
          </div>
          <div className="flex h-full flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="bio">bio</label>
              <p
                className={`text-sm ${bio.length >= bioLimit ? "text-red-600" : "text-gray-400"}`}
              >
                {bio.length || 0}/{bioLimit}
              </p>
            </div>
            <textarea
              name="bio"
              type="text"
              value={bio}
              onChange={(e) => {
                if (e.target.value.length > bioLimit) {
                  setBio(e.target.value.slice(0, bioLimit));
                  return;
                }
                setBio(e.target.value);
              }}
              className="h-full border-1 border-white px-2 py-1"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-md bg-green-700 px-4 py-2 hover:text-gray-400"
        >
          <FontAwesomeIcon icon={faCheck} />
          <p>Save</p>
        </button>
      </div>
    </form>
  );
}
