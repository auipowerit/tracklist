import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Tabs from "src/components/Tabs";
import ListCard from "src/components/Cards/ListCard";
import MediaCard from "src/components/Cards/MediaCard";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FeedReviewCard from "src/components/Cards/FeedReviewCard";
import { useReviewContext } from "src/context/Review/ReviewContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import MediaListCard from "src/components/Cards/MediaListCard";

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

        <div className="p-4">
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
  const { getMediaById, getMediaLinks } = useSpotifyContext();
  const [media, setMedia] = useState(null);

  useEffect(() => {
    setMedia(null);

    const fetchMedia = async () => {
      const fetchedMedia = await Promise.all(
        likes
          .filter((like) => like.category === category)
          .flatMap((like) => like.content)
          .map(async (id) => {
            const media = await getMediaById(id, category);
            const data = getMediaLinks(media);
            return {
              ...media,
              ...data,
            };
          }),
      );

      setMedia(fetchedMedia);
    };

    fetchMedia();
  }, [likes, category]);

  return (
    <div className="grid w-fit grid-cols-4 gap-4">
      {media &&
        (media.length > 0 ? (
          media.map((entry) => {
            return (
              <Link key={entry.id} to={entry.titleLink} className="w-fit">
                <MediaListCard
                  title={entry.title}
                  subtitle={entry.subtitle}
                  image={entry.image}
                />
              </Link>
            );
          })
        ) : (
          <p className="m-20 text-center text-2xl text-gray-300 italic">
            {`You don't have any liked ${category}s yet.`}
          </p>
        ))}
    </div>
  );
}

function LikedReviews({ likes }) {
  const { getReviewById } = useReviewContext();
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const fetchedReviews = await Promise.all(
        likes
          .filter((like) => like.category === "review")
          .flatMap((like) => like.content)
          .map(async (id) => {
            const review = await getReviewById(id);
            return review;
          }),
      );

      setReviews(fetchedReviews);
    };

    fetchReviews();
  }, [likes]);

  return (
    <div>
      {reviews &&
        (reviews.length > 0 ? (
          reviews.map((review) => {
            return <FeedReviewCard key={review.id} review={review} />;
          })
        ) : (
          <p className="m-20 text-center text-2xl text-gray-300 italic">
            You don't have any liked reviews yet.
          </p>
        ))}
    </div>
  );
}

function LikedLists({ likes }) {
  const { globalData, getUserListById } = useAuthContext();
  const { defaultImg, getMediaById } = useSpotifyContext();

  const [lists, setLists] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedLists = await Promise.all(
        likes
          .filter((like) => like.category === "list")
          .flatMap((like) => like.content)
          .map(async (id) => {
            const list = await getUserListById(id, globalData?.id);
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
      {lists &&
        (lists.length > 0 ? (
          lists.map((list, index) => {
            return (
              <Link to={`/account/lists/${list.id}`} key={list.id}>
                <ListCard
                  image={images[index] || defaultImg}
                  {...list}
                  length={list.media.length}
                />
              </Link>
            );
          })
        ) : (
          <p className="m-20 text-center text-2xl text-gray-300 italic">
            You don't have any liked lists yet.
          </p>
        ))}
    </div>
  );
}
