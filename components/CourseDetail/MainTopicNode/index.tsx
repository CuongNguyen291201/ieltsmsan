import { OtsvTopic } from '../../../custom-types';
import './style.scss';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { memo, useMemo } from 'react';
import { formatDateDMY, getTimeZeroHour } from '../../../utils';
import { TOPIC_TYPE_CHILD_NONE, TOPIC_TYPE_LESSON } from '../../../sub_modules/share/constraint';
import TopicTreeNode from '../TopicTreeNode';

const MainTopicNode = (props: {
  topic: OtsvTopic;
  childs?: OtsvTopic[];
  isLoadChild?: boolean;
  isTopicHasChild?: boolean;
  isOpen?: boolean;
  onClickNode?: () => void
}) => {
  const {
    topic,
    childs = [],
    isLoadChild = false,
    isTopicHasChild = false,
    isOpen = true,
    onClickNode = () => { }
  } = props;

  const progress = useMemo(() => {
    return topic.topicProgress?.progress ?? 0
  }, [topic]);
  return (
    <div className="main-topic-node">
      <div className="topic-header" onClick={onClickNode}>
        <div className="topic-title">
          {topic.name}
        </div>

        <div className="topic-info">
          {!!topic.topicProgress
            && <CircularProgressbar
              value={progress}
              styles={buildStyles({
                pathColor: '#58bf80',
                trailColor: '#a1f3c1'
              })}
              text={`${progress}%`}
              className="topic-progress"
            />}
          {!isOpen ? <div className="sub-title">{`Ngày phát hành: ${formatDateDMY(topic.startTime)}`}</div> : <div />}
          {isTopicHasChild && <i className={`fas fa-chevron-${isLoadChild ? 'up' : 'down'} toggle-main`} />}
        </div>
      </div>
      {!!childs.length && isLoadChild && childs.map((e) => (
        <div style={{ marginLeft: '15px' }} key={e._id}>
          <TopicTreeNode topic={e} />
        </div>
      ))}
    </div>
  )
}

export default memo(MainTopicNode);
