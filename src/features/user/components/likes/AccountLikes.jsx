import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Tabs from "src/layouts/buttons/Tabs";
import LikedMedia from "./LikedMedia";
import LikedReviews from "./LikedReviews";
import "./account-likes.scss";

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
    <div className="account-page-outlet-container">
      <Header />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <LikedContent activeTab={activeTab} user={user} />
    </div>
  );
}

function Header() {
  return (
    <div className="account-page-header">
      <p>Likes</p>
    </div>
  );
}

function LikedContent({ activeTab, user }) {
  return (
    <div>
      {activeTab === "review" ? (
        <LikedReviews user={user} />
      ) : (
        <LikedMedia user={user} activeTab={activeTab} />
      )}
    </div>
  );
}
