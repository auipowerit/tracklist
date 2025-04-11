import { useState } from "react";
import { Link } from "react-router-dom";
import Tabs from "src/components/Tabs";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LikedMedia from "./components/LikedMedia";
import LikedLists from "./components/LikedLists";
import LikedReviews from "./components/LikedReviews";
import { useAuthContext } from "src/context/Auth/AuthContext";

export default function AccountLikes() {
  const { globalUser } = useAuthContext();
  const [activeTab, setActiveTab] = useState("artist");

  const tabs = [
    { id: "artist", label: "Artists" },
    { id: "album", label: "Albums" },
    { id: "track", label: "Songs" },
    { id: "review", label: "Reviews" },
    { id: "list", label: "Lists" },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Header />

      <div>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <LikedContent activeTab={activeTab} globalUser={globalUser} />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between border-b-1 border-white pb-4 align-middle">
      <p className="text-2xl text-white">Likes</p>
      <Link
        to="/search"
        className="flex cursor-pointer items-center gap-1 rounded-md border-2 border-white px-2 py-1 text-lg hover:text-gray-400"
      >
        <FontAwesomeIcon icon={faPlus} />
        <p>Find Posts</p>
      </Link>
    </div>
  );
}

function LikedContent({ activeTab, globalUser }) {
  return (
    <div className="p-4">
      {activeTab === "review" ? (
        <LikedReviews globalUser={globalUser} />
      ) : activeTab === "list" ? (
        <LikedLists globalUser={globalUser} />
      ) : (
        <LikedMedia globalUser={globalUser} activeTab={activeTab} />
      )}
    </div>
  );
}
