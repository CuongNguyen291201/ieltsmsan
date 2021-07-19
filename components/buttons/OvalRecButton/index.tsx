import './style.scss';

const OvalRecButton = (props: {
  title?: string;
  onClick?: () => void;
  iconClassName?: string;
  fontSize?: string;
  padding?: string;
}) => {
  const {
    title = 'Button',
    onClick = () => { },
    iconClassName,
    fontSize = '12px',
    padding = '10px'
  } = props;
  return (
    <div
      className="oval-rec-button"
      style={{ fontSize, padding }}
      onClick={onClick}
    >
      {title}
      {!!iconClassName && <i className={`${iconClassName} orb-icon`} />}
    </div>
  );
}

export default OvalRecButton;
