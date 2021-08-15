import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducers';
import { Course } from '../../../sub_modules/share/model/courses';
import TopicTree from '../TopicTree';
import './style.scss';

const CourseTopicTreeView = (props: { course: Course }) => {
  const { currentCategory } = useSelector((state: AppState) => state.categoryReducer);
  const { course } = props;
  return (
    <div className="main-topic">
      <TopicTree category={currentCategory} course={course} />
    </div>
  )
}

export default CourseTopicTreeView;
