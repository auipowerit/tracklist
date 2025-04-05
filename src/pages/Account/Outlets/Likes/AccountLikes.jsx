import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Tabs from "src/components/Tabs";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReviewContext } from "src/context/Review/ReviewContext";
import FeedReviewCard from "src/components/Cards/FeedReviewCard";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import MediaCard from "src/components/Cards/MediaCard";
import { useAuthContext } from "src/context/Auth/AuthContext";
import ListCard from "src/components/Cards/ListCard";

export default function AccountLikes() {
  const { globalData } = useOutletContext();
  const [activeTab, setActiveTab] = useState("artist");

  const tabs = [
    { id: "artist", label: "Artists" },
    { id: "album", label: "Albums" },
    { id: "track", label: "Songs" },
    { id: "review", label: "Reviews" },
    { id: "list", label: "Lists" },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex items-center justify-between border-b-1 border-white pb-4 align-middle">
        <p className="text-2xl text-white">Your Likes</p>
        <Link
          to="/search"
          className="flex cursor-pointer items-center gap-1 rounded-md border-2 border-white px-2 py-1 text-lg hover:text-gray-400"
        >
          <FontAwesomeIcon icon={faPlus} />
          <p>Find Posts</p>
        </Link>
      </div>

      <div>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex flex-col gap-4">
          {activeTab === "review" ? (
            <LikedReviews likes={globalData?.likes} />
          ) : activeTab === "list" ? (
            <LikedLists likes={globalData?.likes} />
          ) : (
            <LikedMedia likes={globalData?.likes} category={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
}

function LikedMedia({ likes, category }) {
  const { getMediaById } = useSpotifyContext();
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      const fetchedMedia = await Promise.all(
        likes
          .filter((like) => like.category === category)
          .map(async (like) => {
            const artist = await getMediaById(like.contentId, category);
            return artist;
          }),
      );

      setMedia(fetchedMedia);
    };

    fetchMedia();
  }, [likes, category]);

  return (
    <div>
      {media.map((m) => {
        return <MediaCard key={m.id} media={m} />;
      })}
    </div>
  );
}

function LikedReviews({ likes }) {
  const { getReviewById } = useReviewContext();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const fetchedReviews = await Promise.all(
        likes
          .filter((like) => like.category === "review")
          .map(async (like) => {
            const review = await getReviewById(like.contentId);
            return review;
          }),
      );

      setReviews(fetchedReviews);
    };

    fetchReviews();
  }, [likes]);

  return (
    <div>
      {reviews.map((review) => {
        return <FeedReviewCard key={review.id} review={review} />;
      })}
    </div>
  );
}

function LikedLists({ likes }) {
  const { globalData, getUserListById } = useAuthContext();
  const { defaultImg, getMediaById } = useSpotifyContext();

  const [lists, setLists] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedLists = await Promise.all(
        likes
          .filter((like) => like.category === "list")
          .map(async (like) => {
            const list = await getUserListById(like.contentId, globalData?.id);
            return list;
          }),
      );

      const fetchedImages = await Promise.all(
        fetchedLists.map(async (list) => {
          if (list.media.length === 0) return defaultImg;

          const fetchedMedia = await getMediaById(
            list.media[0].id,
            list.media[0].category,
          );

          return fetchedMedia.image || defaultImg;
        }),
      );

      setLists(fetchedLists);
      setImages(fetchedImages);
    };

    fetchData();
  }, [likes]);

  return (
    <div>
      {lists.map((list, index) => {
        return (
          <ListCard
            key={list.id}
            image={images[index] || defaultImg}
            {...list}
            length={list.media.length}
          />
        );
      })}
    </div>
  );
}
