import { TOPIC_TYPE_LESSON } from '../../sub_modules/share/constraint';
import StudyInfoView from './StudyInfoView';
import LessonInfoView from './LessonInfoView';
import './style.scss';

const TopicDetail = (props: { topic: any }) => {
  const { topic } = props;
  return (
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