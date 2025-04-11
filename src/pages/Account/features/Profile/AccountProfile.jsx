import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { Link, useNavigate } from "react-router-dom";
import Modal from "src/components/Modal";
import { formatDateMDYLong } from "src/utils/date";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faPen } from "@fortawesome/free-solid-svg-icons";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import AccountForm from "./components/AccountForm";

export default function AccountProfile() {
  const params = new URLSearchParams(window.location.search);
  const navigate = useNavigate();

  const { globalUser } = useAuthContext();
  const { updateSpotifyInfo } = useAuthContext();
  const { getAuthAccessToken, getSpotifyUser } = useSpotifyContext();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      handleNavigate();

      const profile = await handleProfile();
      if (profile) {
        await handleUpdate(profile);
      }
    };

    fetchData();
  }, []);

  function handleNavigate() {
    if (localStorage.getItem("profile")) {
      navigate("/account/profile");
    }
  }

  async function handleProfile() {
    const fetchedCode = params.get("code") || null;
    if (!fetchedCode) return;

    const accessToken = await getAuthAccessToken(fetchedCode);
    if (!accessToken) return;

    const profile = await getSpotifyUser(accessToken);
    if (!profile) return;

    return profile;
  }

  async function handleUpdate(profile) {
    localStorage.setItem("profile", JSON.stringify(profile));

    await updateSpotifyInfo(
      globalUser.uid,
      profile?.images?.[0].url,
      profile?.external_urls?.spotify,
    );

    navigate("/account/profile");
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <AccountForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>

      <Header />

      <div className="flex w-full items-start justify-between">
        <div className="flex items-center gap-4">
          {globalUser.spotifyUrl ? (
            <SpotifyImage globalUser={globalUser} />
          ) : (
            <ProfileImage globalUser={globalUser} />
          )}

          <ProfileDetails globalUser={globalUser} />
        </div>
      </div>
    </div>
  );
}

function Header({ setIsModalOpen }) {
  return (
    <div className="flex items-center justify-between border-b-1 border-white pb-4 align-middle">
      <p className="text-2xl text-white">Profile</p>
      <EditProfileButton setIsModalOpen={setIsModalOpen} />
    </div>
  );
}

function SpotifyImage({ globalUser }) {
  return (
    <Link
      to={globalUser.spotifyUrl}
      target="_blank"
      data-tooltip-id="profile-tooltip"
      data-tooltip-content="Open Spotify Profile"
    >
      <img
        src={globalUser.profileUrl}
        className="h-36 w-36 rounded-full object-cover"
      />
      <Tooltip id="profile-tooltip" place="top" type="dark" effect="float" />
    </Link>
  );
}

function ProfileImage({ globalUser }) {
  return (
    <img
      src={globalUser.profileUrl}
      className="h-36 w-36 rounded-full object-cover"
    />
  );
}

function ProfileDetails({ globalUser }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p className="text-xl font-bold">{globalUser.displayname}</p>
        <p className="text-gray-400">@{globalUser.username}</p>
      </div>

      <p>{globalUser.bio}</p>

      <div className="flex items-center gap-1 text-gray-400">
        <FontAwesomeIcon icon={faCalendar} className="text-sm" />
        <p>Joined on {formatDateMDYLong(globalUser.createdAt.toDate())}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <p className="text-gray-400">
            <span className="font-bold text-white">
              {globalUser.followers.length}
            </span>{" "}
            followers
          </p>
          <p className="text-gray-400">
            <span className="font-bold text-white">
              {globalUser.followers.length}
            </span>{" "}
            following
          </p>
        </div>
      </div>
    </div>
  );
}

function EditProfileButton({ setIsModalOpen }) {
  return (
    <button
      onClick={() => setIsModalOpen(true)}
      className="flex items-center gap-2 border-2 border-white px-3 py-1 text-lg hover:text-gray-400"
    >
      <FontAwesomeIcon icon={faPen} />
      <p>Edit</p>
    </button>
  );
}
