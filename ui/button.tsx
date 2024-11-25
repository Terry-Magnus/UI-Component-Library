type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingtext?: string;
  isDisabled?: boolean;
  children: React.ReactNode;
  className?: string;
};

const baseClasses =
  "font-medium rounded focus:outline-none focus:ring transition";

const variantClasses: Record<string, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
  outline:
    "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

const Button = ({
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
  isDisabled = false,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${className} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isLoading ? props.loadingtext : children}
    </button>
  );
};

export default Button;
