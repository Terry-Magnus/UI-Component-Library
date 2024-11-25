interface BoxProps {
  children?: React.ReactNode;
  className?: string;
  css?: React.CSSProperties;
}

const Box = ({ children, className, css }: BoxProps) => (
  <div style={css} className={className}>
    {children}
  </div>
);

export default Box;
