import { useEffect, useState } from "react";
import FeedResults from "./FeedResults";
import Tabs from "../../components/Tabs";
import { useReview } from "../../hooks/useReview";

export default function Feed({ reviews }) {
  const { getPopularReviews } = useReview();

  const [popReviews, setPopReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("newest");

  const tabs = [
    { id: "newest", label: "Newest", category: "newest" },
    { id: "popular", label: "For You", category: "popular" },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      const fetchedReviews = await getPopularReviews();
      setPopReviews(fetchedReviews);
    };
    return fetchReviews;
  }, [activeTab]);

  return (
    <div className="m-auto mt-6 flex h-full w-3/5 flex-col gap-4">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <FeedResults results={activeTab === "newest" ? reviews : popReviews} />
    </div>
  );
}
