import itemAvatar from '../../public/default/item-avatar.png';
import { Course } from '../../sub_modules/share/model/courses_ts';
import Container1 from '../containers/Container1';
import Ratings from '../Ratings';
import './style.scss';


const CourseItem = (props: { course: Course }) => {
  const { course } = props;

  return (
    <Container1>
      <div className="crs-avatar">
        <img src={course.avatar || itemAvatar} alt={course.name} />
      </div>

      <div className="crs-info">
        <div className="crs-title">
          {course.name}
        </div>

        <div className="crs-desc">
          {course.shortDesc}
        </div>

        <div className="crs-rating">
          <div className="crs-point">{String(4.6).replace('.', ',')}</div>
          <div className="vote-star">
            <Ratings point={4.6} />
          </div>
          <div className="crs-mem">({500})</div>
        </div>

        <div className="crs-price">
          <div className="crs-discount-price">{course.cost - course.discountPrice} VNĐ</div>
          {course.discountPrice !== 0 && <div className="crs-origin-price">{course.cost} VNĐ</div>}
        </div>

        <div className="btn-video">
          Video
        </div>
      </div>
    </Container1>
  )
}

export default CourseItem;
