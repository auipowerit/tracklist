import { Link, useOutletContext, useParams } from "react-router-dom";
import Loading from "src/components/Loading";
import ListHeader from "./components/ListHeader";
import DraggableList from "./components/DraggableList";
import ListDataFetcher from "./components/ListDataFetcher";
import { useState } from "react";
import MediaListCard from "src/components/Cards/MediaListCard";

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
            <List items={items} list={list} />
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

function List({ items, list }) {
  return items.map((item, index) => (
    <div key={item.id}>
      <Link to={item.titleLink}>
        <MediaListCard
          title={item.title}
          subtitle={item.subtitle}
          image={item.image}
          index={list.isRanking && index + 1}
        />
      </Link>
    </div>
  ));
}
