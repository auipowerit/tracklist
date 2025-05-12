import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { MOBILE_WIDTH } from "src/data/const";
import { formatDateMDYLong } from "src/utils/date";
import Modal from "src/features/shared/components/modal/Modal";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import FollowButton from "src/features/user/components/buttons/FollowButton";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import AccountForm from "../forms/AccountForm";
import EditProfileButton from "../buttons/EditProfileButton";
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
    // Redirect to reviews if the user is on mobile
    if (window.innerWidth <= MOBILE_WIDTH) {
      navigate(`/users/${user.username}/reviews`);
      return;
    }

    const fetchData = async () => {
      handleNavigate();

      const profile = await handleProfile();
      if (profile) {
        await handleUpdate(profile);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("lock-scroll");
    }
  }, [isModalOpen]);

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
    <div className="account__section">
      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <AccountForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>

      <Header user={user} setIsModalOpen={setIsModalOpen} canEdit={canEdit} />

      <div className="account-profile">
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
    <div className="account__header">
      <h2 className="account__title">Profile</h2>
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
      <img src={user.profileUrl} className="account-profile__image" />
      <Tooltip id="profile-tooltip" place="top" type="dark" effect="float" />
    </Link>
  );
}

function ProfileImage({ user }) {
  return <img src={user.profileUrl} className="account-profile__image" />;
}

function ProfileDetails({ user }) {
  return (
    <div className="account-profile__details">
      <div className="account-profile__user">
        <p className="account-profile__displayname">{user.displayname}</p>
        <p className="account-profile__username">@{user.username}</p>
      </div>

      <p className="account-profile__bio">{user.bio}</p>

      <div className="account-profile__date">
        <FontAwesomeIcon icon={faCalendar} />
        <p>Joined on {formatDateMDYLong(user.createdAt.toDate())}</p>
      </div>

      <div className="account-profile__friends">
        <Link
          to={`/users/${user.username}/friends`}
          className="account-profile__link"
        >
          <span className="account-profile__count">
            {user.followers.length}
          </span>{" "}
          followers
        </Link>
        <Link
          to={`/users/${user.username}/friends`}
          className="account-profile__link"
        >
          <span className="account-profile__count">
            {user.followers.length}
          </span>{" "}
          following
        </Link>
      </div>
    </div>
  );
}
