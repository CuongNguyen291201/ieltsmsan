import itemAvatar from '../../public/default/item-avatar.png';
import { ICourse } from '../../sub_modules/share/model/courses_ts';
import Container1 from '../containers/Container1';
import Ratings from '../Ratings';
import './style.scss';


const CourseItem = (props: {
  courseItem: ICourse
}) => {
  const {
    courseItem
  } = props;

  return (
    <Container1>
      <div className="crs-avatar">
        <img src={courseItem.avatar || itemAvatar} alt={name} />
      </div>

      <div className="crs-info">
        <div className="crs-title">
          {courseItem.name}
        </div>

        <div className="crs-desc">
          {courseItem.shortDesc}
        </div>

        <div className="crs-rating">
          <div className="crs-point">{String(4.6).replace('.', ',')}</div>
          <div className="vote-star">
            <Ratings point={4.6} />
          </div>
          <div className="crs-mem">({500})</div>
        </div>

        <div className="crs-price">
          <div className="crs-discount-price">{courseItem.cost - courseItem.discountPrice} VNĐ</div>
          {courseItem.discountPrice !== 0 && <div className="crs-origin-price">{courseItem.cost} VNĐ</div>}
        </div>

        <div className="btn-video">
          Video
        </div>
      </div>
    </Container1>
  )
}

export default CourseItem;
