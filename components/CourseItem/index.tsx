import itemAvatar from '../../public/default/item-avatar.png';
import Container1 from '../containers/Container1';
import Ratings from '../Ratings';
import './style.scss';


const CourseItem = (props: {
  name?: string;
  avatar?: string;
  shortDesc?: string;
  point?: number;
  totalMembers?: number;
  cost?: number;
  discountPrice?: number;
}) => {
  const {
    name = 'Khoá học',
    avatar = '',
    shortDesc = 'Mô tả ngắn',
    point = 0,
    totalMembers = 0,
    cost = 0,
    discountPrice = 0
  } = props;

  return (
    <Container1>
      <div className="crs-avatar">
        <img src={avatar || itemAvatar} alt={name} />
      </div>

      <div className="crs-info">
        <div className="crs-title">
          {name}
        </div>

        <div className="crs-desc">
          {shortDesc}
        </div>

        <div className="crs-rating">
          <div className="crs-point">{String(point).replace('.', ',')}</div>
          <div className="vote-star">
            <Ratings point={point} />
          </div>
          <div className="crs-mem">({totalMembers})</div>
        </div>

        <div className="crs-price">
          <div className="crs-discount-price">{cost - discountPrice} VNĐ</div>
          {discountPrice !== 0 && <div className="crs-origin-price">{cost} VNĐ</div>}
        </div>

        <div className="btn-video">
          Video
        </div>
      </div>
    </Container1>
  )
}

export default CourseItem;
