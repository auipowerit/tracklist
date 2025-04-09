import { useParams } from "react-router-dom";
import Loading from "src/components/Loading";
import ListHeader from "./components/ListHeader";
import DraggableList from "./components/DraggableList";
import ListDataFetcher from "./components/ListDataFetcher";

export default function AccountList() {
  const params = useParams();
  const listId = params?.listId;

  const { list, items, setItems } = ListDataFetcher({ listId });

  if (!list) {
    return <Loading />;
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <ListHeader list={list} />
      <RenderList list={list} items={items} setItems={setItems} />
    </div>
  );
}

function RenderList({ list, items, setItems }) {
  return (
    <div className="overflow-y-auto border-t-1 border-white py-10">
      <div className="flex flex-wrap gap-6">
        {items.length > 0 ? (
          <DraggableList items={items} setItems={setItems} list={list} />
        ) : (
          <p className="m-20 text-center text-2xl text-gray-300 italic">
            {`This list is empty.`}
          </p>
        )}
      </div>
    </div>
  );
}
