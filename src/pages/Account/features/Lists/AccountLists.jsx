import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "src/components/Loading";
import ListCard from "src/components/Cards/ListCard";
import ListButton from "src/components/Buttons/ListButton";
import { useListContext } from "src/context/List/ListContext";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function AccountLists() {
  const { globalUser } = useAuthContext();

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Header />
      <Lists globalUser={globalUser} />
    </div>
  );
}

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-b-1 border-white pb-4 align-middle">
      <p className="text-2xl text-white">Lists</p>
      <ListButton isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}

function Lists({ globalUser }) {
  const { getListsByUserId } = useListContext();
  const { defaultImg, getMediaById } = useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [lists, setLists] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      if (!globalUser) return;

      setIsLoading(true);

      try {
        const fetchedLists = await getListsByUserId(globalUser.uid);
        setLists(fetchedLists);

        const fetchedImages = await getImages(fetchedLists);
        setImages(fetchedImages);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, [globalUser]);

  async function getImages(lists) {
    const fetchedImages = await Promise.all(
      lists.map(async (list) => {
        if (list.media.length === 0) return defaultImg;

        const fetchedMedia = await getMediaById(
          list.media[0].id,
          list.media[0].category,
        );

        return fetchedMedia.image || defaultImg;
      }),
    );

    return fetchedImages;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="overflow-y-scroll">
      {lists && lists.length > 0 ? (
        <ul className="flex w-full flex-col gap-4">
          {lists.map((list, index) => {
            return (
              <li key={list.id}>
                <ListItem item={list} image={images[index] || defaultImg} />
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
  );
}

function ListItem({ item, image }) {
  return (
    <Link to={`${item.id}`}>
      <ListCard
        id={item.id}
        image={image}
        name={item.name}
        length={item.media.length}
        description={item.description}
      />
    </Link>
  );
}
