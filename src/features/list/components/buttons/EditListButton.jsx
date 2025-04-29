import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "src/features/shared/components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { faArrowRight, faPen } from "@fortawesome/free-solid-svg-icons";
import SuccessMessage from "src/features/shared/components/SuccessMessage";
import ListForm from "../forms/ListForm";
import "./list-buttons.scss";

export default function EditListButton(props) {
  const { isModalOpen, setIsModalOpen, list } = props;

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
          <SuccessMessage
            message={"Changes saved!"}
            link={"Go to lists"}
            icon={faArrowRight}
            onClick={handleSuccessClick}
          />
        ) : (
          <ListForm
            isModalOpen={isModalOpen}
            list={list}
            setSuccess={setSuccess}
          />
        )}
      </Modal>

      <button className="basic-button" onClick={handleClick}>
        <FontAwesomeIcon icon={faPen} />
        <p>List details</p>
      </button>
    </div>
  );
}
