import { useRouter } from 'next/router';
import { memo, useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { message, Row, Col } from 'antd';
import { OtsvCategory } from '../../custom-types';
import itemAvatar from '../../public/default/item-avatar.png';
import { CATEGORY_DETAIL_PAGE_TYPE } from '../../sub_modules/share/constraint';
import { getBrowserSlug, numberFormat } from '../../utils';
import Container1 from '../containers/Container1';
import './style.scss';
import Modal from '@material-ui/core/Modal';
import { setCourseOrderAction } from '../../redux/actions/course.actions';
import { Course } from '../../sub_modules/share/model/courses';
import Backdrop from '@material-ui/core/Backdrop';
import { Dialog, DialogTitle } from '@material-ui/core';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { COURSE_DETAIL_PAGE_TYPE } from '../../sub_modules/share/constraint';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

const PopupShowQuickView = (props: {
  category?: OtsvCategory,
  showPopup: boolean,
  showPopupFunction: Function,
  course: Course
}) => {
  const { category, showPopup, showPopupFunction, course } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const courseBrowserSlug = useMemo(() => getBrowserSlug(course.slug, COURSE_DETAIL_PAGE_TYPE, course._id), [course]);
  const onClickItem = useCallback(() => {
    router.push({ pathname: courseBrowserSlug, query: { root: category?._id ?? '' } });
  }, [course]);


  const onChangeOrder = (value) => {
    const dataArr = localStorage.getItem('courseIds') ? localStorage.getItem('courseIds').split(',') : []
    if (value && !dataArr.find(item => item === value)) {
      dispatch(setCourseOrderAction(value));
      dataArr.push(value)
      localStorage.setItem('courseIds', dataArr.join())
      message.success('Đã thêm vào giỏ hàng!');
    } else {
      message.warning('Khóa học đã có trong giỏ hàng');
    }
    showPopupFunction()
  }

  return (
    <div>
      <Dialog
        closeAfterTransition={true}
        open={showPopup}
        onClose={() => showPopupFunction()}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        aria-label="close"
      >
        <div className="popup-show-info-course">
          <div className="title-course">
            {course.name}
          </div>
          <Row className="popup-show-infor">
            <Col xs={24} sm={24} md={12} lg={12} xl={12} className="order-item">
              <div className="image-course">
                <img src={course.avatar || itemAvatar} alt={course.name} />
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} className="order-item">
              <div className="infor-course">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="tag-video-course">
                    <PlayCircleOutlineIcon />  Khoá học Video Online
                  </div>
                  <div> 180 Ngày</div>
                </div>
                <Row className="price-course">
                  <Col xs={24} sm={24} md={16} lg={16} xl={16} style={{ display: "contents" }}>
                    <LocalOfferIcon />
                    <div className="crs-discount-price">
                      {numberFormat.format(course.cost - course.discountPrice)} VNĐ
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    {course.discountPrice !== 0 && <div className="crs-origin-price">{numberFormat.format(course.cost)} VNĐ</div>}
                  </Col>
                </Row>
                <div className="item">
                  Tổng số học viên: <span>22 học viên </span>
                </div>
                <div className="item">
                  Số bài học: <span>22 </span>
                </div>
                <div className="item">
                  Ngôn ngữ:  <span>Tiếng Việt</span>
                </div>

                <div className="detail-course item" onClick={onClickItem}>Xem chi tiết</div>
              </div>
            </Col>
          </Row>
          <div className="des-course">{course.shortDesc}</div>
          <div className="optional">
            <button onClick={() => onChangeOrder(course?._id)}>Thêm vào giỏ hàng</button>
            <button
              onClick={() => router.push({
                pathname: 'course-pay',
                query: { courseIds: course?._id }
              })}
            >Mua Khoá học</button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default memo(PopupShowQuickView);