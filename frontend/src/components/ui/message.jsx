import { useMessage } from "../../context/MessageContext";

export default function Message() {
  const { message } = useMessage();

  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        padding: "12px 20px",
        borderRadius: 8,
        color: "white",
        backgroundColor:
          message.type === "error" ? "#e74c3c" : "#2ecc71",
        zIndex: 9999,
      }}
    >
      {message.text}
    </div>
  );
}