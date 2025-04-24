import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import Tabs from "src/layouts/Tabs";
import MediaReviews from "../MediaReviews";

export default function TrackProfile() {
  const context = useOutletContext();
  const { track } = context;

  const [activeTab, setActiveTab] = useState("reviews");

  const tabs = [{ id: "reviews", label: "Reviews" }];

  return (
    <div className="flex h-full w-4/6 flex-col items-center gap-6 py-6">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <MediaReviews mediaId={track?.id} />
    </div>
  );
}
