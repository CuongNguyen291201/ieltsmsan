import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { OtsvCategory } from '../../custom-types';
import itemAvatar from '../../public/default/item-avatar.png';
import { COURSE_DETAIL_PAGE_TYPE } from '../../sub_modules/share/constraint';
import { Course } from '../../sub_modules/share/model/courses_ts';
import { getBrowserSlug, numberFormat } from '../../utils';
import Container1 from '../containers/Container1';
import Ratings from '../Ratings';
import './style.scss';


const CourseItem = (props: { category?: OtsvCategory; course: Course }) => {
  const { category, course } = props;
  const router = useRouter();
  const courseBrowserSlug = useMemo(() => getBrowserSlug(course.slug, COURSE_DETAIL_PAGE_TYPE, course._id), [course]);
  const onClickItem = useCallback(() => {
    router.push({ pathname: courseBrowserSlug, query: { root: category?._id ?? '' } });
  }, [course]);

  return (
    <Container1>
      <div className="crs-avatar" onClick={onClickItem}>
        <img src={course.avatar || itemAvatar} alt={course.name} />
      </div>
      <div className="crs-info">
        <div className="crs-title" onClick={onClickItem}>
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
