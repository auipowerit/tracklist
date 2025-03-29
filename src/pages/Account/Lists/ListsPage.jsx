import { useEffect, useState } from "react";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import Loading from "../../../components/Loading";
import ListCard from "../../../components/Cards/ListCard";
import ListButton from "../../../components/Buttons/ListButton";
import { useSpotifyContext } from "../../../context/Spotify/SpotifyContext";

export default function ListsPage() {
  const defaultImg = "/images/default-img.jpg";

  const { globalUser, getUserLists, getUserListById } = useAuthContext();
  const { getMediaById } = useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

            const mediaImage =
              fetchedMedia.images?.[0]?.url ||
              fetchedMedia.album?.images?.[0]?.url ||
              defaultImg;

            return mediaImage;
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
    <div className="m-auto mt-6 flex h-full w-3/5 flex-col gap-4">
      <div className="flex items-center justify-between align-middle">
        <p className="text-2xl text-gray-400">Your Lists</p>
        <ListButton isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </div>
      <div className="overflow-y-scroll">
        {lists && (
          <ul className="flex w-full flex-col gap-4">
            {lists.map((list, index) => {
              return (
                <li key={list.id}>
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
    </div>
  );
}
