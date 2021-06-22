import { useRouter } from 'next/router';
import { memo, useCallback, useMemo, useState } from 'react';
import { OtsvCategory } from '../../custom-types';
import itemAvatar from '../../public/default/item-avatar.png';
import { CATEGORY_DETAIL_PAGE_TYPE } from '../../sub_modules/share/constraint';
import { getBrowserSlug, numberFormat } from '../../utils';
import Container1 from '../containers/Container1';
import './style.scss';
import Modal from '@material-ui/core/Modal';
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
    const router = useRouter();
    const courseBrowserSlug = useMemo(() => getBrowserSlug(course.slug, COURSE_DETAIL_PAGE_TYPE, course._id), [course]);
    const onClickItem = useCallback(() => {
        router.push({ pathname: courseBrowserSlug, query: { root: category?._id ?? '' } });
    }, [course]);
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
                    <div className="popup-show-infor">
                        <div className="image-course">
                            <img src={course.avatar || itemAvatar} alt={course.name} />
                        </div>
                        <div className="infor-course">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="tag-video-course">
                                    <PlayCircleOutlineIcon />  Khoá học Video Online
                                </div>
                                <div> 180 Ngày</div>
                            </div>
                            <div className="price-course">
                                <LocalOfferIcon />
                                <div className="crs-discount-price">
                                    {numberFormat.format(course.cost - course.discountPrice)} VNĐ
                                </div>
                                {course.discountPrice !== 0 && <div className="crs-origin-price">{numberFormat.format(course.cost)} VNĐ</div>}
                            </div>
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
                    </div>
                    <div className="des-course">{course.shortDesc}</div>
                    <div className="optional">
                        <button>Thêm vào giỏ hàng</button>
                        <button>Mua Khoá học</button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default memo(PopupShowQuickView);