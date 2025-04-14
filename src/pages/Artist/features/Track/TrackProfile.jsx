import { useOutletContext } from "react-router-dom";
import MediaBanner from "../../compontents/MediaBanner";
import { useState } from "react";
import Tabs from "src/components/Tabs";
import MediaReviews from "../../compontents/MediaReviews";

export default function TrackProfile() {
  const context = useOutletContext();
  const { track } = context;

  const [activeTab, setActiveTab] = useState("reviews");

  const tabs = [{ id: "reviews", label: "Reviews" }];

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-8">
      <MediaBanner media={track} category={"track"} />

      <div className="mt-6 flex h-full w-full justify-center bg-black/50">
        <div className="flex h-full w-4/6 flex-col items-center gap-6 py-6">
          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          <MediaReviews mediaId={track?.id} />
        </div>
      </div>
    </div>
  );
}
