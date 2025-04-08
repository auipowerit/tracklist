import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CSS } from "@dnd-kit/utilities";
import Loading from "src/components/Loading";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useListContext } from "src/context/List/ListContext";
import MediaListCard from "src/components/Cards/MediaListCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import { faCheck, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";

export default function AccountList() {
  const { globalUser } = useAuthContext();
  const { getListById } = useListContext();
  const { defaultImg, getMediaById } = useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [list, setList] = useState(null);
  const [listItems, setListItems] = useState({
    link: "",
    image: defaultImg,
  });

  const params = useParams();
  const listId = params?.listId;

  useEffect(() => {
    if (!globalUser || !listId) return;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const fetchedList = await getListById(listId, globalUser.uid);
        setList(fetchedList);

        const mediaData = await Promise.all(
          fetchedList.media.map(async (media) => {
            const fetchedMedia = await getMediaById(media.id, media.category);
            const artist = fetchedMedia.artists?.[0] || fetchedMedia || {};
            const artistURL = `/artists/${artist?.id}`;

            return {
              id: fetchedMedia.id,
              category: media.category,
              title: fetchedMedia.name,
              subtitle:
                fetchedMedia.type === "track" ? "song" : fetchedMedia.type,
              link:
                fetchedMedia.type === "artist"
                  ? artistURL
                  : fetchedMedia.type === "album"
                    ? `${artistURL}/albums/${fetchedMedia.id}`
                    : `${artistURL}/albums/${fetchedMedia.album?.id}/tracks/${fetchedMedia.id}`,
              image:
                fetchedMedia.images?.[0]?.url ||
                fetchedMedia.album?.images?.[0]?.url ||
                defaultImg,
            };
          }),
        );

        setListItems(mediaData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [globalUser, listId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <ListHeader
        listId={list.id}
        listItems={listItems}
        name={list.name}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        tags={list.tags}
      />
      <div className="overflow-y-scroll border-t-1 border-white py-10">
        {list && (
          <MediaList
            listId={list.id}
            listItems={listItems}
            setListItems={setListItems}
            isEditing={isEditing}
            isRanking={list.isRanking}
          />
        )}
      </div>
    </div>
  );
}

function ListHeader({ listId, listItems, name, isEditing, setIsEditing }) {
  const { globalUser } = useAuthContext();
  const { reorderListItems, updateListName } = useListContext();

  const [title, setTitle] = useState(name);

  async function reorderList() {
    const newOrder = listItems.map((item) => {
      return {
        category: item.category,
        id: item.id,
      };
    });

    await reorderListItems(globalUser.uid, listId, newOrder);
  }

  async function handleClick() {
    if (title === "") return;

    if (isEditing) {
      await reorderList();

      if (title === name) {
        setIsEditing(false);
        return;
      }
      if (await updateListName(globalUser.uid, listId, title)) {
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  }

  return (
    <div className="flex items-center justify-between align-middle">
      <div className="flex items-center gap-4">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-1 border-white p-1 text-2xl text-white outline-none"
          />
        ) : (
          <p className="text-2xl text-white">{title}</p>
        )}

        <button
          onClick={handleClick}
          className="flex items-center gap-2 rounded-md bg-green-700 px-3 py-1 hover:text-gray-400"
        >
          <FontAwesomeIcon icon={isEditing ? faCheck : faPen} />
          {isEditing ? "Done" : "Edit"}
        </button>

        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-1 rounded-md bg-gray-700 px-3 py-1 hover:text-gray-400"
          >
            <FontAwesomeIcon icon={faXmark} />
            <p>Cancel</p>
          </button>
        )}
      </div>
    </div>
  );
}

function MediaList({ listItems, setListItems, listId, isEditing, isRanking }) {
  return (
    <div className="flex flex-wrap gap-6">
      {listItems?.length > 0 ? (
        isEditing ? (
          <DraggableList
            listId={listId}
            listItems={listItems}
            setListItems={setListItems}
            isRanking={isRanking}
          />
        ) : (
          listItems.map((item, index) => (
            <Link
              key={item.id}
              to={item.link}
              className="border-1 border-transparent hover:border-white"
            >
              <MediaListCard
                title={item.title}
                subtitle={item.subtitle}
                image={item.image}
                index={isRanking && index + 1}
              />
            </Link>
          ))
        )
      ) : (
        <p className="m-20 text-center text-2xl text-gray-300 italic">
          {`This list is empty.`}
        </p>
      )}
    </div>
  );
}

function DraggableList({ listId, listItems, setListItems, isRanking }) {
  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id === over.id) return;

    setListItems((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={listItems} strategy={rectSortingStrategy}>
        {listItems.map((item, index) => (
          <div key={item.id}>
            <SortableItem
              item={item}
              index={index}
              listId={listId}
              isRanking={isRanking}
            />
          </div>
        ))}
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ item, index, listId, isRanking }) {
  const { globalUser } = useAuthContext();
  const { deleteListItem } = useListContext();

  const {
    setNodeRef,
    attributes,
    listeners,
    isDragging,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    cursor: "grab",
    transform: CSS.Transform.toString(transform),
    transition,
  };

  async function handleDelete(itemId) {
    await deleteListItem(globalUser.uid, listId, itemId);

    setListItems(
      listItems.filter((item) => {
        return item.id !== itemId;
      }),
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative"
    >
      <div
        className={isDragging ? "opacity-100" : "opacity-50 hover:opacity-100"}
      >
        <MediaListCard
          title={item.title}
          subtitle={item.subtitle}
          image={item.image}
          index={isRanking && index + 1}
        />
      </div>
      <button
        onClick={() => handleDelete(item.id)}
        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-800 p-2 font-bold hover:text-gray-400"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}
