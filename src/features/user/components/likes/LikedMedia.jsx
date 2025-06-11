import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import ListItemCard from "src/features/list/components/cards/ListItemCard";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";

export default function LikedMedia({ user, activeTab }) {
  const { getUserLikes } = useAuthContext();
  const { getMediaById, getMediaLinks } = useSpotifyContext();
  const [media, setMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setMedia(null);

    const fetchMedia = async () => {
      if (!user) {
        setMedia([]);
        setIsLoading(false);
        return;
      }

      const userLikes = await getUserLikes(user?.uid);
      if (!userLikes || userLikes[activeTab].length === 0) {
        setMedia([]);
        setIsLoading(false);
        return;
      }

      const fetchedMedia = await Promise.all(
        userLikes[activeTab].map(async (id) => {
          const media = await getMediaById(id, activeTab);
          if (!media) return null;
          const data = getMediaLinks(media);
          return {
            ...media,
            ...data,
          };
        }),
      ).then((values) => values.filter(Boolean));

      const sortedMedia = fetchedMedia
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));

      setMedia(sortedMedia);
      setIsLoading(false);
    };

    fetchMedia();

    return () => {
      setMedia(null);
    };
  }, [user, activeTab]);

  if (isLoading) {
    return;
  }

  if (!media || media.length === 0) {
    return (
      <p className="empty__message">
        {`There are no liked ${activeTab}s yet!`}
      </p>
    );
  }

  return (
    <div className="account-likes__media">
      {media.map((entry) => {
        return (
          <Link key={entry.id} to={entry.titleLink}>
            <ListItemCard
              title={entry.title}
              subtitle={entry.subtitle}
              image={entry.image}
            />
          </Link>
        );
      })}
    </div>
  );
}
