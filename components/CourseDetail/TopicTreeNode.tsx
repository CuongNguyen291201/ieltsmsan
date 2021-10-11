import { message } from 'antd';
import { useRouter } from 'next/router';
import { Fragment, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _Category, _Topic } from '../../custom-types';
import { setActiveCourseModalVisibleAction } from '../../redux/actions/course.actions';
import { setLoadMoreChildTopicsAction } from '../../redux/actions/topic.action';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { showToastifyWarning } from '../../sub_modules/common/utils/toastify';
import { response_status } from '../../sub_modules/share/api_services/http_status';
import { STATUS_OPEN, TOPIC_TYPE_CHILD_NONE, TOPIC_TYPE_LESSON, USER_ACTIVITY_LESSON, USER_ACTIVITY_WATCH_VIDEO, USER_TYPE_HAS_ROLE } from '../../sub_modules/share/constraint';
import TopicProgress from '../../sub_modules/share/model/topicProgress';
import { getTimeZeroHour } from '../../utils';
import { apiSeekTopicsByParentId, apiUpdateTopicProgress } from '../../utils/apis/topicApi';
import { apiUpdateTimeActivity } from '../../utils/apis/userActivityApi';
import { getTopicPageSlug } from '../../utils/router';
import OvalRecButton from '../buttons/OvalRecButton';
import InnerTopicNode from './InnerTopicNode';
import LeafTopicNode from './LeafTopicNode';
import MainTopicNode from './MainTopicNode';
import { formatDateDMY } from '../../utils';
import TopicIcon from './TopicIcon';
import iconLockLession from '../../public/default/lock-course.png'
import iconIsDone from '../../public/default/isDone.png'
import releaseDate from '../../public/default/icon-release-date.png'
const LOAD_LIMIT = 20;
export type TopicNodeProps = {
  topic: _Topic;
  childs?: _Topic[];
  isLoadChild?: boolean;
  isTopicHasChild?: boolean;
  isOpen?: boolean;
  onClickNode?: () => void;
  isLoadMoreChilds?: boolean;
  loadMoreChildFC?: () => void;
  category?: _Category;
}

const TopicTreeNode = (props: { category: _Category; topic: _Topic; isMain?: boolean, }) => {
  const { category, topic, isMain = false, } = props;
  const { currentCourse, isJoinedCourse, userCourseLoading } = useSelector((state: AppState) => state.courseReducer);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { mapLoadMoreState } = useSelector((state: AppState) => state.topicReducer);
  const [topicOptions, setTopicOptions] = useState<{ childs: _Topic[], isLoadChild: boolean; }>({
    childs: [],
    isLoadChild: false
  });
  const router = useRouter();
  const dispatch = useDispatch();

  const { isTopicHasChild, isOpen, isTopicOpen } = useMemo(() => {
    const isTopicHasChild = topic.childType !== TOPIC_TYPE_CHILD_NONE && topic.type === TOPIC_TYPE_LESSON;
    return {
      isTopicHasChild,
      isOpen: !isTopicHasChild && topic.startTime === 0 || (getTimeZeroHour() >= topic.startTime),
      isTopicOpen: topic.status === STATUS_OPEN
    };
  }, [topic]);

  const fetchChildTopicsFC = async () => {
    const { data, status } = await apiSeekTopicsByParentId({
      parentId: topic._id,
      courseId: currentCourse._id ?? topic.courseId,
      field: 'orderIndex',
      limit: LOAD_LIMIT,
      lastRecord: topicOptions.childs[topicOptions.childs.length - 1],
      userId: currentUser?._id
    });
    if (status === response_status.success) return data as _Topic[];
    return [];
  };

  const fetchChildTopics = async () => {
    if (!topicOptions.isLoadChild) {
      const data = await fetchChildTopicsFC();
      setTopicOptions({
        ...topicOptions,
        childs: [...topicOptions.childs, ...data],
        isLoadChild: true,
      });
      dispatch(setLoadMoreChildTopicsAction({ topicId: topic._id, isLoadMore: (data as _Topic[]).length >= LOAD_LIMIT }));
    } else if (topicOptions.isLoadChild) setTopicOptions({ ...topicOptions, isLoadChild: false });
  };

  const updateTopicProgressFC = () => {
    if (topic.type === TOPIC_TYPE_LESSON && !isTopicHasChild && (topic.topicProgress?.progress ?? 0) < 100 && !topic.videoUrl) {
      apiUpdateTopicProgress({ topicId: topic._id, progress: 100, userId: currentUser._id });
    }
  }

  const updateTimeActivityFC = () => {
    if (topic.type === TOPIC_TYPE_LESSON) {
      apiUpdateTimeActivity({
        courseId: topic.courseId,
        type: !!topic.videoUrl ? USER_ACTIVITY_WATCH_VIDEO : USER_ACTIVITY_LESSON,
        itemId: topic._id,
        userId: currentUser._id
      });
    }
  }

  const onClickNode = () => {
    if (userCourseLoading) return;
    if (!currentCourse) return;
    if (isTopicHasChild) {
      return fetchChildTopics();
    } else if (!isOpen) {
      showToastifyWarning('Bài học chưa được phát hành.');
      return;
    } else {
      if (!currentUser) {
        dispatch(showLoginModalAction(true));
        return;
      }
      if (!isJoinedCourse && currentUser.userType !== USER_TYPE_HAS_ROLE) {
        if (!isTopicOpen) {
          if (!currentCourse.cost) {
            message.warning("Chưa tham gia khoá học");
            return;
          } else {
            dispatch(setActiveCourseModalVisibleAction(true));
            return;
          }
        }
      }
      updateTopicProgressFC();
      updateTimeActivityFC();
      router.push(getTopicPageSlug({ category, topic }));
    }
  };

  const loadMoreChilds = () => {
    fetchChildTopicsFC()
      .then((data) => {
        setTopicOptions({
          ...topicOptions,
          childs: [...topicOptions.childs, ...data],
        });
        dispatch(setLoadMoreChildTopicsAction({ topicId: topic._id, isLoadMore: (data as _Topic[]).length >= LOAD_LIMIT }));
      });
  }
  console.log('ismain', isMain);

  return (
    <div className="main-topic-node">
      <div className="topic-header" onClick={onClickNode}>
        <div>
          <div className="topic-title">
            {isTopicHasChild ? <i className={`fas fa-chevron-down ${topicOptions.isLoadChild ? ' open' : 'close'} toggle-main`} /> : <i className="toggle-main isStatusDone" />}
            <TopicIcon topicType={topic.type} isMain={true} topicVideoUrl={topic.videoUrl} isTopicOpen={topic.status === STATUS_OPEN} />
            {isMain ? <div className="sortdes-course"><span style={{ fontWeight: 600 }}>{topic.name}</span><div className="sort__">{topic.shortDescription ? topic.shortDescription : topic.topicExercise?.questionsNum}</div></div> : <div className="info-item-course">{topic.name} <div className="relaseDate"><span>{topic.shortDescription}</span><img src={releaseDate} alt="releaseDate" />{`${formatDateDMY(topic.startTime)}`}</div></div>}
          </div>
          {isMain ? <div className="icon-lock-course"><img src={iconLockLession} alt="iconLockLession" /></div> : ''}
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
          ? (isMain ? <div className="accomplished"><div>{topic.topicProgress.progress}%</div></div> : <div> </div>)
          : <div style={{ width: '40px', height: '40px' }} className="topic-progress"></div>
        }
        {!isMain ? <div className="sub-title">
          <div className="icon-isDone"><img src={iconIsDone} alt="iconIsDone" /></div>
        </div> : ''}
      </div>
      <div className="main-topic-content">
        {!!topicOptions.childs.length && topicOptions.isLoadChild && topicOptions.childs.map((e, i) => (
          <Fragment key={e._id}>
            <div className="item-main-topic-content">
              {isMain ? <div className="line-sep" /> : <></>}
              {isTopicHasChild && <div className="wraper-topic-child"><TopicTreeNode category={category} topic={e} /></div>}

              {i === topicOptions.childs.length - 1 && mapLoadMoreState[topic._id] && <div className="flex-center" style={{ margin: '12px 0' }}>
                <OvalRecButton
                  title="TẢI THÊM"
                  onClick={loadMoreChilds}
                  fontSize="11px"
                />
              </div>}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
    // isMain
    //   ? <MainTopicNode
    //     topic={topic}
    //     childs={topicOptions.childs}
    //     isLoadChild={topicOptions.isLoadChild}
    //     isOpen={isOpen}
    //     isTopicHasChild={isTopicHasChild}
    //     onClickNode={onClickNode}
    //     isLoadMoreChilds={mapLoadMoreState[topic._id]}
    //     loadMoreChildFC={loadMoreChilds}
    //     category={category}
    //   />
    //   : (isTopicHasChild
    //     ? <InnerTopicNode
    //       topic={topic}
    //       childs={topicOptions.childs}
    //       isOpen={isOpen}
    //       isLoadChild={topicOptions.isLoadChild}
    //       isTopicHasChild={isTopicHasChild}
    //       onClickNode={onClickNode}
    //       isLoadMoreChilds={mapLoadMoreState[topic._id]}
    //       loadMoreChildFC={loadMoreChilds}
    //       category={category}
    //     />
    //     : <LeafTopicNode
    //       topic={topic}
    //       isOpen={isOpen}
    //       onClickNode={onClickNode}
    //     />)
  )
};

export default TopicTreeNode;