import { useEffect, useState } from "react";
import Tabs from "src/components/Tabs";
import Loading from "src/components/Loading";
import ReviewButton from "src/components/Buttons/ReviewButton";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useReviewContext } from "src/context/Review/ReviewContext";
import FeedResults from "./components/FeedResults";

export default function HomePage() {
  const { globalUser } = useAuthContext();
  const { reviews, getPopularReviews } = useReviewContext();

  const [popularReviews, setPopularReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("newest");

  useEffect(() => {
    const fetchReviews = async () => {
      const fetchedReviews = await getPopularReviews();
      setPopularReviews(fetchedReviews);
    };

    fetchReviews();
  }, [activeTab]);

  if (!globalUser) {
    return (
      <div className="m-auto w-1/3 py-20">
        <p className="text-center text-2xl">
          Login to your account to view the latest reviews from the friends you
          follow!
        </p>
      </div>
    );
  }

  if (!reviews) {
    return <Loading />;
  }

  return (
    <div className="m-auto mt-6 flex h-screen w-3/5 flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <FeedResults
        results={activeTab === "newest" ? reviews : popularReviews}
      />
    </div>
  );
}

function Header({ activeTab, setActiveTab }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = [
    { id: "newest", label: "Newest", category: "newest" },
    { id: "popular", label: "For You", category: "popular" },
  ];

  return (
    <div className="flex items-center justify-center border-b-1 border-white pb-4">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="ml-auto">
        <ReviewButton
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
}
