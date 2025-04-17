import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Modal from "src/components/Modal";
import { formatDateMDYLong } from "src/utils/date";
import { useAuthContext } from "src/context/Auth/AuthContext";
import FollowButton from "src/components/Buttons/FollowButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faPen } from "@fortawesome/free-solid-svg-icons";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import AccountForm from "./components/AccountForm";

export default function AccountProfile() {
  const { user, canEdit } = useOutletContext();

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
      localStorage.removeItem("profile");
      navigate("/profile");
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

    window.location.reload();
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <AccountForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>

      <Header user={user} setIsModalOpen={setIsModalOpen} canEdit={canEdit} />

      <div className="flex w-full items-start justify-between">
        <div className="flex items-center gap-4">
          {user.spotifyUrl ? (
            <SpotifyImage user={user} />
          ) : (
            <ProfileImage user={user} />
          )}

          <ProfileDetails user={user} />
        </div>
      </div>
    </div>
  );
}

function Header({ user, setIsModalOpen, canEdit }) {
  return (
    <div className="flex items-center justify-between border-b-1 border-white pb-4 align-middle">
      <p className="text-2xl text-white">Profile</p>
      {canEdit ? (
        <EditProfileButton setIsModalOpen={setIsModalOpen} />
      ) : (
        <FollowButton user={user} />
      )}
    </div>
  );
}

function SpotifyImage({ user }) {
  return (
    <Link
      to={user.spotifyUrl}
      target="_blank"
      data-tooltip-id="profile-tooltip"
      data-tooltip-content="Open Spotify Profile"
    >
      <img
        src={user.profileUrl}
        className="h-36 w-36 rounded-full object-cover"
      />
      <Tooltip id="profile-tooltip" place="top" type="dark" effect="float" />
    </Link>
  );
}

function ProfileImage({ user }) {
  return (
    <img
      src={user.profileUrl}
      className="h-36 w-36 rounded-full object-cover"
    />
  );
}

function ProfileDetails({ user }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p className="text-xl font-bold">{user.displayname}</p>
        <p className="text-gray-400">@{user.username}</p>
      </div>

      <p>{user.bio}</p>

      <div className="flex items-center gap-1 text-gray-400">
        <FontAwesomeIcon icon={faCalendar} className="text-sm" />
        <p>Joined on {formatDateMDYLong(user.createdAt.toDate())}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <p className="text-gray-400">
            <span className="font-bold text-white">
              {user.followers.length}
            </span>{" "}
            followers
          </p>
          <p className="text-gray-400">
            <span className="font-bold text-white">
              {user.followers.length}
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
