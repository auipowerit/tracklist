import "./styles/modal.scss";

export default function Modal({ children, isModalOpen, setIsModalOpen }) {
  function onClose() {
    setIsModalOpen(false);
    document.body.classList.remove("lock-scroll-modal");
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
        <button type="button" onClick={onClose} className="modal-button">
          &times;
        </button>

        {children}
      </div>
    </div>
  );
}
