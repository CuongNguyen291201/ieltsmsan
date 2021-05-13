import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommentScopes } from '../../custom-types';
import { fetchMainTopicsAction } from '../../redux/actions/topic.action';
import { AppState } from '../../redux/reducers';
import { Course } from '../../sub_modules/share/model/courses';
import CommentPanel from '../CommentPanel';
import PanelContainer from '../containers/PanelContainer';
import './style.scss';
import TopicTree from './TopicTree';

const CourseDetail = (props: { course: Course }) => {
  const { course } = props;
  const dispatch = useDispatch();
  const { mainTopicsLoading } = useSelector((state: AppState) => state.topicReducer);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  useEffect(() => {
    if (mainTopicsLoading) dispatch(fetchMainTopicsAction({ courseId: course._id, userId: currentUser?._id ?? null }));
  }, [mainTopicsLoading])

  return (
    <>
      <div className="container course-detail">
        <div className="course-title">
          {course.name}
        </div>

        <div className="course-info">
          <div className="section-heading">
            Thông tin khoá học
          </div>
          <div className="section-sp-line" />
          <div className="course-desc">
            {course.shortDesc}
          </div>

          <div className="section-heading">
            Danh sách bài học
          </div>
          <div className="section-sp-line" />
          <div className="main-topic">
            <TopicTree />
          </div>
        </div>

        <PanelContainer title="Hoạt động gần đây">

        </PanelContainer>

        <PanelContainer title="Bình luận">
          <CommentPanel commentScope={CommentScopes.COURSE} />
        </PanelContainer>
      </div>
    </>
  )
}

export default CourseDetail;
