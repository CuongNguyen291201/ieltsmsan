import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import exerciseIcon from '../../public/icon/exercise-icon.svg';
import lessonIcon from '../../public/icon/lesson-icon.svg';
import testIcon from '../../public/icon/test-icon.svg';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import { TOPIC_DETAIL_PAGE_TYPE, TOPIC_TYPE_CHILD_NONE, TOPIC_TYPE_EXERCISE, TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import { getBrowserSlug } from '../../utils';
import { apiGetTopicsByParentId } from '../../utils/apis/topicApi';

const TopicTreeNode = (props: { topic: any; }) => {
  const { topic } = props;
  const { currentCourse } = useSelector((state: AppState) => state.courseReducer);
  const { currentUser, callbackType } = useSelector((state: AppState) => state.userReducer);
  const [topicOptions, setTopicOptions] = useState({
    childs: [],
    isLoadChild: false
  });
  const router = useRouter();
  const dispatch = useDispatch();

  const { isTopicHasChild, topicIcon } = useMemo(() => {
    let topicIcon = '';
    if (topic.type === TOPIC_TYPE_LESSON) topicIcon = lessonIcon;
    else if (topic.type === TOPIC_TYPE_EXERCISE) topicIcon = exerciseIcon;
    else if (topic.type === TOPIC_TYPE_TEST) topicIcon = testIcon;
    return {
      isTopicHasChild: topic.childType !== TOPIC_TYPE_CHILD_NONE && topic.type === TOPIC_TYPE_LESSON,
      topicIcon
    }
  }, [topic]);

  const fetchChildTopics = async () => {
    if (!topicOptions.isLoadChild) {
      const { data, status } = await apiGetTopicsByParentId({ parentId: topic._id, courseId: currentCourse._id });
      if (status === response_status_codes.success) setTopicOptions({ ...topicOptions, childs: data, isLoadChild: true });
    } else if (topicOptions.isLoadChild) setTopicOptions({ ...topicOptions, isLoadChild: false });
  };

  const onClickNode = () => {
    if (!currentCourse) return;
    if (isTopicHasChild) return fetchChildTopics();
    else {
      if (!currentUser) {
        dispatch(showLoginModalAction(true));
        return;
      }
      const topicDetailSlug = getBrowserSlug(topic.slug, TOPIC_DETAIL_PAGE_TYPE, topic._id);
      router.push(topicDetailSlug);
    }
  }

  return (
    <>
      <div className="topic-item" onClick={() => onClickNode()}>
        <div className="topic-title">
          <img className="topic-icon" src={topicIcon} alt={topic.nam} />
          {topic.name}
        </div>
        {
          isTopicHasChild && <i className={`fas fa-chevron-${topicOptions.isLoadChild ? 'down' : 'left'}`} />
        }
      </div>

      {
        topicOptions.isLoadChild && topicOptions.childs.map((e) => (
          <div style={{ marginLeft: '15px' }} key={e._id}>
            <TopicTreeNode topic={e} />
          </div>
        ))
      }
    </>
  );
};

export default TopicTreeNode;