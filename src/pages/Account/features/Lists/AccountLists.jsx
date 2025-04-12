import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Loading from "src/components/Loading";
import ListCard from "src/components/Cards/ListCard";
import ListButton from "src/components/Buttons/ListButton";
import { useListContext } from "src/context/List/ListContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function AccountLists() {
  const { user, canEdit } = useOutletContext();

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Header canEdit={canEdit} />
      <Lists user={user} />
    </div>
  );
}

function Header({ canEdit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-b-1 border-white pb-4 align-middle">
      <p className="text-2xl text-white">Lists</p>
      {canEdit && (
        <ListButton isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
}

function Lists({ user }) {
  const { getListsByUserId } = useListContext();
  const { DEFAULT_IMG, getMediaById } = useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [lists, setLists] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      setIsLoading(true);

      try {
        const fetchedLists = await getListsByUserId(user.uid);
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
  }, [user]);

  async function getImages(lists) {
    const fetchedImages = await Promise.all(
      lists.map(async (list) => {
        if (list.media.length === 0) return DEFAULT_IMG;

        const fetchedMedia = await getMediaById(
          list.media[0].id,
          list.media[0].category,
        );

        return fetchedMedia.image || DEFAULT_IMG;
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
                <ListItem item={list} image={images[index] || DEFAULT_IMG} />
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="m-20 text-center text-2xl text-gray-300 italic">
          There are no lists yet!
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
