import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useListContext } from "src/features/list/context/ListContext";
import {
  faArrowLeft,
  faCheck,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Alert from "src/features/shared/components/Alert";

const NAME_LIMIT = 50;
const DESC_LIMIT = 150;

export default function CreateList(props) {
  const { isModalOpen, setIsModalOpen, setNewList, list, setSuccess } = props;

  const { globalUser } = useAuthContext();
  const { createNewList, updateListDetails } = useListContext();

  const [error, setError] = useState("");
  const [name, setName] = useState(list?.name || "");
  const [isRanking, setIsRanking] = useState(list?.isRanking || false);
  const [isPrivate, setIsPrivate] = useState(list?.isPrivate || false);
  const [description, setDescription] = useState(list?.description || "");

  const formRef = useRef(null);

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

  async function handleSubmit(e) {
    e.preventDefault();

    const nameInput = formRef.current.elements["listname"];
    const descriptionInput = formRef.current.elements["description"];

    if (!globalUser) {
      setError("Please sign in to continue.");
      return;
    }

    if (name === "" && description === "") {
      nameInput.classList.add("invalid-field");
      descriptionInput.classList.add("invalid-field");
      setError("Please fill out all fields.");
      return;
    }

    if (name === "") {
      nameInput.classList.add("invalid-field");
      setError("Please provide a name.");
      return;
    }

    if (name.length > NAME_LIMIT) {
      nameInput.classList.add("invalid-field");
      setError(`Please keep the name under ${NAME_LIMIT} characters.`);
      return;
    }

    if (description === "") {
      descriptionInput.classList.add("invalid-field");
      setError("Please provide a description.");
      return;
    }

    if (description.length > DESC_LIMIT) {
      descriptionInput.classList.add("invalid-field");
      setError(`Please keep the description under ${DESC_LIMIT} characters.`);
      return;
    }

    const listData = {
      name,
      isRanking,
      isPrivate,
      description,
      media: [],
    };

    if (list) {
      await updateListDetails(list.id, listData);
      setSuccess(true);
      resetValues();
      return;
    }

    await createNewList(listData, globalUser.uid);

    if (!setNewList) {
      setSuccess(true);
      return;
    }

    setNewList(false);
    resetValues();
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
      ref={formRef}
      onSubmit={handleSubmit}
      className="form-container list-form"
    >
      <FormHeader list={list} />

      <div className="list-form-info-container">
        <FormName name={name} setName={setName} />
        <div className="list-form-checkbox-container">
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

      <Alert message={error} />

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
  return <p className="form-header">{title}</p>;
}

function FormName({ name, setName }) {
  const color = name.length >= NAME_LIMIT ? "red" : "gray";

  function handleChange(e) {
    e.target.classList.remove("invalid-field");

    if (e.target.value.length > NAME_LIMIT) {
      setName(e.target.value.slice(0, NAME_LIMIT));
      return;
    }
    setName(e.target.value);
  }

  return (
    <div className="list-form-name-container">
      <div className="list-form-input-header">
        <label htmlFor="listname">Name</label>
        <p style={{ color: color }}>
          {name.length || 0}/{NAME_LIMIT}
        </p>
      </div>

      <input
        name="listname"
        type="text"
        value={name}
        onChange={handleChange}
        className="form-input"
      />
    </div>
  );
}

function FormCheckbox({ name, isChecked, setIsChecked }) {
  return (
    <div className="list-form-input-container">
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
  const color = description.length >= DESC_LIMIT ? "red" : "gray";

  function handleChange(e) {
    e.target.classList.remove("invalid-field");

    if (e.target.value.length > DESC_LIMIT) {
      setDescription(e.target.value.slice(0, DESC_LIMIT));
      return;
    }
    setDescription(e.target.value);
  }

  return (
    <div className="form-textarea-container">
      <div className="list-form-input-header">
        <label htmlFor="description">Description</label>
        <p style={{ color: color }}>
          {description.length || 0}/{DESC_LIMIT}
        </p>
      </div>

      <textarea
        id="description"
        name="description"
        value={description}
        onChange={handleChange}
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
    <div className="list-form-buttons-container">
      {setNewList && (
        <button
          type="button"
          onClick={() => setNewList(false)}
          className="list-form-back-button"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <p>Back</p>
        </button>
      )}
      <button type="submit" className="form-submit-button">
        <FontAwesomeIcon icon={list ? faCheck : faPlus} />
        <p>{list ? "Save" : "Create"}</p>
      </button>

      {list && (
        <button
          type="button"
          onClick={handleDelete}
          className="list-form-delete-button"
        >
          <FontAwesomeIcon icon={faTrash} />
          <p>Delete</p>
        </button>
      )}
    </div>
  );
}
