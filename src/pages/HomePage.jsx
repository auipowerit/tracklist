import { useEffect, useState } from "react";
import Tabs from "src/layouts/Tabs";
import Loading from "src/features/shared/components/Loading";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import ReviewCard from "src/features/review/components/cards/ReviewCard";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import ReviewButton from "src/features/review/components/buttons/AddReviewButton";
import "./styles/home.scss";

export default function HomePage() {
  const { isLoadingUser, globalUser } = useAuthContext();
  const { reviews, getPopularReviews } = useReviewContext();

  const [popularReviews, setPopularReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("newest");

  useEffect(() => {
    const fetchReviews = async () => {
      if (isLoadingUser) return;

      const fetchedReviews = await getPopularReviews();
      setPopularReviews(fetchedReviews);
    };

    fetchReviews();
  }, [activeTab]);

  if (isLoadingUser || !reviews) {
    return <Loading />;
  }

  if (!globalUser) {
    return (
      <p className="empty-message">
        Login to your account to view the latest reviews from the friends you
        follow!
      </p>
    );
  }

  return (
    <div className="home-container">
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
    <div className="home-header">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <ReviewButton isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}

function FeedResults({ results }) {
  return (
    <div className="feed-container">
      {results.length > 0 ? (
        results.map((review) => {
          return <ReviewCard key={review.id} review={review} onPage={false} />;
        })
      ) : (
        <p className="empty-message"></p>
      )}
    </div>
  );
}
