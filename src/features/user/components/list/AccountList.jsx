import { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import Loading from "src/features/shared/components/Loading";
import StaticList from "src/features/list/components/StaticList";
import DraggableList from "src/features/list/components/DraggableList";
import ListHeader from "./ListHeader";
import ListDataFetcher from "./ListDataFetcher";
import "./account-list.scss";

export default function AccountList() {
  const params = useParams();
  const listId = params?.listId;

  const { user, canEdit } = useOutletContext();

  const { list, items, setItems } = ListDataFetcher({ listId, user, canEdit });
  const [isEditing, setIsEditing] = useState(false);
  const [orientation, setOrientation] = useState("horizontal");

  if (!list) {
    return <Loading />;
  }

  return (
    <div className="account__section account-list">
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
    </div>
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
