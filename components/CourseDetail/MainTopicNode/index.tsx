import { Fragment, memo, useMemo } from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { formatDateDMY } from '../../../utils';
import TopicIcon from '../TopicIcon';
import TopicTreeNode, { TopicNodeProps } from '../TopicTreeNode';
import './style.scss';

const MainTopicNode = (props: TopicNodeProps) => {
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
          {!isTopicHasChild && <TopicIcon topicType={topic.type} isMain={true} />}
          {topic.name}
        </div>

        <div className="topic-info">
          {!!topic.topicProgress
            ? <CircularProgressbar
              value={progress}
              styles={buildStyles({
                pathColor: '#58bf80',
                trailColor: '#a1f3c1'
              })}
              text={`${progress}%`}
              className="topic-progress"
            />
            : <div style={{ width: '40px', height: '40px' }} />
          }
          {!isOpen ? <div className="sub-title">{`Ngày phát hành: ${formatDateDMY(topic.startTime)}`}</div> : <div />}
          {isTopicHasChild && <i className={`fas fa-chevron-${isLoadChild ? 'up' : 'down'} toggle-main`} />}
        </div>
      </div>
      <div className="main-topic-content">
        {!!childs.length && isLoadChild && childs.map((e) => (
          <Fragment key={e._id}>
            <div className="line-sep" />
            <TopicTreeNode topic={e} />
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default memo(MainTopicNode);
