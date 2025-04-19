import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Tabs from "src/components/Tabs";
import Loading from "src/components/Loading";
import ListCard from "src/components/Cards/ListCard";
import ListButton from "src/components/Buttons/ListButton";
import { useListContext } from "src/context/List/ListContext";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function AccountLists() {
  const { user, canEdit } = useOutletContext();

  const [activeTab, setActiveTab] = useState("created");

  const tabs = [
    { id: "created", label: "Created" },
    { id: "saved", label: "Saved" },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Header canEdit={canEdit} />

      <div>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <Lists user={user} activeTab={activeTab} />
      </div>
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

function Lists({ user, activeTab }) {
  const { globalUser } = useAuthContext();
  const { getListsByUserId, getSavedListsByUserId } = useListContext();
  const { DEFAULT_IMG, getMediaById } = useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [lists, setLists] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      setIsLoading(true);

      try {
        let fetchedLists =
          activeTab === "created"
            ? await getListsByUserId(user.uid)
            : await getSavedListsByUserId(user.uid);

        if (!fetchedLists) return;

        // Filter out private lists if logged in user is not the owner
        if (user.uid !== globalUser.uid) {
          fetchedLists = fetchedLists.filter(
            (list) => list.isPrivate === false,
          );
        }

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
  }, [user, activeTab]);

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
    <div className="overflow-y-scroll pt-6">
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
  const { user } = useOutletContext();
  const { getUserById } = useAuthContext();

  const [link, setLink] = useState(item.id);
  const [listUser, setListUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (item.userId !== user.uid) {
        const fetchedUser = await getUserById(item.userId);
        setLink(`/users/${fetchedUser.username}/lists/${item.id}`);
        setListUser(fetchedUser.username);
      }
    };

    fetchUser();
  }, [item]);

  return (
    <Link to={link} className="flex flex-col gap-2">
      {listUser && <p className="text-gray-400">{`Created by ${listUser}`}</p>}
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
