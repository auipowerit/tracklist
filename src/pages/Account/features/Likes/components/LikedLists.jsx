import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListCard from "src/components/Cards/ListCard";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useListContext } from "src/context/List/ListContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function LikedLists({ globalUser }) {
  const { getListById } = useListContext();
  const { defaultImg, getMediaById } = useSpotifyContext();

  const [lists, setLists] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedLists = await Promise.all(
        globalUser?.likes
          .filter((like) => like.category === "list")
          .flatMap((like) => like.content)
          .map(async (id) => {
            const list = await getListById(id, globalUser?.uid);
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
  }, [globalUser]);

  return (
    <div className="w-full">
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
          <p className="m-auto my-20 text-center text-2xl text-gray-300 italic">
            You don't have any liked lists yet.
          </p>
        ))}
    </div>
  );
}
