import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Loading from "src/components/Loading";
import ListCard from "src/components/Cards/ListCard";
import ListButton from "src/components/Buttons/ListButton";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import { useListContext } from "src/context/List/ListContext";

export default function AccountLists() {
  const { globalUser } = useOutletContext();

  const { getListsByUserId } = useListContext();
  const { defaultImg, getMediaById } = useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lists, setLists] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      if (!globalUser) return;

      setIsLoading(true);

      try {
        const fetchedLists = await getListsByUserId(globalUser.uid);
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

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex items-center justify-between border-b-1 border-white pb-4 align-middle">
        <p className="text-2xl text-white">Your Lists</p>
        <ListButton isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </div>

      <div className="overflow-y-scroll">
        {isLoading && <Loading />}

        {lists && lists.length > 0 ? (
          <ul className="flex w-full flex-col gap-4">
            {lists.map((list, index) => {
              return (
                <li key={list.id}>
                  <Link to={`${list.id}`}>
                    <ListCard
                      id={list.id}
                      image={images[index] || defaultImg}
                      name={list.name}
                      length={list.media.length}
                      description={list.description}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="m-20 text-center text-2xl text-gray-300 italic">
            You don't have any lists yet.
          </p>
        )}
      </div>
    </div>
  );
}
