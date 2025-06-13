import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { db } from "src/config/firebase";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import { doc, onSnapshot } from "firebase/firestore";
import Tabs from "src/features/shared/components/buttons/Tabs";
import ListCard from "src/features/list/components/cards/ListCard";
import { useListContext } from "src/features/list/context/ListContext";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import AddListButton from "src/features/list/components/buttons/AddListButton";
import "./account-lists.scss";

export default function AccountLists() {
  const tabs = [
    { id: "created", label: "Created" },
    { id: "saved", label: "Saved" },
  ];

  const { user, canEdit } = useOutletContext();

  const [activeTab, setActiveTab] = useState("created");

  return (
    <section className="account__section account-lists">
      <Header canEdit={canEdit} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Lists user={user} activeTab={activeTab} />
    </section>
  );
}

function Header({ canEdit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("lock-scroll");
    }
  }, [isModalOpen]);

  return (
    <div className="account__header">
      <h2 className="account__title">Lists</h2>
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
  const [isLoading, setIsLoading] = useState(true);
  const [lists, setLists] = useState([]);
  const [images, setImages] = useState([]);

  const { globalUser } = useAuthContext();
  const { getListById } = useListContext();
  const { getMediaById } = useSpotifyContext();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "userlists", user.uid),
      async (doc) => {
        if (!doc.exists()) {
          setIsLoading(false);
          return;
        }

        setIsLoading(true);

        const userLists =
          activeTab === "created" ? doc.data().lists : doc.data().savedLists;

        if (!userLists || userLists.length === 0) {
          setIsLoading(false);
          return;
        }

        const fetchedLists = await Promise.all(
          userLists.map(async (listId) => await getListById(listId)),
        );

        // Filter out private lists if logged in user is not the owner
        if (user.uid !== globalUser.uid) {
          const filteredLists = fetchedLists.filter(
            (list) => list.isPrivate === false,
          );
          setLists(filteredLists);
        } else {
          setLists(fetchedLists);
        }

        const fetchedImages = await getImages(fetchedLists);
        setImages(fetchedImages);

        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user, activeTab]);

  const getImages = async (lists) => {
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
  };

  if (isLoading) {
    return null;
  }

  if (lists.length === 0) {
    return <p className="empty__message">There are no lists yet!</p>;
  }

  return (
    <ul className="account-lists__list">
      {lists &&
        lists.map((list, index) => {
          return (
            <ListItem
              key={list.id}
              item={list}
              image={images[index] || DEFAULT_MEDIA_IMG}
            />
          );
        })}
    </ul>
  );
}

function ListItem({ item, image }) {
  const [link, setLink] = useState(item.id);
  const [listUser, setListUser] = useState(null);

  const { user } = useOutletContext();
  const { getUserById } = useAuthContext();

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
    <Link to={link} className="account-lists__item">
      {listUser && <p className="account-lists__user">{listUser}</p>}
      <ListCard id={item.id} list={item} image={image} />
    </Link>
  );
}
