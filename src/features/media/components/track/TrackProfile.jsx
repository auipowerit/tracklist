import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Tabs from "src/layouts/buttons/Tabs";
import MediaReviews from "../MediaReviews";
import "./track-profile.scss";

export default function TrackProfile() {
  const context = useOutletContext();
  const { track, activeTab, setActiveTab, filter, setFilter } = context;

  const tabs = [{ id: "reviews", label: "Reviews" }];

  useEffect(() => {
    setActiveTab("reviews");
  }, []);

  return (
    <div className="track-profile">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <MediaReviews mediaId={track?.id} filter={filter} setFilter={setFilter} />
    </div>
  );
}
