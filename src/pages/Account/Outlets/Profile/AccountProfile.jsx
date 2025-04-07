import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { formatDateMDYLong } from "src/utils/date";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCheck,
  faPen,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function AccountProfile() {
  const { globalData } = useOutletContext();

  const nameLimit = 20;
  const bioLimit = 155;

  const params = new URLSearchParams(window.location.search);
  const navigate = useNavigate();

  const { updateUserDetails, updateSpotifyInfo } = useAuthContext();
  const { getAuthAccessToken, redirectToSpotifyAuth, fetchSpotifyProfile } =
    useSpotifyContext();

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

  async function connectToSpotify() {
    const fetchedCode = params.get("code") || null;

    if (!fetchedCode) {
      redirectToSpotifyAuth();
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("profile")) {
        navigate("/account/profile");
        return;
      }

      const fetchedCode = params.get("code") || null;
      if (!fetchedCode) return;

      const accessToken = await getAuthAccessToken(fetchedCode);
      if (!accessToken) return;

      const profile = await fetchSpotifyProfile(accessToken);
      if (!profile) return;

      if (profile) {
        localStorage.setItem("profile", JSON.stringify(profile));

        await updateSpotifyInfo(
          globalData.id,
          profile?.images?.[0].url,
          profile?.external_urls?.spotify,
        );

        navigate("/account/profile");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex w-full items-center gap-4">
      <Link
        to={globalData.spotifyUrl || "#"}
        target={globalData.spotifyUrl ? "_blank" : "_self"}
      >
        <img
          src={globalData.profileUrl}
          className="h-36 w-36 rounded-full object-cover"
        />
      </Link>

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

          {!isEditing && (
            <button
              type="button"
              onClick={connectToSpotify}
              className="rounded-full bg-green-700 px-3 py-1 hover:text-gray-400"
            >
              {globalData.spotifyUrl ? "Reconnect" : "Connect"}
            </button>
          )}
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
            className="flex items-center gap-2 rounded-sm bg-green-700 px-3 py-1 hover:text-gray-400"
          >
            <FontAwesomeIcon icon={isEditing ? faCheck : faPen} />
            <p>{isEditing ? "Save" : "Edit"}</p>
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetValues}
              className="flex items-center gap-2 rounded-sm bg-green-700 px-3 py-1 hover:text-gray-400"
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
