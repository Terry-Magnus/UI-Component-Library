type TextProps = {
  variant?: "normal" | "bold" | "italic";
  size?: "xs" | "sm" | "base" | "md" | "lg" | "xl" | "2xl";
  color?: "gray" | "blue" | "red" | "green" | "yellow" | "black" | "white";
  children: React.ReactNode;
  className?: string;
};

const Text = ({
  variant = "normal",
  size = "base",
  color = "black",
  className = "",
  children,
}: TextProps) => {
  const variantClasses = {
    normal: "",
    bold: "font-bold",
    italic: "italic",
  };

  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    md: "text-md",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };

  const colorClasses = {
    gray: "text-gray-500",
    blue: "text-blue-500",
    red: "text-red-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
    black: "text-black",
    white: "text-white",
  };

  // Check if className contains a custom text size class
  const hasCustomSize = className
    .split(" ")
    .some((cls) => cls.startsWith("text-"));

  return (
    <p
      className={`${className} ${hasCustomSize ? "" : sizeClasses[size]} ${
        colorClasses[color]
      } ${variantClasses[variant]}`}
    >
      {children}
    </p>
  );
};

export default Text;
