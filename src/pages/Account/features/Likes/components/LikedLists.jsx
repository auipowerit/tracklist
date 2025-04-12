import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListCard from "src/components/Cards/ListCard";
import { useListContext } from "src/context/List/ListContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function LikedLists({ user }) {
  const { getListById } = useListContext();
  const { DEFAULT_IMG, getMediaById } = useSpotifyContext();

  const [lists, setLists] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedLists = await Promise.all(
        user?.likes
          .filter((like) => like.category === "list")
          .flatMap((like) => like.content)
          .map(async (id) => {
            const list = await getListById(id, user?.uid);
            return list;
          }),
      ).then((values) => values.filter(Boolean));

      if (!fetchedLists || fetchedLists.every((list) => list === null)) {
        setLists([]);
        setImages([]);
        return;
      }

      const fetchedImages = await Promise.all(
        fetchedLists.map(async (list) => {
          if (list.media.length === 0) return DEFAULT_IMG;

          const fetchedMedia = await getMediaById(
            list.media[0].id,
            list.media[0].category,
          );

          return fetchedMedia.image || DEFAULT_IMG;
        }),
      );

      setLists(fetchedLists);
      setImages(fetchedImages);
    };

    fetchData();
  }, [user]);

  return (
    <div className="w-full">
      {lists &&
        (lists.length > 0 ? (
          lists.map((list, index) => {
            return (
              <Link
                to={`/users/${user.username}/lists/${list.id}`}
                key={list.id}
              >
                <ListCard
                  image={images[index] || DEFAULT_IMG}
                  {...list}
                  length={list.media.length}
                />
              </Link>
            );
          })
        ) : (
          <p className="m-auto my-20 text-center text-2xl text-gray-300 italic">
            There are no liked lists yet!
          </p>
        ))}
    </div>
  );
}
