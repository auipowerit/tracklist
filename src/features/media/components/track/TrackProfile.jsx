import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import Tabs from "src/layouts/Tabs";
import MediaReviews from "../MediaReviews";
import "./track-profile.scss";

export default function TrackProfile() {
  const context = useOutletContext();
  const { track } = context;

  const [activeTab, setActiveTab] = useState("reviews");

  const tabs = [{ id: "reviews", label: "Reviews" }];

  return (
    <div className="track-profile">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <MediaReviews mediaId={track?.id} />
    </div>
  );
}
