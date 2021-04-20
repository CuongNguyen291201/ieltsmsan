import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/reducers';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import { TOPIC_DETAIL_PAGE_TYPE, TOPIC_TYPE_CHILD_NONE, TOPIC_TYPE_EXERCISE, TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import { apiGetTopicsByParentId } from '../../utils/apis/topicApi';
import lessonIcon from '../../public/icon/lesson-icon.svg';
import exerciseIcon from '../../public/icon/exercise-icon.svg';
import testIcon from '../../public/icon/test-icon.svg';
import { getBrowserSlug } from '../../utils';
import { useRouter } from 'next/router';

const TopicTreeNode = (props: { topic: any; }) => {
  const { topic } = props;
  const { currentCourse } = useSelector((state: AppState) => state.courseReducer);
  const [topicOptions, setTopicOptions] = useState({
    childs: [],
    isLoadChild: false
  });
  const router = useRouter();

  const isTopicHasChild = useMemo(() => topic.childType !== TOPIC_TYPE_CHILD_NONE && topic.type === TOPIC_TYPE_LESSON, [topic]);
  const topicIcon = useMemo(() => {
    if (topic.type === TOPIC_TYPE_LESSON) return lessonIcon;
    else if (topic.type === TOPIC_TYPE_EXERCISE) return exerciseIcon;
    else if (topic.type === TOPIC_TYPE_TEST) return testIcon;
    return ''
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