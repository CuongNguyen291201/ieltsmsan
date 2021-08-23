import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommentScopes } from '../../custom-types';
import { PAGE_COURSE_DETAIL } from '../../custom-types/PageType';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { setUserCourseAction } from '../../redux/actions/course.actions';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { getCookie, TOKEN } from '../../sub_modules/common/utils/cookie';
import { showToastifyWarning } from '../../sub_modules/common/utils/toastify';
import { TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import Topic from '../../sub_modules/share/model/topic';
import { getTimeZeroHour } from '../../utils';
import { apiGetUserCourse } from '../../utils/apis/courseApi';
import { canPlayTopic } from '../../utils/permission/topic.permission';
import { getBrowserSlug, ROUTER_NOT_FOUND } from '../../utils/router';
import CommentPanel from '../CommentPanel';
import PanelContainer from '../containers/PanelContainer';
import LessonInfoView from './LessonInfoView';
import StudyInfoView from './StudyInfoView';
import './style.scss';
import TopicRankingsView from './TopicRankingsView';

const TopicDetail = (props: { topic: Topic; }) => {
  const { topic } = props;
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { isJoinedCourse, userCourseLoading } = useSelector((state: AppState) => state.courseReducer);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!currentUser) {
      router.push({
        pathname: getBrowserSlug(topic.course.slug, PAGE_COURSE_DETAIL, topic.course._id),
        query: { root: router.query.root as string }
      });
      return;
    } else {
      const token = getCookie(TOKEN);
      apiGetUserCourse({ token, courseId: topic.courseId })
        .then((uc) => {
          dispatch(setUserCourseAction(uc));
        })
        .catch((e) => {
          showToastifyWarning("Có lỗi xảy ra!");
        })
    }
  }, [currentUser]);

  useEffect(() => {
    if (!userCourseLoading && !canPlayTopic({ topic, isJoinedCourse })) {
      router.push(ROUTER_NOT_FOUND);
    }
  }, [userCourseLoading]);

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