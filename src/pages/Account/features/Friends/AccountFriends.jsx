import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Tabs from "src/components/Tabs";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FriendsList from "./components/FriendsList";

export default function AccountFriends() {
  const { user, canEdit } = useOutletContext();

  const [activeTab, setActiveTab] = useState("following");

  const tabs = [
    { id: "following", label: "Following" },
    { id: "followers", label: "Followers" },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Header canEdit={canEdit} />

      <div>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <FriendsList activeTab={activeTab} user={user} />
      </div>
    </div>
  );
}

function Header({ canEdit }) {
  return (
    <div className="flex items-center justify-between border-b-1 border-white pb-4 align-middle">
      <p className="text-2xl text-white">Friends</p>
      {canEdit && (
        <Link
          to="/search"
          className="flex cursor-pointer items-center gap-1 rounded-md border-2 border-white px-2 py-1 text-lg hover:text-gray-400"
        >
          <FontAwesomeIcon icon={faSearch} />
          <p>Find more friends</p>
        </Link>
      )}
    </div>
  );
}
