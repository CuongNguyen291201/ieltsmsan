import './style.scss';

const MainTopicIcon = (props: { iconSrc: string; }) => {
  const { iconSrc } = props;
  return (
    <div className="main-topic-icon">
      <img src={iconSrc} alt="topic-icon" className="main-icon" />
    </div>
  )
}

export default MainTopicIcon;
