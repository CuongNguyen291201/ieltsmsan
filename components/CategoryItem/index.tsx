import Container1 from '../containers/Container1'
import itemAvatar from '../../public/default/item-avatar.png';
import { memo } from 'react';
import './style.scss';
import { ICategory } from '../../sub_modules/share/model/category_ts';
import { CATEGORY_DETAIL_PAGE_TYPE } from '../../sub_modules/share/constraint';
import { useRouter } from 'next/router';
interface OtsvCategory extends ICategory {
  totalCourses?: number
}
const CategoryItem = (props: {
  theCategory: OtsvCategory
}) => {
  const { theCategory } = props;
  const router = useRouter()
  return (
    <Container1>
      <div className="cat-avatar" onClick={() => { router.push(`/${theCategory.slug}-${CATEGORY_DETAIL_PAGE_TYPE}-${theCategory._id}`) }} >
        <img src={theCategory.avatar || itemAvatar} alt={theCategory.name} />
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
          {theCategory.name}
        </div>

        <div className="cat-course-info">
          Khoá học: {theCategory.totalCourses} khoá
        </div>
      </div>
    </Container1>
  )
}

export default memo(CategoryItem);