import { Tooltip } from '@material-ui/core';
import { Rate } from 'antd';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { _Category } from '../../custom-types';
import itemAvatar from '../../public/default/item-avatar.png';
import { Course } from '../../sub_modules/share/model/courses';
import { numberFormat } from '../../utils';
import orderUtils from '../../utils/payment/orderUtils';
import { getCoursePageSlug, ROUTER_PAYMENT } from '../../utils/router';
import Container1 from '../containers/Container1';
import PopupShowQuickView from '../popup-quick-view/index';
import './style.scss';



const CourseItem = (props: { category?: _Category; course: Course; ownCourse?: boolean }) => {
  const { category, course, ownCourse } = props;
  const router = useRouter();
  const onClickItem = useCallback(() => {
    router.push(getCoursePageSlug({ category, course }));
  }, [course]);
  const [showPopup, setShowPopup] = useState(false)
  const clickShowPopup = () => {
    setShowPopup(true)
  }
  const shortDesc = course.shortDesc;
  const nameCourse = course.name
  return (
    <Container1>
      <div className="crs-avatar">
        {/* <img src={course.avatar || itemAvatar} alt={course.name} /> */}
        <div className="hover-cat-item">
          <div className="image-corse-item_">
            <img src={course.avatar || itemAvatar} alt={course.name} />
          </div>
          <div className="button-hover-course-item">
            {ownCourse ?
              <button onClick={onClickItem}>Chi tiết khoá học</button>
              : (<>
                <button onClick={clickShowPopup}>Xem nhanh</button>
                <PopupShowQuickView showPopup={showPopup} course={course} showPopupFunction={() => {
                  setShowPopup(false)
                }} />
                {!!course.cost && <button
                  className="btn-hightlight"
                  onClick={() => {
                    orderUtils.setReturnUrl(router.asPath);
                    router.push({
                      pathname: ROUTER_PAYMENT,
                      query: { courseIds: course?._id }
                    })
                  }}
                >Mua ngay </button>}
              </>)
            }
          </div>
        </div>
      </div>
      <div className="crs-info" onClick={onClickItem}>
        {nameCourse.length > 40 ? <Tooltip title={nameCourse} placement="bottom">
          <div className="crs-title dot-1">{nameCourse} </div>
        </Tooltip> : <div className="crs-title dot-1">{nameCourse} </div>}
        {shortDesc.length > 60 ? <Tooltip title={shortDesc} placement="bottom">
          <div className="crs-desc dot-2">{shortDesc} </div>
        </Tooltip> : <div className="crs-desc dot-2">{shortDesc} </div>}
        <div className="crs-rating">
          <div className="crs-point">{String(4.6).replace('.', ',')}</div>
          <div className="vote-star">
            <Rate className="vote-rate" disabled allowHalf defaultValue={4.5} />
          </div>
          <div className="crs-mem">({500})</div>
        </div>

        <div className="crs-price">
          <div className="crs-discount-price">{!course.cost ? 'Free' : `${numberFormat.format(course.cost - course.discountPrice)} VNĐ`}</div>
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
