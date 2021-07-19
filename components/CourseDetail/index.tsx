import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux';
import { useScrollToTop } from '../../hooks/scrollToTop';
import bannerDefault from '../../public/default/banner-default.jpg';
import { AppState } from '../../redux/reducers';
import { Course } from '../../sub_modules/share/model/courses';
import { numberFormat } from '../../utils';
import Ratings from '../Ratings';
import CourseContentView from './CourseContentView';
import CourseTopicTreeView from './CourseTopicTreeView';
import './style.scss';

enum Tab {
  COURSE_CONTENT, COURSE_TOPIC_TREE
}

const CourseDetail = (props: { course: Course }) => {
  const { course } = props;
  const router = useRouter();
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const [activeTab, setActiveTab] = useState(Tab.COURSE_CONTENT);

  useEffect(() => {
    if (currentUser && router.query?.activeTab) {
      setActiveTab(Tab.COURSE_CONTENT);
    } else {
      setActiveTab(currentUser ? Tab.COURSE_TOPIC_TREE : Tab.COURSE_CONTENT);
    }
  }, [currentUser]);

  useScrollToTop();
  return (
    <>
      <div className="course-info" style={{
        background: `linear-gradient(90deg, #f9f9f9 30.75%, rgba(255, 255, 255, 0) 58.72%), url(${course.avatar || bannerDefault})`
      }}>
        <div className="container">
          <div className="title">{course.name}</div>
          <div className="short-desc">{course.shortDesc}</div>
          <div className="rating-section">
            <div className="rating-point">
              {String(4.6).replace('.', ',')}
            </div>
            <div className="rating-star">
              <Ratings point={4.6} />
            </div>
            <div className="rating-count">({500})</div>
          </div>
          <div className="price">
            <div className="discount-price">{numberFormat.format(course.cost - course.discountPrice)} VNĐ</div>
            {course.discountPrice !== 0 && <div className="origin-price">{numberFormat.format(course.cost)} VNĐ</div>}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="course-detail">
          <div className="tab-header">
            <div
              className={`tab-title${activeTab === Tab.COURSE_CONTENT ? ' active' : ''}`}
              onClick={() => setActiveTab(Tab.COURSE_CONTENT)}
            >
              MÔ TẢ KHOÁ HỌC
            </div>
            <div
              className={`tab-title${activeTab === Tab.COURSE_TOPIC_TREE ? ' active' : ''}`}
              onClick={() => setActiveTab(Tab.COURSE_TOPIC_TREE)}
            >
              DANH SÁCH BÀI HỌC
            </div>
          </div>
          {
            activeTab === Tab.COURSE_CONTENT ? <CourseContentView course={course} /> : <CourseTopicTreeView course={course} />
          }
        </div>
      </div>
    </>
  )
}

export default CourseDetail;
