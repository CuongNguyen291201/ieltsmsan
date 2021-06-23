import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import { Row, Col, Rate } from 'antd';
import { removeCourseOrderAction } from '../../redux/actions/course.actions';
import { OtsvCategory } from '../../custom-types';
import itemAvatar from '../../public/default/item-avatar.png';
import { AppState } from '../../redux/reducers'
import { numberFormat, getBrowserSlug } from '../../utils';
import { COURSE_ORDER_PAGE_TYPE } from '../../sub_modules/share/constraint';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { apiGetCourseByIds } from '../../utils/apis/courseApi';
import './style.scss';

const ReplyComment = (props: { category: OtsvCategory; childCategories: OtsvCategory[]; }) => {
  useScrollToTop();
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser)
  const [dataOrder, setDataOrder] = useState([])
  const [dataTotal, setDataTotal] = useState(0)

  useEffect(() => {
    if (currentUser?._id) {
      const courseIds = localStorage.getItem('courseIds') ? localStorage.getItem('courseIds').split(',') : []
      if (courseIds?.length > 0) {
        apiGetCourseByIds(courseIds)
          .then(data => {
            setDataOrder(data?.data?.reverse())
            let priceTotal = 0
            data?.data?.map(item => {
              priceTotal += item.cost - item.discountPrice
            })
            setDataTotal(priceTotal)
          })
      }
    }
  }, [currentUser]);

  const onRemove = (value) => {
    const data = dataOrder?.filter(item => item._id !== value)
    const courseIds = localStorage.getItem('courseIds') ? localStorage.getItem('courseIds').split(',')?.filter(item => item !== value) : []
    dispatch(removeCourseOrderAction(value));
    setDataOrder(data)
    localStorage.setItem('courseIds', courseIds.join())
  }

  return (
    <React.Fragment>
      <div className="course-pay">
        <div className="container ">
          <Row className="casc">
            <Col sm={24} md={16} className="payment-main-panel new-position">
              <Row>
                <Col xs={24} className="custom-reset-row-col right-panel">
                  <label><strong>1. Thông tin thanh toán</strong></label>
                  <div className="transactionCode">
                    <span>Mã đơn hàng: </span> <span style={{ color: "#ff0000" }}>YTYSKK</span>
                  </div>

                  <div className="content-block-panel left-panel-background">
                    <div className="main-block-content-panel" >
                      <div className="header-left-panel">
                        <label><span className="count-course-number">3 Khoá học</span></label>
                      </div>
                      <div className="item-course-bought">
                        <div>
                          <label>MOS EXCEL 2016 - CAM KẾT ĐẦU RA</label>
                          <span className="price-html"><div><strong>399,000 VND</strong></div><div className="discount">999,000 VND</div></span>
                        </div>
                        <span className="remove-course-item" ><i className="fa fa-times"></i></span>
                      </div>
                    </div>
                    <div className="membership-info-panel">
                      <div className="new-price-display-temp-panel flex">
                        <span>Tạm tính</span>
                        <span id="new-template-price_">1,998,000 VND</span>
                      </div>
                    </div>
                    <div className="total-price-info-panel">
                      <div className="new-price-display-panel flex">
                        <span>Tổng cộng</span>
                        <span className="new-total-price">1,998,000 VND</span>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} className="custom-reset-row-col left-panel">
                  <div className="content-block-panel">
                    <div className="main-block-content-panel">
                      <div className="payment-method">
                        <label><strong>1. Thông tin khách hàng (*)</strong></label>
                      </div>
                      <div className="panel-group payment-method" id="payment-methods">
                        <label><strong>2. Chọn phương thức thanh toán</strong></label>
                        <div>

                          <div className="item-checkbox">
                            <a data-toggle="collapse" data-parent="#payment-methods" href="#method-1">
                              <i className="icon-before"></i>
                              <span>Thanh toán qua ví Momo</span>
                            </a>
                          </div>
                          <div id="method-1" className="panel-collapse collapse " data-method="1">
                            <div className="panel-body">
                              <p className="payment-content">

                                Sau khi điền thông tin mua hàng và bấm hoàn tất đơn hàng, hệ thống sẽ hiển thị mã QR kèm hướng dẫn. Bạn cần tải và cài ứng dụng Momo trên điện thoại và sử dụng để quét mã QR trên để thanh toán. Momo-Phương thức thanh toán nhanh, tiện lợi, an toàn được cấp phép và quản lý bởi NH Nhà Nước Việt Nam.

                              </p>
                              <div>
                                <strong>
                                  Khi thanh toán thành công, mã code sẽ được gửi về email bên dưới và trang
                                  <a href="/lich-su-giao-dich">Lịch sử giao dịch</a> của bạn

                                </strong>
                              </div>
                            </div>
                          </div>
                          <div className="item-checkbox">
                            <a data-toggle="collapse" data-parent="#payment-methods" href="#method-2">
                              <i className="icon-before"></i>
                              <span>

                                Thanh toán qua ngân hàng

                              </span>
                            </a>
                          </div>
                          <div id="method-2" className="panel-collapse collapse " data-method="2">
                            <div className="panel-body">
                              <span className="payment-content">

                                Sau khi điền thông tin mua hàng và bấm hoàn tất đơn hàng, hệ thống sẽ hiển thị mã QR kèm hướng dẫn. Bạn cần sử dụng ứng dụng ngân hàng trên điện thoại và sử dụng để quét mã QR trên để thanh toán. VNPAY-Phương thức thanh toán nhanh, tiện lợi, an toàn được cấp phép và quản lý bởi NH Nhà Nước Việt Nam.

                              </span>
                              <div>
                                <strong>
                                  Khi thanh toán thành công, mã code sẽ được gửi về email bên dưới và trang
                                  <a href="/lich-su-giao-dich">Lịch sử giao dịch</a> của bạn

                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Col xs={24} className="no-padding-mobile">
                        <div>
                          - Kiểm tra lại thông tin đơn hàng trước khi nhấn <strong>tiếp tục</strong>.
                        </div>
                        <div>
                          - Sau khi <strong>thanh toán thành công</strong>,
                          Bạn vào trang <strong><a href="/lich-su-giao-dich" className="history">lịch sử giao dịch </a></strong>
                          để nhận mã code hoặc kiểm tra email <span id="email-show-info"><a href="mailto:trongtu@gmail.com">trongtu@gmail.com</a></span>.
                        </div>
                      </Col>
                    </div>
                    <div className="payment-button">
                      <button className="button-on-right-panel">Quay lại </button>
                      <button className="button-on-right-panel background-color-main" >Tiếp tục</button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ReplyComment;