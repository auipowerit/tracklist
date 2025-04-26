import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListItemCard from "src/features/list/components/cards/ListItemCard";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";

export default function LikedMedia({ user, activeTab }) {
  const { getMediaById, getMediaLinks } = useSpotifyContext();
  const [media, setMedia] = useState(null);

  useEffect(() => {
    setMedia(null);

    const fetchMedia = async () => {
      const fetchedMedia = await Promise.all(
        user?.likes
          .filter((like) => like.category === activeTab)
          .flatMap((like) => like.content)
          .map(async (id) => {
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
    };

    fetchMedia();
  }, [user, activeTab]);

  return (
    <div>
      {media &&
        (media.length > 0 ? (
          <div className="account-likes-media">
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
        ) : (
          <p className="empty-message">
            {`There are no liked ${activeTab}s yet!`}
          </p>
        ))}
    </div>
  );
}
