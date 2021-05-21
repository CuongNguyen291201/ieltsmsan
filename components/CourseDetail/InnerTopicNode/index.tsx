import { memo, useMemo } from 'react';
import { formatDateDMY } from '../../../utils';
import TopicTreeNode, { TopicNodeProps } from '../TopicTreeNode';
import './style.scss';

const InnerTopicNode = (props: TopicNodeProps) => {
  const {
    topic,
    childs = [],
    isOpen = false,
    isTopicHasChild = false,
    isLoadChild = false,
    onClickNode = () => { }
  } = props;
  const isFinished = useMemo(() => (topic.topicProgress?.progress ?? 0) === 100, [topic]);
  return (
    <div className="inner-topic-node">
      <div className="inner-topic-header" onClick={onClickNode}>
        <div className="bullet-red-list">
          <i className="fas fa-circle" />
          <div className="topic-title">
            {topic.name}
          </div>
          <div className={`topic-progress${isFinished ? ' done' : ''}`}>
            {`: ${topic.topicProgress?.progress ?? 0}%`}
          </div>
        </div>
        {!isOpen ? <div className="sub-title">{`Ngày phát hành: ${formatDateDMY(topic.startTime)}`}</div> : <div />}
        {isTopicHasChild && <i className={`fas fa-chevron-${isLoadChild ? 'up' : 'down'} toggle`} />}
      </div>

      <div className="inner-topic-content">
        {!!childs.length && isLoadChild && childs.map((e) => (
          <div style={{ marginLeft: '17px'}} key={e._id}>
            <TopicTreeNode topic={e} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(InnerTopicNode);