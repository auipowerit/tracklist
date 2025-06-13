import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { db } from "src/config/firebase";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import { doc, onSnapshot } from "firebase/firestore";
import StaticList from "src/features/list/components/StaticList";
import DraggableList from "src/features/list/components/DraggableList";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import ListHeader from "./ListHeader";
import "./account-list.scss";

export default function AccountList() {
  const [list, setList] = useState(null);
  const [items, setItems] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [orientation, setOrientation] = useState("horizontal");

  const { getMediaById, getMediaLinks } = useSpotifyContext();
  const { user, canEdit } = useOutletContext();

  const params = useParams();
  const listId = params?.listId;

  useEffect(() => {
    if (!listId || !user) return;

    const unsubscribe = onSnapshot(doc(db, "lists", listId), async (doc) => {
      if (!doc.exists()) return;

      const fetchedList = {
        id: doc.id,
        ...doc.data(),
      };

      if (fetchedList.isPrivate && !canEdit) {
        navigate(`/users/${user.username}/lists`);
        return;
      }

      const listItems = await Promise.all(
        fetchedList.media.map(async (media) => {
          const fetchedMedia = await getMediaById(media.id, media.category);
          const data = getMediaLinks(fetchedMedia);

          return {
            id: fetchedMedia.id,
            category: media.category,
            ...data,
          };
        }),
      );

      setList(fetchedList);
      setItems(listItems);
    });

    return () => unsubscribe();
  }, [listId, user]);

  if (!list) {
    return null;
  }

  return (
    <section className="account__section account-list">
      <ListHeader
        list={list}
        image={items[0]?.image || DEFAULT_MEDIA_IMG}
        canEdit={canEdit}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        orientation={orientation}
        setOrientation={setOrientation}
      />

      <List
        list={list}
        items={items}
        setItems={setItems}
        isEditing={isEditing}
        orientation={orientation}
      />
    </section>
  );
}

function List({ list, items, setItems, isEditing, orientation }) {
  if (items?.length === 0) {
    return <p className="empty__message">This list is empty.</p>;
  }

  return (
    <div className={`account-list__list account-list__list--${orientation}`}>
      {isEditing ? (
        <DraggableList
          items={items}
          setItems={setItems}
          list={list}
          orientation={orientation}
        />
      ) : (
        <StaticList items={items} list={list} orientation={orientation} />
      )}
    </div>
  );
}
