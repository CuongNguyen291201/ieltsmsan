import { memo, useMemo } from 'react';
import { formatDateDMY } from '../../../utils';
import TopicTreeNode, { TopicNodeProps } from '../TopicTreeNode';
import './style.scss';
import OvalRecButton from '../../buttons/OvalRecButton';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducers';

const InnerTopicNode = (props: TopicNodeProps) => {
  const {
    topic,
    childs = [],
    isOpen = false,
    isTopicHasChild = false,
    isLoadChild = false,
    onClickNode = () => { },
    isLoadMoreChilds = false,
    loadMoreChildFC = () => {},
    category
  } = props;
  const isFinished = useMemo(() => (topic.topicProgress?.progress ?? 0) === 100, [topic]);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  return (
    <div className="inner-topic-node">
      <div className="inner-topic-header" onClick={onClickNode}>
        <div className="bullet-red-list">
          <i className="fas fa-circle" />
          <div className="topic-title">
            {topic.name}
          </div>
          <div className={`topic-progress${isFinished ? ' done' : ''}`}>
            {!!currentUser ? `: ${topic.topicProgress?.progress ?? 0}%` : ''}
          </div>
        </div>
        {!isOpen ? <div className="sub-title">{`Ngày phát hành: ${formatDateDMY(topic.startTime)}`}</div> : <div />}
        {isTopicHasChild && <i className={`fas fa-chevron-${isLoadChild ? 'up' : 'down'} toggle`} />}
      </div>

      <div className="inner-topic-content">
        {!!childs.length && isLoadChild && childs.map((e, i) => (
          <div style={{ marginLeft: '17px'}} key={e._id}>
            <TopicTreeNode category={category} topic={e} />
            {i === childs.length - 1 && isLoadMoreChilds && <div className="flex-center" style={{ margin: '12px 0' }}>
              <OvalRecButton
                title="TẢI THÊM"
                onClick={loadMoreChildFC}
                fontSize="10px"
              />
            </div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(InnerTopicNode);