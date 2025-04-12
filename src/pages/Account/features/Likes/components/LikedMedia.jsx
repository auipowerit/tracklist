import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MediaListCard from "src/components/Cards/MediaListCard";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

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

      setMedia(fetchedMedia);
    };

    fetchMedia();
  }, [user, activeTab]);

  return (
    <div>
      {media &&
        (media.length > 0 ? (
          <div className="m-auto grid w-fit grid-cols-4 gap-6">
            {media.map((entry) => {
              return (
                <Link key={entry.id} to={entry.titleLink} className="w-fit">
                  <MediaListCard
                    title={entry.title}
                    subtitle={entry.subtitle}
                    image={entry.image}
                  />
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="m-20 text-center text-2xl text-gray-300 italic">
            {`There are no liked ${activeTab}s yet!`}
          </p>
        ))}
    </div>
  );
}
