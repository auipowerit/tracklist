import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { formatDateMDYLong } from "src/utils/date";
import Modal from "src/features/shared/components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faPen } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import FollowButton from "src/features/user/components/buttons/FollowButton";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import AccountForm from "../forms/AccountForm";
import "./account-profile.scss";

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

    const accessToken = await getAuthAccessToken(fetchedCode, false);
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
    <div className="account-page-outlet-container">
      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <AccountForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>

      <Header user={user} setIsModalOpen={setIsModalOpen} canEdit={canEdit} />

      <div className="account-page-outlet-content">
        {user.spotifyUrl ? (
          <SpotifyImage user={user} />
        ) : (
          <ProfileImage user={user} />
        )}

        <ProfileDetails user={user} />
      </div>
    </div>
  );
}

function Header({ user, setIsModalOpen, canEdit }) {
  return (
    <div className="account-page-header">
      <p>Profile</p>
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
      <img src={user.profileUrl} className="account-profile-img" />
      <Tooltip id="profile-tooltip" place="top" type="dark" effect="float" />
    </Link>
  );
}

function ProfileImage({ user }) {
  return <img src={user.profileUrl} className="account-profile-img" />;
}

function ProfileDetails({ user }) {
  return (
    <div className="account-profile-details">
      <div className="account-profile-user">
        <p className="account-profile-displayname">{user.displayname}</p>
        <p className="account-profile-username">@{user.username}</p>
      </div>

      <p className="account-profile-bio">{user.bio}</p>

      <div className="account-profile-date">
        <FontAwesomeIcon icon={faCalendar} />
        <p>Joined on {formatDateMDYLong(user.createdAt.toDate())}</p>
      </div>

      <div className="account-profile-friends">
        <Link to={`/users/${user.username}/friends`}>
          <span>{user.followers.length}</span> followers
        </Link>
        <Link to={`/users/${user.username}/friends`}>
          <span>{user.followers.length}</span> following
        </Link>
      </div>
    </div>
  );
}

function EditProfileButton({ setIsModalOpen }) {
  return (
    <button
      onClick={() => setIsModalOpen(true)}
      className="account-page-edit-btn"
    >
      <FontAwesomeIcon icon={faPen} />
      <p>Edit</p>
    </button>
  );
}
