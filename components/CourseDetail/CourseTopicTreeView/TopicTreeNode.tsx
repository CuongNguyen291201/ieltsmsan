import moment from 'moment';
import { useRouter } from 'next/router';
import { useSnackbar } from "notistack";
import { Fragment, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _Topic } from '../../../custom-types';
import { MapExamType } from "../../../custom-types/MapContraint";
import releaseDate from '../../../public/images/icons/icon-release-date.png';
import iconIsDone from '../../../public/images/icons/isDone.png';
import iconLockLession from '../../../public/images/icons/lock-course.png';
import { setLoadMoreChildTopicsAction } from '../../../redux/actions/topic.action';
import { AppState } from '../../../redux/reducers';
import { response_status } from '../../../sub_modules/share/api_services/http_status';
import { STATUS_OPEN, TOPIC_CONTENT_TYPE_CARD, TOPIC_TYPE_CHILD_NONE, TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST, USER_ACTIVITY_LESSON, USER_ACTIVITY_WATCH_VIDEO } from '../../../sub_modules/share/constraint';
import { apiOffsetTopicsByParentId, apiUpdateTopicProgress } from '../../../utils/apis/topicApi';
import { apiUpdateTimeActivity } from '../../../utils/apis/userActivityApi';
import { getTopicPageSlug } from '../../../utils/router';
import TopicIcon from './TopicIcon';
import './topic-tree-node.scss';
import { getTopicShortDescription } from "./courseTopicTree.logic";

const LOAD_LIMIT = 40;
export type TopicNodeProps = {
  topic: _Topic;
  childs?: _Topic[];
  isLoadChild?: boolean;
  isTopicHasChild?: boolean;
  // isOpen?: boolean;
  onClickNode?: () => void;
  isLoadMoreChilds?: boolean;
  loadMoreChildFC?: () => void;
}

const TopicTreeNode = (props: { topic: _Topic; isMain?: boolean, }) => {
  const { topic, isMain = false, } = props;
  const { currentCourse, isJoinedCourse, userCourseLoading } = useSelector((state: AppState) => state.courseReducer);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { mapLoadMoreState } = useSelector((state: AppState) => state.topicReducer);
  const [topicOptions, setTopicOptions] = useState<{ childs: _Topic[], isLoadChild: boolean; }>({
    childs: [],
    isLoadChild: false
  });
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const {
    isTopicHasChild,
    isOverStartTime,
    isTopicOpen,
    isLessonHasContent,
  } = useMemo(() => {
    const isTopicHasChild = topic.childType !== TOPIC_TYPE_CHILD_NONE && topic.type === TOPIC_TYPE_LESSON;
    return {
      isTopicHasChild,
      isOverStartTime: !!topic.isOverStartTime,
      // isOpen: !isTopicHasChild && topic.startTime === 0 || (getTimeZeroHour() >= topic.startTime),
      isTopicOpen: topic.status === STATUS_OPEN,
      isLessonHasContent: topic.description || topic.videoUrl,
    };
  }, [topic]);

  const fetchChildTopicsFC = async () => {
    const { data, status } = await apiOffsetTopicsByParentId({
      parentId: topic._id,
      courseId: currentCourse._id ?? topic.courseId,
      field: 'orderIndex',
      limit: LOAD_LIMIT,
      // lastRecord: topicOptions.childs[topicOptions.childs.length - 1],
      skip: topicOptions.childs.length,
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
    if (isTopicHasChild) {
      if (!isLessonHasContent) {
        return;
      } else {
        router.push(getTopicPageSlug({ topic }));
        return;
      }
    } else if (!isOverStartTime && topic.startTime > 0) {
      enqueueSnackbar("Bài học chưa được phát hành.", { variant: "info" });
      return;
    } else {
      if (isJoinedCourse) {
        updateTopicProgressFC();
        updateTimeActivityFC();
      }
      router.push(getTopicPageSlug({ topic }));
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

  return (
    <div className="main-topic-node">
      <div className="topic-header">

        <div>
          <div className="topic-title">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {isTopicHasChild
                  ? <i className={`fas fa-chevron-down ${topicOptions.isLoadChild ? ' open' : 'close'} toggle-main`} onClick={fetchChildTopics} />
                  : <i className="toggle-main isStatusDone" />}
                <TopicIcon topicType={topic.type} isMain={true} topicVideoUrl={topic.videoUrl} isTopicOpen={topic.status === STATUS_OPEN} />
              </div>
              <div className="icon-lock-course"><img src={iconLockLession} alt="iconLockLession" /></div>
            </div>

            <div style={{ width: "100%" }} onClick={onClickNode}>
              <div>
                <div style={{ fontWeight: isMain ? 700 : 500 }}>{topic.name}</div>
              </div>
              <div className="sort__">
                {getTopicShortDescription(topic)}
                <div className="relaseDate">
                  {topic.startTime > 0 && !topic.isOverStartTime && <><img src={releaseDate} alt="releaseDate" />{`${moment(topic.startTime).format('HH:mm DD/MM/YYYY')}`}</>}
                </div>
              </div>
            </div>
          </div>

        </div>

        {!!topic.topicProgress && isMain
          && <div className="accomplished" style={{ display: topic.type === TOPIC_TYPE_TEST && typeof topic.score === 'undefined' ? 'none' : 'inherit' }}>
            {topic.type !== TOPIC_TYPE_TEST
              ? <div>{topic.topicProgress.progress}%</div>
              : <div>{typeof topic.score !== 'undefined' ? `${topic.score} điểm` : ''}</div>}
          </div>}

        {!isMain && <div className="sub-title"><div className="icon-isDone">
          {topic.topicProgress?.progress >= 100 && <img src={iconIsDone} alt="iconIsDone" />}</div></div>}
      </div>

      <div className="main-topic-content">
        {!!topicOptions.childs.length && topicOptions.isLoadChild && topicOptions.childs.map((e, i) => (
          <Fragment key={e._id}>
            <div className="item-main-topic-content">
              {isMain ? <div className="line-sep" /> : <></>}
              {isTopicHasChild && <div className="wraper-topic-child"><TopicTreeNode topic={e} /></div>}

              {i === topicOptions.childs.length - 1 && mapLoadMoreState[topic._id] && <div className="flex-center" style={{ margin: '12px 0' }}>
                <div className="load-more-button" onClick={loadMoreChilds}>
                  <span>
                    Tải thêm bài học
                  </span>
                </div>
              </div>}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
};

export default TopicTreeNode;