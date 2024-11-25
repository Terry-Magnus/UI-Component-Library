type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const Container: React.FC<ContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`h-screen flex items-center ${className}`}>{children}</div>
  );
};

export default Container;
