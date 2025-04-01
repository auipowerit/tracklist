import { useEffect, useState } from "react";
import Loading from "src/components/Loading";
import ListCard from "src/components/Cards/ListCard";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function ListList() {
  const { globalUser, getUserLists } = useAuthContext();
  const { defaultImg, getMediaById } = useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [lists, setLists] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      if (!globalUser) return;

      setIsLoading(true);

      try {
        const fetchedLists = await getUserLists(globalUser.uid);
        setLists(fetchedLists);

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

        setImages(fetchedImages);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, [globalUser]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="overflow-y-scroll">
      {lists && (
        <ul className="flex w-full flex-col gap-4">
          {lists.map((list, index) => {
            return (
              <li key={list.id} className="border-t-1 border-white">
                <ListCard
                  id={list.id}
                  image={images[index] || defaultImg}
                  name={list.name}
                  length={list.media.length}
                  description={list.description}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
