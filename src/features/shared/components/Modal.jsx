import "./styles/modal.scss";

export default function Modal({ children, isModalOpen, setIsModalOpen }) {
  function onClose() {
    setIsModalOpen(false);
  }

  return (
    <div
      className={`modal-overlay ${isModalOpen && "active"}`}
      onClick={onClose}
    >
      <div
        className={`modal-container ${isModalOpen && "active"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-button" onClick={onClose}>
          &times;
        </button>

        {children}
      </div>
    </div>
  );
}
