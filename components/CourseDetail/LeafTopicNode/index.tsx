import { memo } from 'react';
import { formatDateDMY } from '../../../utils';
import { TopicNodeProps } from '../TopicTreeNode';
import './style.scss';
import TopicIcon from '../TopicIcon';

const LeafTopicNode = (props: TopicNodeProps) => {
  const {
    topic,
    isOpen,
    onClickNode
  } = props;
  return (
    <>
      <div className="leaf-topic-node" onClick={onClickNode}>
        <div className="leaf-topic-header">
          <div className="topic-title">
            <TopicIcon topicType={topic.type} isMain={false} progress={topic.topicProgress?.progress ?? 0} />
            {topic.name}
          </div>
          <div className="topic-info">
            {!isOpen && <span className="sub-title">{`Ngày phát hành: ${formatDateDMY(topic.startTime)}`}</span>}
          </div>
        </div>
      </div>

      {/* {
        topicOptions.isLoadChild && topicOptions.childs.map((e, i) => (
          <div style={{ marginLeft: '15px' }} key={e._id}>
            <TopicTreeNode topic={e} />
            {i === topicOptions.childs.length - 1 && mapLoadMoreState[e._id] && <div
              className="load-more"
              onClick={() => fetchChildTopics()}
            >
              Tải thêm...
            </div>}
          </div>
        ))
      } */}
    </>
  );
};

export default memo(LeafTopicNode);
