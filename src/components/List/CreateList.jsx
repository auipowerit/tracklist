import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useListContext } from "src/context/List/ListContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faPlus,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function CreateList(props) {
  const { isModalOpen, setIsModalOpen, setNewList, list } = props;

  const { globalUser } = useAuthContext();
  const { checkIfListExists, createNewList, updateListDetails, deleteList } =
    useListContext();

  const navigate = useNavigate();

  const nameLimit = 50;
  const descriptionLimit = 150;

  const [name, setName] = useState(list?.name || "");
  const [tags, setTags] = useState(list?.tags || []);
  const [isRanking, setIsRanking] = useState(list?.isRanking || false);
  const [isPrivate, setIsPrivate] = useState(list?.isPrivate || false);
  const [description, setDescription] = useState(list?.description || "");

  function addTag(e) {
    if (e.key !== "," || tags === "") return;

    const newTag = tags.slice(0, -1);

    if (!tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }

    setTags("");
  }

  function removeTag(tag) {
    setTags(tags.filter((item) => item !== tag));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const listData = getValues();
    if (!listData) return;

    if (list) {
      await updateListDetails(globalUser.uid, list.id, listData);
      setIsModalOpen(false);
      window.location.reload();
      resetValues();
      return;
    }

    const listExists = await checkIfListExists(listData.name, globalUser.uid);
    if (listExists) return;

    await createNewList(listData, globalUser.uid);

    if (!setNewList) {
      setIsModalOpen(false);
      window.location.reload();
      return;
    }

    setNewList(false);
    resetValues();
  }

  function getValues() {
    if (name === "" || description === "" || !globalUser) {
      return;
    }

    const listData = {
      name,
      tags: [...new Set(tags)], // Remove duplicates
      isRanking,
      isPrivate,
      description,
      media: [],
    };

    return listData;
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this list?")) {
      return;
    }

    await deleteList(list.id, globalUser.uid);

    setIsModalOpen(false);
    navigate("/account/lists");
  }

  function resetValues() {
    setName("");
    setTags([]);
    setIsRanking(false);
    setIsPrivate(false);
    setDescription("");
    if (setNewList) setNewList(false);
    setTags([]);
  }

  useEffect(() => {
    if (!isModalOpen) resetValues();

    if (list) {
      setName(list.name);
      setTags(list.tags);
      setIsRanking(list.isRanking);
      setIsPrivate(list.isPrivate);
      setDescription(list.description);
    }
  }, [isModalOpen, list]);

  return (
    <form
      onSubmit={handleSubmit}
      className="m-auto flex flex-col items-center justify-center gap-8 py-6 text-xl"
    >
      <p className="w-full border-b-1 border-white pb-2 text-left text-2xl font-bold">
        {list ? "Edit" : "Create"} List
      </p>
      <div className="flex h-full justify-center gap-6">
        <div className="flex h-full flex-col gap-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="name">Name</label>
              <p
                className={`text-sm ${name.length >= nameLimit ? "text-red-600" : "text-gray-400"}`}
              >
                {name.length || 0}/{nameLimit}
              </p>
            </div>
            <input
              name="name"
              type="text"
              value={name}
              onChange={(e) => {
                if (e.target.value.length > nameLimit) {
                  setName(e.target.value.slice(0, nameLimit));
                  return;
                }
                setName(e.target.value);
              }}
              className="border-1 border-white px-2 py-1 outline-hidden"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                name="tags"
                type="text"
                onKeyUp={addTag}
                className="border-1 border-white px-2 py-1 outline-hidden"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded-sm bg-gray-700 px-2 py-1"
                  >
                    <p>{tag}</p>
                    <button type="button" onClick={() => removeTag(tag)}>
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                name="ranking"
                type="checkbox"
                checked={isRanking && "checked"}
                value={isRanking}
                onChange={() => setIsRanking(!isRanking)}
              />
              <label htmlFor="ranking">Ranking</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                name="visibility"
                type="checkbox"
                checked={isPrivate && "checked"}
                value={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
              />
              <label htmlFor="visibility">Private</label>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label htmlFor="description">Description</label>
            <p
              className={`text-sm ${description.length >= descriptionLimit ? "text-red-600" : "text-gray-400"}`}
            >
              {description.length || 0}/{descriptionLimit}
            </p>
          </div>

          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              if (e.target.value.length > descriptionLimit) {
                setDescription(e.target.value.slice(0, descriptionLimit));
                return;
              }
              setDescription(e.target.value);
            }}
            className="h-full border-1 border-white px-2 py-1 outline-none"
          />
        </div>
      </div>
      <div className="flex justify-center gap-4">
        {setNewList && (
          <button
            type="button"
            onClick={() => setNewList(false)}
            className="flex items-center gap-2 rounded-md bg-gray-700 px-4 py-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <p>Back</p>
          </button>
        )}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-md bg-green-700 px-4 py-2"
        >
          <FontAwesomeIcon icon={list ? faCheck : faPlus} />
          <p>{list ? "Save" : "Create"}</p>
        </button>

        {list && (
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-md bg-red-700 px-4 py-2"
          >
            <FontAwesomeIcon icon={faTrash} />
            <p>Delete</p>
          </button>
        )}
      </div>
    </form>
  );
}
