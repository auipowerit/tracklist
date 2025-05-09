import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "src/features/shared/components/modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import SuccessAlert from "src/features/shared/components/alerts/SuccessAlert";
import {
  faArrowRight,
  faList,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import ListForm from "../forms/ListForm";
import "./list-buttons.scss";

export default function AddToListButton(props) {
  const {
    isModalOpen,
    setIsModalOpen,
    showIcon = false,
    list,
    media,
    category,
  } = props;

  const { globalUser } = useAuthContext();
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    return () => {
      setSuccess(false);
    };
  }, [isModalOpen]);

  function handleClick() {
    if (!globalUser) {
      navigate("/authenticate");
      return;
    }
    setIsModalOpen(true);
  }

  function handleSuccessClick() {
    navigate(`/users/${globalUser.username}/lists`);
    setIsModalOpen(false);
  }

  return (
    <div>
      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        {success ? (
          <SuccessAlert
            message={"Changes saved!"}
            link={"Go to lists"}
            icon={faArrowRight}
            onClick={handleSuccessClick}
          />
        ) : (
          <ListForm
            isModalOpen={isModalOpen}
            media={media}
            category={category}
            list={list}
            isAdding={true}
            setSuccess={setSuccess}
          />
        )}
      </Modal>

      {showIcon ? (
        <button onClick={handleClick} className="list-save-button">
          <FontAwesomeIcon icon={faList} />
        </button>
      ) : (
        <button className="basic-button" onClick={handleClick}>
          <FontAwesomeIcon icon={faPlus} />
          <p>Add items</p>
        </button>
      )}
    </div>
  );
}
