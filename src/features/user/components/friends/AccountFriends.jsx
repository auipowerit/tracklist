import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Tabs from "src/layouts/Tabs";
import FriendsList from "./FriendsList";
import "./account-friends.scss";

export default function AccountFriends() {
  const { user } = useOutletContext();

  const [activeTab, setActiveTab] = useState("following");

  const tabs = [
    { id: "following", label: "Following" },
    { id: "followers", label: "Followers" },
  ];

  return (
    <div className="account-page-outlet-container">
      <Header />

      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <FriendsList activeTab={activeTab} user={user} />
    </div>
  );
}

function Header() {
  return (
    <div className="account-page-header">
      <p>Friends</p>
    </div>
  );
}
