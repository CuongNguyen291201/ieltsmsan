import { Course } from '../../../sub_modules/share/model/courses';
import TopicTree from '../TopicTree';
import './style.scss';

const CourseTopicTreeView = (props: { course: Course }) => {
  const { course } = props;
  return (
    <div className="main-topic">
      <TopicTree course={course} />
    </div>
  )
}

export default CourseTopicTreeView;
