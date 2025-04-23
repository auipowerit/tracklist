import "src/styles/components/modal.scss";

export default function Modal({ children, isModalOpen, setIsModalOpen }) {
  function onClose() {
    setIsModalOpen(false);
  }

  return (
    <div
      className={`modal-container ${isModalOpen && "active"}`}
      onClick={onClose}
    >
      <div
        className={`modal-overlay ${isModalOpen && "active"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-btn" onClick={onClose}>
          &times;
        </button>

        <div>{children}</div>
      </div>
    </div>
  );
}
