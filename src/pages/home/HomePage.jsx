import { useEffect, useState } from "react";
import Tabs from "src/features/shared/components/buttons/Tabs";
import Loading from "src/features/shared/components/Loading";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import ReviewCard from "src/features/review/components/cards/ReviewCard";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import MobileBanner from "src/features/shared/components/banner/MobileBanner";
import AddReviewButton from "src/features/review/components/buttons/AddReviewButton";
import "./home.scss";

export default function HomePage() {
  const { loadingUser, globalUser } = useAuthContext();
  const { reviews, getPopularReviews } = useReviewContext();

  const [popularReviews, setPopularReviews] = useState(null);
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

  // Set loading for fetching user, then for reviews (popular if not logged in)
  if (loadingUser || (globalUser ? !reviews : !popularReviews)) {
    return <Loading />;
  }

  return (
    <section className="home">
      <MobileBanner title={"TrackList"} />

      {globalUser && (
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <FeedResults
        results={activeTab === "newest" ? reviews || [] : popularReviews}
      />
    </section>
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

      <AddReviewButton
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
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
