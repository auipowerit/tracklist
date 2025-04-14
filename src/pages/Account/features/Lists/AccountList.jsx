import { useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import Loading from "src/components/Loading";
import ListItemCard from "src/components/Cards/ListItemCard";
import ListHeader from "./components/ListHeader";
import DraggableList from "./components/DraggableList";
import ListDataFetcher from "./components/ListDataFetcher";
import StaticList from "./components/StaticList";

export default function AccountList() {
  const params = useParams();
  const listId = params?.listId;

  const { user, canEdit } = useOutletContext();

  const { list, items, setItems } = ListDataFetcher({ listId, user, canEdit });
  const [isEditing, setIsEditing] = useState(false);

  if (!list) {
    return <Loading />;
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <ListHeader
        list={list}
        canEdit={canEdit}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <RenderList
        list={list}
        items={items}
        setItems={setItems}
        isEditing={isEditing}
      />
    </div>
  );
}

function RenderList({ list, items, setItems, isEditing }) {
  return (
    <div className="overflow-y-auto border-t-1 border-white py-10">
      <div className="flex flex-wrap gap-6">
        {items.length > 0 ? (
          isEditing ? (
            <DraggableList items={items} setItems={setItems} list={list} />
          ) : (
            <StaticList items={items} list={list} />
          )
        ) : (
          <p className="m-auto my-20 text-center text-2xl text-gray-300 italic">
            {`This list is empty.`}
          </p>
        )}
      </div>
    </div>
  );
}
