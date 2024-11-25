import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type FormControlProps = React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    variant?: "filled" | "outline";
    isRequired?: boolean;
    error?: boolean;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    subtext?: string;
    as?: "input" | "textarea"; // New prop to determine the element type
  };

const FormControl = ({
  label,
  variant = "filled",
  isRequired = false,
  className = "",
  type = "text",
  error = false,
  icon,
  iconPosition = "left",
  as = "input", // Default is input
  ...props
}: FormControlProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const baseStyle = "w-full px-4 py-2 rounded focus:outline-none";
  const styles = {
    filled: `${baseStyle} bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500`,
    outline: `${baseStyle} border-2 border-gray-400 focus:border-blue-500`,
  };

  const inputWrapperStyle =
    icon || iconPosition ? "relative flex items-center" : "";

  return (
    <div className="mb-4">
      {label && <label className="block text-gray-700 mb-1">{label}</label>}
      <div className={inputWrapperStyle}>
        {icon && iconPosition === "left" && (
          <span className="absolute left-3 text-gray-400">{icon}</span>
        )}
        {as === "input" && (
          <input
            type={type === "password" && !showPassword ? "password" : type}
            className={`${styles[variant]} ${className} ${
              error ? "border-red-700" : ""
            }`}
            autoComplete="off"
            required={isRequired}
            {...props}
          />
        )}
        {as === "textarea" && (
          <textarea
            className={`${styles[variant]} ${className} ${
              error ? "border-red-700" : ""
            }`}
            required={isRequired}
            {...props}
          />
        )}
        {type === "password" && as === "input" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 focus:outline-none"
          >
            {showPassword ? (
              <FaEyeSlash className="text-gray-400" />
            ) : (
              <FaEye className="text-gray-400" />
            )}
          </button>
        )}
        {icon && iconPosition === "right" && (
          <span className="absolute right-3 text-gray-400">{icon}</span>
        )}
      </div>
      {props.subtext && (
        <span className={`text-xs ${error ? "text-red-700" : "text-gray-500"}`}>
          {props.subtext}
        </span>
      )}
    </div>
  );
};

export default FormControl;
