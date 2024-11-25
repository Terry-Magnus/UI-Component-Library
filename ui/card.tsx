type CardProps = {
  title?: string;
  content?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
};

const Card = ({ children, ...props }: CardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {props.title && (
        <h3 className="text-lg font-semibold mb-2">{props.title}</h3>
      )}
      {props.content && <p className="text-gray-700 mb-4">{props.content}</p>}
      {children}
      {props.footer && <div className="border-t pt-2">{props.footer}</div>}
    </div>
  );
};

export default Card;
