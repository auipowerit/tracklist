import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Tabs from "src/layouts/buttons/Tabs";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import Loading from "src/features/shared/components/Loading";
import ListCard from "src/features/list/components/cards/ListCard";
import { useListContext } from "src/features/list/context/ListContext";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import AddListButton from "src/features/list/components/buttons/AddListButton";
import "./account-lists.scss";

export default function AccountLists() {
  const { user, canEdit } = useOutletContext();

  const [activeTab, setActiveTab] = useState("created");

  const tabs = [
    { id: "created", label: "Created" },
    { id: "saved", label: "Saved" },
  ];

  return (
    <div className="account-page-outlet-container">
      <Header canEdit={canEdit} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Lists user={user} activeTab={activeTab} />
    </div>
  );
}

function Header({ canEdit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("lock-scroll-modal");
    }
  }, [isModalOpen]);

  return (
    <div className="account-page-header">
      <p>Lists</p>
      {canEdit && (
        <AddListButton
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
}

function Lists({ user, activeTab }) {
  const { globalUser } = useAuthContext();
  const { getListsByUserId, getSavedListsByUserId } = useListContext();
  const { getMediaById } = useSpotifyContext();

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
        if (list.media.length === 0) return DEFAULT_MEDIA_IMG;

        const fetchedMedia = await getMediaById(
          list.media[0].id,
          list.media[0].category,
        );

        return fetchedMedia.image || DEFAULT_MEDIA_IMG;
      }),
    );

    return fetchedImages;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="account-lists-container">
      {lists && lists.length > 0 ? (
        <ul className="account-lists">
          {lists.map((list, index) => {
            return (
              <li key={list.id}>
                <ListItem
                  item={list}
                  image={images[index] || DEFAULT_MEDIA_IMG}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="empty__message">There are no lists yet!</p>
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
    <Link to={link} className="account-list-item">
      {listUser && <p>{`Created by ${listUser}`}</p>}
      <ListCard id={item.id} list={item} image={image} />
    </Link>
  );
}
