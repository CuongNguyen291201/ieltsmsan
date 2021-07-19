import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommentScopes } from '../../custom-types';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { COURSE_DETAIL_PAGE_TYPE, TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import Topic from '../../sub_modules/share/model/topic';
import { getBrowserSlug, getTimeZeroHour } from '../../utils';
import CommentPanel from '../CommentPanel';
import PanelContainer from '../containers/PanelContainer';
import LessonInfoView from './LessonInfoView';
import StudyInfoView from './StudyInfoView';
import './style.scss';
import TopicRankingsView from './TopicRankingsView';

const TopicDetail = (props: { topic: Topic; }) => {
  const { topic } = props;
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const router = useRouter();
  useEffect(() => {
    if (!currentUser) {
      router.push({
        pathname: getBrowserSlug(topic.course.slug, COURSE_DETAIL_PAGE_TYPE, topic.course._id),
        query: { root: router.query.root as string }
      });
      return;
    }
  }, [currentUser]);

  useEffect(() => {
    if (topic.startTime > getTimeZeroHour()) {
      router.back();
    }
  }, []);

  useScrollToTop();
  return !currentUser ? <></> : (
    <div className="topic-detail">
      <div className="container">
        <div className="topic-title">
          {topic.name}
        </div>

        <div className="short-description">
          {topic.shortDescription}
        </div>

        {
          topic.type === TOPIC_TYPE_LESSON
            ? <LessonInfoView topic={topic} />
            : <StudyInfoView topic={topic} />
        }
        {topic.type === TOPIC_TYPE_TEST && <PanelContainer title="Bảng xếp hạng">
          <TopicRankingsView topic={topic} />
        </PanelContainer>}

        <PanelContainer title="Bình luận">
          <CommentPanel commentScope={CommentScopes.TOPIC} />
        </PanelContainer>

      </div>
    </div>
  );
};

export default TopicDetail;