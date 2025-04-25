import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Tabs from "src/layouts/Tabs";
import FriendsList from "./FriendsList";

export default function AccountFriends() {
  const { user } = useOutletContext();

  const [activeTab, setActiveTab] = useState("following");

  const tabs = [
    { id: "following", label: "Following" },
    { id: "followers", label: "Followers" },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Header />

      <div>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <FriendsList activeTab={activeTab} user={user} />
      </div>
    </div>
  );
}

function Header() {
  return (
    <p className="border-b-1 border-white pb-4 text-2xl text-white">Friends</p>
  );
}
