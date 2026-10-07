import "./Toast.css";

export default function Toast({ message, type = "success", onClose }) {
  return (
    <div className={`toast toast-${type}`}>
          <span>{message}</span>
          
    </div>
  );
} 