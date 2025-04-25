import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Tabs from "src/layouts/Tabs";
import LikedMedia from "./LikedMedia";
import LikedReviews from "./LikedReviews";

export default function AccountLikes() {
  const { user } = useOutletContext();
  const [activeTab, setActiveTab] = useState("artist");

  const tabs = [
    { id: "artist", label: "Artists" },
    { id: "album", label: "Albums" },
    { id: "track", label: "Tracks" },
    { id: "review", label: "Reviews" },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Header />

      <div>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <LikedContent activeTab={activeTab} user={user} />
      </div>
    </div>
  );
}

function Header() {
  return (
    <p className="border-b-1 border-white pb-4 text-2xl text-white">Likes</p>
  );
}

function LikedContent({ activeTab, user }) {
  return (
    <div className="p-4">
      {activeTab === "review" ? (
        <LikedReviews user={user} />
      ) : (
        <LikedMedia user={user} activeTab={activeTab} />
      )}
    </div>
  );
}
