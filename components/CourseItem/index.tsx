import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { OtsvCategory } from '../../custom-types';
import itemAvatar from '../../public/default/item-avatar.png';
import { COURSE_DETAIL_PAGE_TYPE } from '../../sub_modules/share/constraint';
import { Course } from '../../sub_modules/share/model/courses';
import { getBrowserSlug, numberFormat } from '../../utils';
import Container1 from '../containers/Container1';
import PopupShowQuickView from '../popup-quick-view/index'
import Ratings from '../Ratings';
import './style.scss';


const CourseItem = (props: { category?: OtsvCategory; course: Course }) => {
  const { category, course } = props;
  const router = useRouter();
  const courseBrowserSlug = useMemo(() => getBrowserSlug(course.slug, COURSE_DETAIL_PAGE_TYPE, course._id), [course]);
  const onClickItem = useCallback(() => {
    router.push({ pathname: courseBrowserSlug, query: { root: category?._id ?? '' } });
  }, [course]);
  const [showPopup, setShowPopup] = useState(false)
  const clickShowPopup = () => {
    setShowPopup(true)
  }
  return (
    <Container1>
      <div className="crs-avatar">
        {/* <img src={course.avatar || itemAvatar} alt={course.name} /> */}
        <div className="hover-cat-item">
          <div className="image-corse-item_">
            <img src={category.avatar || itemAvatar} alt={category.name} />
          </div>
          <div className="button-hover-course-item">
            <button onClick={clickShowPopup}>Xem nhanh</button>
            <PopupShowQuickView showPopup={showPopup} course={course} showPopupFunction={() => {
              setShowPopup(false)
            }} />
            <button>Mua ngay </button>
          </div>
        </div>
      </div>
      <div className="crs-info" onClick={onClickItem}>
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
          <div className="crs-discount-price">{numberFormat.format(course.cost - course.discountPrice)} VNĐ</div>
          {course.discountPrice !== 0 && <div className="crs-origin-price">{numberFormat.format(course.cost)} VNĐ</div>}
        </div>
        <div className="btn-video">
          Video
        </div>
      </div>
    </Container1>
  )
}

export default CourseItem;
