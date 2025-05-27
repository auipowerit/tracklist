import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatDateMDYLong } from "src/utils/date";
import Modal from "src/features/shared/components/modal/Modal";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AccountForm from "../forms/AccountForm";
import ChatButton from "../buttons/ChatButton";
import LogoutButton from "../buttons/LogoutButton";
import FollowButton from "../buttons/FollowButton";
import EditProfileButton from "../buttons/EditProfileButton";
import "./account-nav.scss";

export default function AccountMobileNav({ user, setUser, canEdit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("lock-scroll");
    }
  }, [isModalOpen]);

  return (
    <nav className="account-mobile-nav">
      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <AccountForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>

      <div className="account-mobile-nav__header">
        <LeftButton
          user={user}
          setUser={setUser}
          canEdit={canEdit}
          setIsModalOpen={setIsModalOpen}
        />

        <div className="account-mobile-nav__profile">
          <UserData user={user} canEdit={canEdit} />
          <FriendsData user={user} />
        </div>

        <RightButton user={user} canEdit={canEdit} />
      </div>

      <NavLinks username={user.username} />
    </nav>
  );
}

function LeftButton({ user, setUser, canEdit, setIsModalOpen }) {
  return (
    <div className="account-mobile-nav__header--left-button">
      {canEdit ? (
        <EditProfileButton setIsModalOpen={setIsModalOpen} showIcon={true} />
      ) : (
        <FollowButton user={user} setUser={setUser} />
      )}
    </div>
  );
}

function RightButton({ user, canEdit }) {
  return (
    <div className="account-mobile-nav__header--right-button">
      {canEdit ? <LogoutButton /> : <ChatButton username={user.username} />}
    </div>
  );
}

function UserData({ user }) {
  return (
    <>
      <img
        src={user.profileUrl}
        className="account-mobile-nav__image"
        alt="user profile"
      />
      <div className="account-mobile-nav__user">
        <p className="account-mobile-nav__displayname">{user.displayname}</p>
        <p className="account-mobile-nav__username">@{user.username}</p>
      </div>

      <p className="account-mobile-nav__bio">{user.bio}</p>
      <div className="account-mobile-nav__date">
        <FontAwesomeIcon icon={faCalendar} />
        <p>Joined on {formatDateMDYLong(user.createdAt.toDate())}</p>
      </div>
    </>
  );
}

function FriendsData({ user }) {
  return (
    <div className="account-mobile-nav__friends">
      <Link
        to={`/users/${user.username}/friends`}
        className="account-mobile-nav__friend"
      >
        <span className="account-mobile-nav__count">
          {user.followers.length}
        </span>{" "}
        followers
      </Link>
      <Link
        to={`/users/${user.username}/friends`}
        className="account-mobile-nav__friend"
      >
        <span className="account-mobile-nav__count">
          {user.following.length}
        </span>{" "}
        following
      </Link>
    </div>
  );
}

function NavLinks({ username }) {
  const children = [
    { id: "reviews", title: "Reviews" },
    { id: "lists", title: "Lists" },
    { id: "likes", title: "Likes" },
    { id: "friends", title: "Friends" },
  ];

  const location = useLocation();

  const isActive = (page) => {
    return location.pathname.startsWith(`/users/${username}/${page}`);
  };

  return (
    <div className="account-mobile-nav__links">
      {children.map((child) => (
        <Link
          key={child.id}
          to={`/users/${username}/${child.id}`}
          className="account-mobile-nav__link"
          aria-selected={isActive(child.id) ? "true" : "false"}
        >
          {child.title}
        </Link>
      ))}
    </div>
  );
}
