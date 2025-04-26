import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useListContext } from "src/features/list/context/ListContext";
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
  const { createNewList, updateListDetails } = useListContext();

  const [name, setName] = useState(list?.name || "");

  const [isRanking, setIsRanking] = useState(list?.isRanking || false);
  const [isPrivate, setIsPrivate] = useState(list?.isPrivate || false);
  const [description, setDescription] = useState(list?.description || "");

  useEffect(() => {
    handleModal();
    handleListValues();
  }, [isModalOpen, list]);

  function handleModal() {
    if (!isModalOpen) resetValues();
  }

  function handleListValues() {
    if (list) {
      setName(list.name);
      setIsRanking(list.isRanking);
      setIsPrivate(list.isPrivate);
      setDescription(list.description);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const listData = getValues();
    if (!listData) return;

    if (list) {
      await updateListDetails(list.id, listData);
      setIsModalOpen(false);
      window.location.reload();
      resetValues();
      return;
    }

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
      isRanking,
      isPrivate,
      description,
      media: [],
    };

    return listData;
  }

  function resetValues() {
    setName("");
    setIsRanking(false);
    setIsPrivate(false);
    setDescription("");
    if (setNewList) setNewList(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="m-auto flex flex-col items-center justify-center gap-8 py-6 text-xl"
    >
      <FormHeader />

      <div className="flex h-full justify-center gap-6">
        <div className="flex h-full flex-col gap-8">
          <FormName name={name} setName={setName} />
          <div className="flex flex-col gap-2">
            <FormCheckbox
              name="Ranking"
              isChecked={isRanking}
              setIsChecked={setIsRanking}
            />
            <FormCheckbox
              name="Private"
              isChecked={isPrivate}
              setIsChecked={setIsPrivate}
            />
          </div>
        </div>
        <FormDescription
          description={description}
          setDescription={setDescription}
        />
      </div>

      <FormButtons
        list={list}
        setNewList={setNewList}
        setIsModalOpen={setIsModalOpen}
      />
    </form>
  );
}

function FormHeader({ list }) {
  const title = list ? "Edit List" : "Create New List";

  return (
    <p className="w-full border-b-1 border-white pb-2 text-left text-2xl font-bold">
      {title}
    </p>
  );
}

function FormName({ name, setName }) {
  const NAME_LIMIT = 50;

  const color = name.length >= NAME_LIMIT ? "text-red-600" : "text-gray-400";

  function handleChange(e) {
    if (e.target.value.length > NAME_LIMIT) {
      setName(e.target.value.slice(0, NAME_LIMIT));
      return;
    }
    setName(e.target.value);
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label htmlFor="name">Name</label>
        <p className={`text-sm ${color}`}>
          {name.length || 0}/{NAME_LIMIT}
        </p>
      </div>
      <input
        name="name"
        type="text"
        value={name}
        onChange={handleChange}
        className="border-1 border-white px-2 py-1 outline-hidden"
      />
    </div>
  );
}

function FormCheckbox({ name, isChecked, setIsChecked }) {
  return (
    <div className="flex items-center gap-2">
      <input
        name={name}
        type="checkbox"
        checked={isChecked && "checked"}
        value={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      <label htmlFor="box">{name}</label>
    </div>
  );
}

function FormDescription({ description, setDescription }) {
  const DESC_LIMIT = 150;

  const color =
    description.length >= DESC_LIMIT ? "text-red-600" : "text-gray-400";

  function handleChange(e) {
    if (e.target.value.length > DESC_LIMIT) {
      setDescription(e.target.value.slice(0, DESC_LIMIT));
      return;
    }
    setDescription(e.target.value);
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label htmlFor="description">Description</label>
        <p className={`text-sm ${color}`}>
          {description.length || 0}/{DESC_LIMIT}
        </p>
      </div>

      <textarea
        id="description"
        name="description"
        value={description}
        onChange={handleChange}
        className="h-full border-1 border-white px-2 py-1 outline-none"
      />
    </div>
  );
}

function FormButtons({ list, setNewList, setIsModalOpen }) {
  const navigate = useNavigate();

  const { deleteList } = useListContext();

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this list?")) {
      return;
    }

    await deleteList(list.id, globalUser.uid);

    setIsModalOpen(false);
    navigate(`/users/${globalUser.uid}/lists`);
  }

  return (
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
  );
}
