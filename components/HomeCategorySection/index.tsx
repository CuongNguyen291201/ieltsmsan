import { Fragment } from 'react';
import { HomeCategory } from '../../custom-types';
import CategoryItem from '../CategoryItem';
import GridTemplate1 from '../grid/GridTemplate1';
import './style.scss';

const HomeCategorySection = (props: { categories?: HomeCategory[] }) => {
  const { categories = [] } = props;
  return (
    <div className="main-category-section">
      <div className="section-title">
        ĐA DẠNG CÁC TRƯỜNG
      </div>
      <div className="section-subtitle">
        Đa dạng các trường cho bạn lựa chọn. Giúp việc học trở lên dễ dàng hơn
      </div>

      <div className="section-main">
        <div className="section-bgr" />
        <div className="container">
          <GridTemplate1>
            {categories.map((e) => (
              <Fragment key={e._id}>
                <CategoryItem title={e.titleSEO || e.name} totalCourses={e.totalCourses ?? 0} avatarSrc={e.avatar} />
              </Fragment>
            ))}
          </GridTemplate1>
        </div>
      </div>
    </div>
  )
}

export default HomeCategorySection;