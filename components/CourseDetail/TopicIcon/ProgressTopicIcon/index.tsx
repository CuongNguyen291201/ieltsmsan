import { memo } from 'react';
import doneIcon from '../../../../public/images/icons/done-icon.svg';
import './style.scss';

const ProgressTopicIcon = (props: { iconSrc?: string; isShowProgress?: boolean; progress?: number }) => {
  const { iconSrc = '', progress = 0, isShowProgress = true } = props;
  return (
    <div className="progress-topic-icon">
      {progress === 100 && <img src={doneIcon} className="done-icon"/>}
      <img src={iconSrc} alt="topic-icon" className="topic-icon" />
      {isShowProgress && (
        <>
          <div className="progress-background" />
          <div className="progress-value" style={{
            width: `${progress * 0.23}px`,
            background: progress === 100 ? 'green' : 'red'
          }} />
        </>
      )}
    </div>
  )
}

export default memo(ProgressTopicIcon);
