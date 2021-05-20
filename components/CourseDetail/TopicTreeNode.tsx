import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OtsvTopic } from '../../custom-types';
import exerciseIcon from '../../public/icon/exercise-icon.svg';
import lessonIcon from '../../public/icon/lesson-icon.svg';
import testIcon from '../../public/icon/test-icon.svg';
import { setLoadMoreChildTopicsAction } from '../../redux/actions/topic.action';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { showToastifyWarning } from '../../sub_modules/common/utils/toastify';
import { response_status } from '../../sub_modules/share/api_services/http_status';
import { TOPIC_DETAIL_PAGE_TYPE, TOPIC_TYPE_CHILD_NONE, TOPIC_TYPE_EXERCISE, TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import Topic from '../../sub_modules/share/model/topic';
import { formatDateDMY, getBrowserSlug, getTimeZeroHour } from '../../utils';
import { apiSeekTopicsByParentId } from '../../utils/apis/topicApi';

const LOAD_LIMIT = 20;

const TopicTreeNode = (props: { topic: OtsvTopic; }) => {
  const { topic } = props;
  const { currentCourse } = useSelector((state: AppState) => state.courseReducer);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { mapLoadMoreState } = useSelector((state: AppState) => state.topicReducer);
  const [topicOptions, setTopicOptions] = useState<{ childs: OtsvTopic[], isLoadChild: boolean; }>({
    childs: [],
    isLoadChild: false
  });
  const router = useRouter();
  const dispatch = useDispatch();

  const { isTopicHasChild, topicIcon, isOpen } = useMemo(() => {
    let topicIcon = '';
    if (topic.type === TOPIC_TYPE_LESSON) topicIcon = lessonIcon;
    else if (topic.type === TOPIC_TYPE_EXERCISE) topicIcon = exerciseIcon;
    else if (topic.type === TOPIC_TYPE_TEST) topicIcon = testIcon;
    const isTopicHasChild = topic.childType !== TOPIC_TYPE_CHILD_NONE && topic.type === TOPIC_TYPE_LESSON;
    return {
      isTopicHasChild,
      topicIcon,
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
    if (status === response_status.success) return data as Topic[];
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
      dispatch(setLoadMoreChildTopicsAction({ topicId: topic._id, isLoadMore: (data as Topic[]).length >= LOAD_LIMIT }));
    } else if (topicOptions.isLoadChild) setTopicOptions({ ...topicOptions, isLoadChild: false });
  };

  const onClickNode = () => {
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
      const topicDetailSlug = getBrowserSlug(topic.slug, TOPIC_DETAIL_PAGE_TYPE, topic._id);
      router.push({ pathname: topicDetailSlug, query: { root: router.query.root } });
    }
  };

  return (
    <>
      <div className="topic-item" onClick={() => onClickNode()}>
        <div className="topic-title">
          <img className="topic-icon" src={topicIcon} alt={topic.name} />
          {topic.name}
          {!isOpen && <span className="sub-title">{`Ngày phát hành: ${formatDateDMY(topic.startTime)}`}</span>}
        </div>
        <div className="right">
          <div className="topic-progress">
            -
          </div>
          {
            isTopicHasChild && <i className={`fas fa-chevron-${topicOptions.isLoadChild ? 'left' : 'down'}`} />
          }
        </div>
      </div>

      {
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
      }
    </>
  );
};

export default TopicTreeNode;