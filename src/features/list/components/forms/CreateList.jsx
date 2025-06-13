import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "src/features/shared/components/alerts/Alert";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "src/features/shared/components/buttons/Button";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useListContext } from "src/features/list/context/ListContext";
import { LIST_DESCRIPTION_LIMIT, LIST_NAME_LIMIT } from "src/data/const";

export default function CreateList(props) {
  const { isModalOpen, setIsModalOpen, setNewList, list, setSuccess } = props;

  const [error, setError] = useState("");
  const [name, setName] = useState(list?.name || "");
  const [isRanking, setIsRanking] = useState(list?.isRanking || false);
  const [isPrivate, setIsPrivate] = useState(list?.isPrivate || false);
  const [description, setDescription] = useState(list?.description || "");

  const formRef = useRef(null);

  const { globalUser } = useAuthContext();
  const { createNewList, updateListDetails } = useListContext();

  useEffect(() => {
    if (!isModalOpen) {
      resetValues();
    }

    const handleListValues = () => {
      if (list) {
        setName(list.name);
        setIsRanking(list.isRanking);
        setIsPrivate(list.isPrivate);
        setDescription(list.description);
      }
    };

    handleListValues();
  }, [isModalOpen, list]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateData();
    if (!isValid) return;

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
  };

  const validateData = () => {
    const nameInput = formRef.current.elements["listname"];
    const descriptionInput = formRef.current.elements["description"];

    if (!globalUser) {
      setError("Please sign in to continue.");
      return false;
    }

    if (name === "" && description === "") {
      nameInput.classList.add("form__input--invalid");
      descriptionInput.classList.add("form__input--invalid");
      setError("Please fill out all fields.");
      return false;
    }

    if (name === "") {
      nameInput.classList.add("form__input--invalid");
      setError("Please provide a name.");
      return false;
    }

    if (name.length > LIST_NAME_LIMIT) {
      nameInput.classList.add("form__input--invalid");
      setError(`Please keep the name under ${LIST_NAME_LIMIT} characters.`);
      return false;
    }

    if (description === "") {
      descriptionInput.classList.add("form__input--invalid");
      setError("Please provide a description.");
      return false;
    }

    if (description.length > LIST_DESCRIPTION_LIMIT) {
      descriptionInput.classList.add("form__input--invalid");
      setError(
        `Please keep the description under ${LIST_DESCRIPTION_LIMIT} characters.`,
      );
      return false;
    }

    return true;
  };

  const resetValues = () => {
    setName("");
    setIsRanking(false);
    setIsPrivate(false);
    setDescription("");
    setError("");
    setNewList && setNewList(false);

    formRef.current.elements["listname"].classList.remove(
      "form__input--invalid",
    );
    formRef.current.elements["description"].classList.remove(
      "form__input--invalid",
    );
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="form list-form">
      <FormHeader list={list} />

      <div className="list-form__content">
        <FormName name={name} setName={setName} />
        <div className="list-form__checkboxes">
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
  return <p className="form__header">{title}</p>;
}

function FormName({ name, setName }) {
  const color = name.length >= LIST_NAME_LIMIT ? "red" : "gray";

  const handleChange = (e) => {
    e.target.classList.remove("form__input--invalid");

    if (e.target.value.length > LIST_NAME_LIMIT) {
      setName(e.target.value.slice(0, LIST_NAME_LIMIT));
      return;
    }

    setName(e.target.value);
  };

  return (
    <div className="list-form__name">
      <div className="list-form__input--header">
        <label htmlFor="listname" className="form__textarea--label">
          Name
        </label>
        <p style={{ color: color }}>
          {name.length || 0}/{LIST_NAME_LIMIT}
        </p>
      </div>

      <input
        type="text"
        name="listname"
        placeholder="Provide a name..."
        value={name}
        onChange={handleChange}
        className="form__input"
      />
    </div>
  );
}

function FormCheckbox({ name, isChecked, setIsChecked }) {
  return (
    <div className="list-form__input">
      <input
        id={name}
        name={name}
        checked={isChecked && "checked"}
        onChange={() => setIsChecked(!isChecked)}
        type="checkbox"
        value={isChecked}
      />
      <label htmlFor={name}>{name}</label>
    </div>
  );
}

function FormDescription({ description, setDescription }) {
  const color = description.length >= LIST_DESCRIPTION_LIMIT ? "red" : "gray";

  const handleChange = (e) => {
    e.target.classList.remove("form__input--invalid");

    if (e.target.value.length > LIST_DESCRIPTION_LIMIT) {
      setDescription(e.target.value.slice(0, LIST_DESCRIPTION_LIMIT));
      return;
    }

    setDescription(e.target.value);
  };

  return (
    <div className="form__textarea">
      <div className="list-form__input--header">
        <label htmlFor="description" className="form__textarea--label">
          Description
        </label>
        <p style={{ color: color }}>
          {description.length || 0}/{LIST_DESCRIPTION_LIMIT}
        </p>
      </div>

      <textarea
        className="form__textarea--input"
        name="description"
        id="description"
        placeholder="Write a description..."
        value={description}
        onChange={handleChange}
      />
    </div>
  );
}

function FormButtons({ list, setNewList, setIsModalOpen }) {
  const navigate = useNavigate();

  const { globalUser } = useAuthContext();
  const { deleteList } = useListContext();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this list?")) {
      return;
    }

    await deleteList(list.id, globalUser.uid);

    setIsModalOpen(false);
    navigate(`/users/${globalUser.username}/lists`);
  };

  return (
    <div className="list-form__buttons">
      {setNewList && (
        <Button
          onClick={() => setNewList(false)}
          classes="list-form__button list-form__button--back"
          ariaLabel="back"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <p>Back</p>
        </Button>
      )}
      <Button
        type="submit"
        classes="list-form__button form__submit"
        ariaLabel="submit changes"
      >
        {list ? "Save" : "Create"}
      </Button>

      {list && (
        <Button
          onClick={handleDelete}
          classes="list-form__button list-form__button--delete"
          ariaLabel="delete list"
        >
          <p>Delete</p>
        </Button>
      )}
    </div>
  );
}
