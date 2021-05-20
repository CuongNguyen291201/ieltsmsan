import { CommentScopes } from '../../../custom-types';
import { Course } from '../../../sub_modules/share/model/courses';
import CommentPanel from '../../CommentPanel';
import Container2 from '../../containers/Container2';
import './style.scss';

const CourseContentView = (props: { course: Course }) => {
  const { course } = props;
  return (
    <div className="course-content-view">
      <div className="course-content">
        {course.shortDesc}
      </div>

      <Container2 title="Hoạt động gần đây">

      </Container2>

      <Container2 title="Bình luận">
        <CommentPanel commentScope={CommentScopes.COURSE} />
      </Container2>
    </div>
  )
}

export default CourseContentView;
