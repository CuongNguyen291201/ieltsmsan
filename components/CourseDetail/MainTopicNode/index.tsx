import { Fragment, memo, useMemo } from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { STATUS_OPEN } from '../../../sub_modules/share/constraint';
import { formatDateDMY } from '../../../utils';
import OvalRecButton from '../../buttons/OvalRecButton';
import TopicIcon from '../TopicIcon';
import TopicTreeNode, { TopicNodeProps } from '../TopicTreeNode';
import iconClock from '../../../public/default/icon-clock.png';

import './style.scss';

const MainTopicNode = (props: TopicNodeProps) => {
  const {
    topic,
    childs = [],
    isLoadChild = false,
    isTopicHasChild = false,
    isOpen = true,
    onClickNode = () => { },
    isLoadMoreChilds,
    loadMoreChildFC = () => { },
    category
  } = props;

  const progress = useMemo(() => {
    return topic.topicProgress?.progress ?? 0;
  }, [topic]);
  return (
    <div className="main-topic-node">
      <div className="topic-header" onClick={onClickNode}>
        <div className="topic-title">
          <span className="isStatusDone"></span>{!isTopicHasChild && <TopicIcon topicType={topic.type} isMain={true} isTopicOpen={topic.status === STATUS_OPEN} />}
          {topic.name}
        </div>

        {!!topic.topicProgress
          // ? <CircularProgressbar
          //   value={progress}
          //   styles={buildStyles({
          //     pathColor: '#58bf80',
          //     trailColor: '#a1f3c1'
          //   })}
          //   text={`${progress}%`}
          //   className="topic-progress"
          // />
          ? <div className="accomplished"><div>{progress}%</div></div>
          : <div style={{ width: '40px', height: '40px' }} className="topic-progress" />
        }
        {!isOpen ? <div className="sub-title">{`Ngày phát hành: ${formatDateDMY(topic.startTime)}`}</div> : <div className="sub-title" />}
        {isTopicHasChild ? <i className={`fas fa-chevron-${isLoadChild ? 'up' : 'down'} toggle-main`} /> : <i className="toggle-main" />}
      </div>
      <div className="main-topic-content">
        {!!childs.length && isLoadChild && childs.map((e, i) => (
          <Fragment key={e._id}>
            <div className="item-main-topic-content">
              <div className="line-sep" />
              <TopicTreeNode category={category} topic={e} />
              {i === childs.length - 1 && isLoadMoreChilds && <div className="flex-center" style={{ margin: '12px 0' }}>
                <OvalRecButton
                  title="TẢI THÊM"
                  onClick={loadMoreChildFC}
                  fontSize="11px"
                />
              </div>}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(MainTopicNode);
