import { Paper } from "@material-ui/core";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo, useMemo } from 'react';
import { _Category } from '../../custom-types';
import { PAGE_CATEGORY_DETAIL } from '../../custom-types/PageType';
import itemAvatar from '../../public/default/item-avatar.png';
import { getBrowserSlug, getCategorySlug } from '../../utils/router';
import './style.scss';

const CategoryItem = (props: {
  category: _Category
}) => {
  const { category } = props;
  const router = useRouter();
  const categorySlug = useMemo(() => getCategorySlug({ category }), [category]);

  return (
    <Link href={categorySlug} passHref>
      <a onClick={(e) => { e.preventDefault(); }} className="plain-anchor-tag">
        <Paper elevation={5}>
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
        </Paper>
      </a>
    </Link>
  )
}

export default memo(CategoryItem);