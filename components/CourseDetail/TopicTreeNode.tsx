import { message } from 'antd';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _Category, _Topic } from '../../custom-types';
import { setActiveCourseModalVisibleAction } from '../../redux/actions/course.actions';
import { setLoadMoreChildTopicsAction } from '../../redux/actions/topic.action';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { showToastifyWarning } from '../../sub_modules/common/utils/toastify';
import { response_status } from '../../sub_modules/share/api_services/http_status';
import { TOPIC_TYPE_CHILD_NONE, TOPIC_TYPE_LESSON, USER_ACTIVITY_LESSON, USER_ACTIVITY_WATCH_VIDEO } from '../../sub_modules/share/constraint';
import { getTimeZeroHour } from '../../utils';
import { apiSeekTopicsByParentId, apiUpdateTopicProgress } from '../../utils/apis/topicApi';
import { apiUpdateTimeActivity } from '../../utils/apis/userActivityApi';
import { getTopicPageSlug } from '../../utils/router';
import InnerTopicNode from './InnerTopicNode';
import LeafTopicNode from './LeafTopicNode';
import MainTopicNode from './MainTopicNode';

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

const TopicTreeNode = (props: { category: _Category; topic: _Topic; isMain?: boolean }) => {
  const { category, topic, isMain = false } = props;
  const { currentCourse, isJoinedCourse, userCourseLoading } = useSelector((state: AppState) => state.courseReducer);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { mapLoadMoreState } = useSelector((state: AppState) => state.topicReducer);
  const [topicOptions, setTopicOptions] = useState<{ childs: _Topic[], isLoadChild: boolean; }>({
    childs: [],
    isLoadChild: false
  });
  const router = useRouter();
  const dispatch = useDispatch();

  const { isTopicHasChild, isOpen } = useMemo(() => {
    const isTopicHasChild = topic.childType !== TOPIC_TYPE_CHILD_NONE && topic.type === TOPIC_TYPE_LESSON;
    return {
      isTopicHasChild,
      isOpen: !isTopicHasChild && topic.startTime === 0 || (getTimeZeroHour() >= topic.startTime),
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
      if (!isJoinedCourse) {
        if (!currentCourse.cost) {
          message.warning("Chưa tham gia khoá học");
          return;
        } else {
          dispatch(setActiveCourseModalVisibleAction(true));
          return;
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

  return (
    isMain
      ? <MainTopicNode
        topic={topic}
        childs={topicOptions.childs}
        isLoadChild={topicOptions.isLoadChild}
        isOpen={isOpen}
        isTopicHasChild={isTopicHasChild}
        onClickNode={onClickNode}
        isLoadMoreChilds={mapLoadMoreState[topic._id]}
        loadMoreChildFC={loadMoreChilds}
        category={category}
      />
      : (isTopicHasChild
        ? <InnerTopicNode
          topic={topic}
          childs={topicOptions.childs}
          isOpen={isOpen}
          isLoadChild={topicOptions.isLoadChild}
          isTopicHasChild={isTopicHasChild}
          onClickNode={onClickNode}
          isLoadMoreChilds={mapLoadMoreState[topic._id]}
          loadMoreChildFC={loadMoreChilds}
          category={category}
        />
        : <LeafTopicNode
          topic={topic}
          isOpen={isOpen}
          onClickNode={onClickNode}
        />)
  )
};

export default TopicTreeNode;