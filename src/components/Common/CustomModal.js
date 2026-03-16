import "./CustomModal.css";

export default function CustomModal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {title && <h2 style={{ textAlign: "left" }}>{title}</h2>}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
