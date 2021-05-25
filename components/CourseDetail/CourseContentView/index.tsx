import { Fragment, useEffect, useState } from 'react';
import { CommentScopes } from '../../../custom-types';
import CourseContent from '../../../sub_modules/share/model/courseContent';
import { Course } from '../../../sub_modules/share/model/courses';
import { UserActivity } from '../../../sub_modules/share/model/userActivity';
import { apiGetUserActivitiesByCourse } from '../../../utils/apis/userActivityApi';
import CommentPanel from '../../CommentPanel';
import Container2 from '../../containers/Container2';
import SanitizedDiv from '../../SanitizedDiv';
import UserActivityItem from '../UserActivityItem';
import './style.scss';

const CourseContentView = (props: { course: Course }) => {
  const { course } = props;
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  useEffect(() => {
    apiGetUserActivitiesByCourse({ courseId: course._id })
      .then((data) => setUserActivities(data));
  }, []);
  return (
    <div className="course-content-view">
      <SanitizedDiv className="course-content" content={(course.courseContent as CourseContent).desc} />

      <Container2 title="Hoạt động gần đây">
        <div className="recent-activity-wrap">
          {!!userActivities.length && userActivities.map((e, i) => (
            <Fragment key={e._id}>
              <UserActivityItem
                activity={e}
                dimBackground={(i % 2) === 0}
                isLastItem={i === userActivities.length - 1}
              />
            </Fragment>
          ))}
        </div>
      </Container2>

      <Container2 title="Bình luận">
        <CommentPanel commentScope={CommentScopes.COURSE} />
      </Container2>
    </div>
  )
}

export default CourseContentView;
