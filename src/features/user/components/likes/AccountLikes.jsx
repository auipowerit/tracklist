import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Tabs from "src/features/shared/components/buttons/Tabs";
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
    <section className="account__section account-likes">
      <Header />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "review" ? (
        <LikedReviews user={user} />
      ) : (
        <LikedMedia user={user} activeTab={activeTab} />
      )}
    </section>
  );
}

function Header() {
  return (
    <div className="account__header">
      <h2 className="account__title">Likes</h2>
    </div>
  );
}
