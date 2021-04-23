import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { TOPIC_TYPE_LESSON } from '../../sub_modules/share/constraint';
import LessonInfoView from './LessonInfoView';
import StudyInfoView from './StudyInfoView';
import './style.scss';

const TopicDetail = (props: { topic: any }) => {
  const { topic } = props;
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!currentUser) {
      dispatch(showLoginModalAction(true));
      return;
    }
  }, [currentUser]);

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
      </div>
    </div>
  )
}

export default TopicDetail;