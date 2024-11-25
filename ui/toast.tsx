import { useEffect } from "react";

type ToastProps = {
  message: string;
  variant?: "success" | "error" | "normal";
  duration?: number; // Duration in milliseconds
  onClose: () => void;
};

const Toast = ({
  message,
  variant = "normal",
  duration = 3000,
  onClose,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer); // Cleanup on unmount
  }, [duration, onClose]);

  const baseStyles = `fixed top-5 left-5 text-white px-4 py-2 rounded shadow-lg transition transform ease-in-out duration-300`;
  const statusStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    normal: "bg",
  };

  return (
    <div className={`${baseStyles} ${statusStyles[variant]}`}>{message}</div>
  );
};

export default Toast;
