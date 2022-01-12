import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopicsAction, fetchCourseSectionsAction } from "../../../redux/actions/topic.action";
import { AppState } from "../../../redux/reducers";
import { COURSE_TYPE_SECTION } from "../../../sub_modules/share/constraint";
import { Course } from '../../../sub_modules/share/model/courses';
import SectionTree from "./SectionTree";
import './style.scss';
import TopicTree from './TopicTree';

const LOAD_LIMIT = 50;

const CourseTopicTreeView = () => {
  const course = useSelector((state: AppState) => state.courseReducer.currentCourse);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser);

  useEffect(() => {
    if (course.type === COURSE_TYPE_SECTION) {
      dispatch(fetchCourseSectionsAction({ courseId: course._id, userId: currentUser?._id }));
    } else {
      dispatch(fetchTopicsAction({ courseId: course._id, parentId: null, limit: LOAD_LIMIT, field: 'orderIndex', userId: currentUser?._id, asc: true }));
    }
  }, [currentUser]);

  const renderTopicTree = () => {
    switch (course.type) {
      case COURSE_TYPE_SECTION:
        return <SectionTree />
      default:
        return <div className="course-topic-tree">
          <TopicTree loadLimit={LOAD_LIMIT} />
        </div>
    }
  }

  return (<>
    {renderTopicTree()}
  </>)
}

export default CourseTopicTreeView;
