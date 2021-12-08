import { Dialog, Grid, Backdrop } from '@mui/material';
import { LocalOffer, PlayCircleOutline } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { memo, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { _Category } from '../../custom-types';
import { PAGE_COURSE_DETAIL } from '../../custom-types/PageType';
import itemAvatar from '../../public/images/icons/item-avatar.png';
import { createOneAction } from '../../redux/actions';
import { Scopes } from '../../redux/types';
import { Course } from '../../sub_modules/share/model/courses';
import { numberFormat } from '../../utils';
import orderUtils from '../../utils/payment/orderUtils';
import { getBrowserSlug, ROUTER_PAYMENT } from '../../utils/router';
import './style.scss';

const PopupShowQuickView = (props: {
  category?: _Category,
  showPopup: boolean,
  showPopupFunction: Function,
  course: Course
}) => {
  const { category, showPopup, showPopupFunction, course } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const courseBrowserSlug = useMemo(() => getBrowserSlug(course.slug, PAGE_COURSE_DETAIL, course._id), [course]);
  const onClickItem = useCallback(() => {
    router.push({ pathname: courseBrowserSlug, query: { root: category?._id ?? '' } });
  }, [course]);


  const onChangeOrder = (courseId: string) => {
    orderUtils.addCourseToCart(courseId, () => {
      dispatch(createOneAction(Scopes.CART, courseId));
    })
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
          <Grid container className="popup-show-infor">
            <Grid item xs={12} md={6} className="order-item">
              <div className="image-course">
                <img src={course.avatar || itemAvatar} alt={course.name} />
              </div>
            </Grid>
            <Grid item xs={12} md={6} className="order-item">
              <div className="infor-course">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="tag-video-course">
                    <PlayCircleOutline />  Khoá học Video Online
                  </div>
                  <div> 180 Ngày</div>
                </div>
                <Grid container className="price-course">
                  <Grid item xs={12} md={8} style={{ display: "contents" }}>
                    <LocalOffer />
                    <div className="crs-discount-price">
                      {numberFormat.format(course.cost - course.discountPrice)} VNĐ
                    </div>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {course.discountPrice !== 0 && <div className="crs-origin-price">{numberFormat.format(course.cost)} VNĐ</div>}
                  </Grid>
                </Grid>
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
            </Grid>
          </Grid>
          <div className="des-course">{course.shortDesc}</div>
          <div className="optional">
            <button onClick={() => onChangeOrder(course?._id)}>Thêm vào giỏ hàng</button>
            <button
              onClick={() => router.push({
                pathname: ROUTER_PAYMENT,
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