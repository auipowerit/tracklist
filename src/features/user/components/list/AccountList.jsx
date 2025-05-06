import { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import Loading from "src/features/shared/components/Loading";
import ListHeader from "./ListHeader";
import StaticList from "src/features/list/components/StaticList";
import DraggableList from "src/features/list/components/DraggableList";
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
    <div className="account-page-outlet-container">
      <ListHeader
        list={list}
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
    return (
      <div className="account-list">
        <p className="empty__message">This list is empty.</p>
      </div>
    );
  }

  return (
    <div className={`account-list ${orientation}`}>
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
