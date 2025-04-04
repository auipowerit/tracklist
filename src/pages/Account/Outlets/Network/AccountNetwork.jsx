import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Tabs from "src/components/Tabs";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NetworkList from "./NetworkList";

export default function AccountNetwork() {
  const { globalUser } = useOutletContext();
  const [activeTab, setActiveTab] = useState("following");

  const tabs = [
    { id: "following", label: "Following" },
    { id: "followers", label: "Followers" },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex items-center justify-between border-b-1 border-white pb-4 align-middle">
        <p className="text-2xl text-white">Your Network</p>
        <Link
          to="/search"
          className="flex cursor-pointer items-center gap-1 rounded-md border-2 border-white px-2 py-1 text-lg hover:text-gray-400"
        >
          <FontAwesomeIcon icon={faPlus} />
          <p>Follow More Friends</p>
        </Link>
      </div>

      <div>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <NetworkList userId={globalUser?.uid} category={activeTab} />
      </div>
    </div>
  );
}
