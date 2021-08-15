import { useRouter } from 'next/router';
import { memo, useState } from 'react';
import { _Category } from '../../custom-types';
import itemAvatar from '../../public/default/item-avatar.png';
import { PAGE_CATEGORY_DETAIL } from '../../custom-types/PageType';
import { getBrowserSlug } from '../../utils/router';
import Container1 from '../containers/Container1';
import './style.scss';

const CategoryItem = (props: {
  category: _Category
}) => {
  const { category } = props;
  const router = useRouter()

  return (
    <Container1>
      <div className="cat-avatar" onClick={() => router.push(getBrowserSlug(category.slug, PAGE_CATEGORY_DETAIL, category._id))} >
        <img src={category.avatar || itemAvatar} alt={category.name} />
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
          {category.name}
        </div>

        <div className="cat-course-info">
          Khoá học: {category.totalCourses} khoá
        </div>
      </div>
    </Container1>
  )
}

export default memo(CategoryItem);