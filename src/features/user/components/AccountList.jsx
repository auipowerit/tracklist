import { useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import Loading from "src/features/shared/components/Loading";
import ListHeader from "./ListHeader";
import DraggableList from "./lists/DraggableList";
import ListDataFetcher from "./ListDataFetcher";
import ListItemCard from "src/features/list/components/cards/ListItemCard";

export default function AccountList() {
  const params = useParams();
  const listId = params?.listId;

  const { user, canEdit } = useOutletContext();

  const { list, items, setItems } = ListDataFetcher({ listId, user, canEdit });
  const [isEditing, setIsEditing] = useState(false);
  const [orientation, setOrientation] = useState(0);

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
        orientation={orientation}
        setOrientation={setOrientation}
      />
      <div className="overflow-y-auto border-t-1 border-white py-10">
        <RenderList
          list={list}
          items={items}
          setItems={setItems}
          isEditing={isEditing}
          orientation={orientation}
        />
      </div>
    </div>
  );
}

function RenderList({ list, items, setItems, isEditing, orientation }) {
  return (
    <div
      className={`flex gap-6 ${orientation === 0 ? "flex-wrap" : "flex-col"}`}
    >
      {items.length > 0 ? (
        isEditing ? (
          <DraggableList
            items={items}
            setItems={setItems}
            list={list}
            orientation={orientation}
          />
        ) : (
          <StaticList items={items} list={list} orientation={orientation} />
        )
      ) : (
        <p className="m-auto my-20 text-center text-2xl text-gray-300 italic">
          {`This list is empty.`}
        </p>
      )}
    </div>
  );
}

function StaticList({ items, list, orientation }) {
  return items.map((item, index) => (
    <div key={item.id}>
      <Link to={item.titleLink}>
        <ListItemCard
          title={item.title}
          subtitle={item.subtitle}
          image={item.image}
          index={list.isRanking && index + 1}
          orientation={orientation}
        />
      </Link>
    </div>
  ));
}
