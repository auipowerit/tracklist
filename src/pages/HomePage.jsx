import { useEffect, useState } from "react";
import Tabs from "src/layouts/buttons/Tabs";
import Loading from "src/features/shared/components/Loading";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import ReviewCard from "src/features/review/components/cards/ReviewCard";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import ReviewButton from "src/features/review/components/buttons/AddReviewButton";
import "./styles/home.scss";

export default function HomePage() {
  const { loadingUser, globalUser } = useAuthContext();
  const { reviews, getPopularReviews } = useReviewContext();

  const [popularReviews, setPopularReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("newest");

  useEffect(() => {
    const fetchReviews = async () => {
      if (loadingUser) return;

      !globalUser && setActiveTab("popular");

      const fetchedReviews = await getPopularReviews();
      setPopularReviews(fetchedReviews);
    };

    fetchReviews();
  }, [activeTab, loadingUser]);

  if (loadingUser || (globalUser && !reviews)) {
    return <Loading />;
  }

  return (
    <div className="home">
      {globalUser && (
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      <FeedResults
        results={activeTab === "newest" ? reviews || [] : popularReviews}
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

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("lock-scroll");
    }
  }, [isModalOpen]);

  return (
    <div className="home__header">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <ReviewButton isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}

function FeedResults({ results }) {
  if (results.length === 0) {
    return <p className="empty__message">No reviews found!</p>;
  }

  return (
    <div className="home__feed">
      {results.length > 0 ? (
        results.map((review) => {
          return <ReviewCard key={review.id} review={review} onPage={false} />;
        })
      ) : (
        <p className="empty__message"></p>
      )}
    </div>
  );
}
