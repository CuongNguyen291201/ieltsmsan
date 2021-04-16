import { Fragment, useEffect, useMemo } from 'react';
import { HomeCategory } from '../../custom-types';
import CategoryItem from '../CategoryItem';
import GridTemplate1 from '../grid/GridTemplate1';
import SectionLabel from '../SectionLabel';
import './style.scss';

const HomeCategorySection = (props: { categories?: HomeCategory[] }) => {
  const { categories = [] } = props;
  const sectionRows = useMemo(() => {
    const r = Math.ceil(categories.length / 4);
    return r === 0 ? 1 : r;
  }, [categories]);

  useEffect(() => {
    const sectionBgr = document.getElementById('main-category-bgr');
    const containerCategoryItem = document.getElementsByClassName('container-1')[0];
    if (!containerCategoryItem) return;
    const sectionBgrHeight = sectionBgr.offsetHeight;
    const containersHeight = containerCategoryItem.clientHeight * sectionRows;
    if (sectionBgr) {
      let rad = 0;
      if (containersHeight > sectionBgrHeight) {
        rad = Math.atan(((containersHeight - sectionBgrHeight) / 2) / (containerCategoryItem.clientWidth * 2));
      }
      // sectionBgr.style.width = '100%';
      sectionBgr.style.transform = `translate(-50%, -50%) rotate(-${rad}rad)`;
    }
  }, [categories])
  return (
    <div className="main-category-section">
      <div className="section-title">
        ĐA DẠNG CÁC TRƯỜNG
      </div>
      <div className="section-subtitle">
        Đa dạng các trường cho bạn lựa chọn. Giúp việc học trở lên dễ dàng hơn
      </div>

      <div className="section-main">
        <div id="main-category-bgr" className="section-bgr" />
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

      <SectionLabel />
    </div>
  )
}

export default HomeCategorySection;