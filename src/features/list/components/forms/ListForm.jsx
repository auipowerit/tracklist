import { useState } from "react";
import CreateList from "./CreateList";
import AddToList from "./AddToList";
import "./list-form.scss";

export default function ListForm(props) {
  const { isModalOpen, media, category, list, isAdding, setSuccess } = props;

  const [newList, setNewList] = useState(false);

  if (isAdding) {
    return newList ? (
      <CreateList
        isModalOpen={isModalOpen}
        setNewList={setNewList}
        setSuccess={setSuccess}
      />
    ) : (
      <AddToList
        isModalOpen={isModalOpen}
        mediaId={media?.mediaId}
        listId={list?.id}
        category={category}
        setNewList={setNewList}
        setSuccess={setSuccess}
      />
    );
  }

  if (!media || !category)
    return (
      <CreateList
        isModalOpen={isModalOpen}
        list={list}
        setSuccess={setSuccess}
      />
    );

  return newList ? (
    <CreateList
      isModalOpen={isModalOpen}
      setNewList={setNewList}
      setSuccess={setSuccess}
    />
  ) : (
    <AddToList
      isModalOpen={isModalOpen}
      mediaId={media.mediaId}
      category={category}
      setNewList={setNewList}
      setSuccess={setSuccess}
    />
  );
}
