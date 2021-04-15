import Container1 from '../containers/Container1'
import itemAvatar from '../../public/default/item-avatar.png';
import { memo } from 'react';
import './style.scss';

const CategoryItem = (props: {
  title?: string; totalCourses?: number; avatarSrc?: string
}) => {
  const { title = 'Danh mục', totalCourses = 0, avatarSrc } = props;
  return (
    <Container1>
      <div className="cat-avatar">
        <img src={avatarSrc || itemAvatar} alt={title} />
        <div className="avatar-overlay">
          <div className="overlay-title">
            <span>
              Các khoá học
            </span>
            <i style={{ marginLeft: '10px' }} className="fas fa-arrow-right" />
          </div>
        </div>
      </div>

      <div className="cat-info">
        <div className="cat-title">
          {title}
        </div>

        <div className="cat-course-info">
          Khoá học: {totalCourses} khoá
        </div>
      </div>
    </Container1>
  )
}

export default memo(CategoryItem);