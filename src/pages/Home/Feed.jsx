import { useEffect, useState } from "react";
import FeedResults from "./FeedResults";
import Tabs from "src/components/Tabs";
import { useReview } from "src/hooks/useReview";
import PostButton from "src/components/Buttons/PostButton";

export default function Feed({ reviews }) {
  const { getPopularReviews } = useReview();

  const [popReviews, setPopReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = [
    { id: "newest", label: "Newest", category: "newest" },
    { id: "popular", label: "For You", category: "popular" },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      const fetchedReviews = await getPopularReviews();
      setPopReviews(fetchedReviews);
    };

    fetchReviews();
  }, [activeTab]);

  return (
    <div className="m-auto mt-6 flex w-3/5 flex-col gap-4">
      <div className="flex items-center justify-center">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="ml-auto">
          <PostButton
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      </div>

      <FeedResults results={activeTab === "newest" ? reviews : popReviews} />
    </div>
  );
}
