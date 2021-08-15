import { Col, Row, Spin } from 'antd';
import { useRouter } from 'next/router';
import randomstring from 'randomstring';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { removeCourseOrderAction } from '../../redux/actions/course.actions';
import { AppState } from '../../redux/reducers';
import { numberFormat } from '../../utils';
import { apiGetCourseByIds } from '../../utils/apis/courseApi';
import './style.scss';

const CoursePay = () => {
  useScrollToTop();
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser)
  const [dataOrder, setDataOrder] = useState([])
  const [dataTotal, setDataTotal] = useState(0)
  const [checkTick, setCheckTick] = useState(0)
  const [dataRamdom, setDataRamdom] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // if (currentUser?._id) {
    const courseIdsQuery: string = router.query?.courseIds as string
    const courseIds = courseIdsQuery ? courseIdsQuery?.split(',') : []
    if (courseIds?.length > 0) {
      apiGetCourseByIds(courseIds)
        .then(data => {
          setDataOrder(data?.data?.reverse())
          let priceTotal = 0
          data?.data?.map(item => {
            priceTotal += item.cost - item.discountPrice
          })
          setDataTotal(priceTotal)
          setDataRamdom(randomstring.generate({
            length: 6,
            charset: 'alphabetic',
            capitalization: 'uppercase'
          }))
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
    // }
  }, []);

  const onRemove = (value) => {
    const data = dataOrder?.filter(item => item._id !== value)
    // const courseIds = localStorage.getItem('courseIds') ? localStorage.getItem('courseIds').split(',')?.filter(item => item !== value) : []
    dispatch(removeCourseOrderAction(value));
    setDataOrder(data)
    const dataCourse = data?.map(item => item._id)
    // localStorage.setItem('courseIds', courseIds.join())
    router.push(`?courseIds=${dataCourse.join()}`, undefined, { shallow: true })
  }

  const onChangeCheck = (value) => {
    if (value === 1) {
      setCheckTick(checkTick == 1 ? 0 : 1)
    } else {
      setCheckTick(checkTick == 2 ? 0 : 2)
    }
  }

  return (
    <React.Fragment>
      <div className="course-pay">
        <Spin spinning={loading}>
          <div className="container ">
            <Row className="casc">
              <Col sm={24} md={16} className="payment-main-panel new-position">
                <Row>
                  <Col xs={24} className="custom-reset-row-col right-panel">
                    <label><strong>1. Thông tin thanh toán</strong></label>
                    <div className="transactionCode">
                      <span>Mã đơn hàng: </span> <span style={{ color: "#ff0000" }}>{dataRamdom}</span>
                    </div>

                    <div className="content-block-panel left-panel-background">
                      <div className="main-block-content-panel" >
                        <div className="header-left-panel">
                          <label><span className="count-course-number">{dataOrder?.length || 0} Khoá học</span></label>
                        </div>
                        {dataOrder?.length > 0 && dataOrder?.map(item =>
                          <div className="item-course-bought">
                            <div>
                              <label>{item.name}</label>
                              <span className="price-html">
                                <div>
                                  <strong>{numberFormat.format(item.cost - item.discountPrice)} VND</strong>
                                </div>
                                {item.discountPrice !== 0 && <div className="discount">{numberFormat.format(item.cost)} VNĐ</div>}
                              </span>
                            </div>
                            <span className="remove-course-item" onClick={() => onRemove(item._id)}><i className="fa fa-times"></i></span>
                          </div>
                        )}
                        {dataOrder?.length === 0 &&
                          <div className="course-item-empty">
                            {!loading && <span>
                              Khoá học không tồn tại hoặc bạn chưa chọn khoá học nào ! Quay lại trang <a onClick={() => router.push('/')}>Mua khoá học</a>.
                            </span>}
                          </div>}
                      </div>
                      <div className="membership-info-panel">
                        <div className="new-price-display-temp-panel flex">
                          <span>Tạm tính</span>
                          <span id="new-template-price_">{numberFormat.format(dataTotal)} VND</span>
                        </div>
                      </div>
                      <div className="total-price-info-panel">
                        <div className="new-price-display-panel flex">
                          <span>Tổng cộng</span>
                          <span className="new-total-price">{numberFormat.format(dataTotal)} VND</span>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} className="custom-reset-row-col left-panel">
                    <div className="content-block-panel">
                      <div className="main-block-content-panel">
                        {/* <div className="payment-method">
                        <label><strong>1. Thông tin khách hàng (*)</strong></label>
                      </div> */}
                        <div className="panel-group payment-method" id="payment-methods">
                          <label><strong>Chọn phương thức thanh toán</strong></label>
                          <div>

                            <div className="item-checkbox" onClick={() => onChangeCheck(1)}>
                              <a data-toggle="collapse" data-parent="#payment-methods" >
                                <i className="icon-before"></i>
                                {checkTick === 1 ?
                                  <i className="far fa-check-circle"></i>
                                  :
                                  <i className="far fa-circle"></i>}
                                &nbsp;
                                <span>Thanh toán qua ví Momo</span>
                              </a>
                            </div>
                            <div className="item-checkbox" onClick={() => onChangeCheck(2)}>
                              <a data-toggle="collapse" data-parent="#payment-methods" >
                                <i className="icon-before"></i>
                                <span>
                                  {checkTick === 2 ?
                                    <i className="far fa-check-circle"></i>
                                    :
                                    <i className="far fa-circle"></i>}
                                  &nbsp;
                                  Thanh toán qua ngân hàng

                                </span>
                              </a>
                            </div>
                            {checkTick === 1 && <div id="method-1" className="panel-collapse collapse " data-method="1" aria-expanded="false">
                              <div className="panel-body">
                                <p className="payment-content">

                                  Sau khi điền thông tin mua hàng và bấm hoàn tất đơn hàng, hệ thống sẽ hiển thị mã QR kèm hướng dẫn. Bạn cần tải và cài ứng dụng Momo trên điện thoại và sử dụng để quét mã QR trên để thanh toán. Momo-Phương thức thanh toán nhanh, tiện lợi, an toàn được cấp phép và quản lý bởi NH Nhà Nước Việt Nam.

                                </p>
                                <div>
                                  <strong>
                                    Khi thanh toán thành công, mã code sẽ được gửi về email bên dưới và trang&nbsp;
                                    <a href="/lich-su-giao-dich">Lịch sử giao dịch</a> của bạn

                                  </strong>
                                </div>
                              </div>
                            </div>}
                            {checkTick === 2 && <div id="method-2" className="panel-collapse collapse " data-method="2">
                              <div className="panel-body">
                                <span className="payment-content">

                                  Sau khi điền thông tin mua hàng và bấm hoàn tất đơn hàng, hệ thống sẽ hiển thị mã QR kèm hướng dẫn. Bạn cần sử dụng ứng dụng ngân hàng trên điện thoại và sử dụng để quét mã QR trên để thanh toán. VNPAY-Phương thức thanh toán nhanh, tiện lợi, an toàn được cấp phép và quản lý bởi NH Nhà Nước Việt Nam.

                                </span>
                                <div>
                                  <strong>
                                    Khi thanh toán thành công, mã code sẽ được gửi về email bên dưới và trang&nbsp;
                                    <a href="/lich-su-giao-dich">Lịch sử giao dịch</a> của bạn

                                  </strong>
                                </div>
                              </div>
                            </div>}
                          </div>
                        </div>
                        <Col xs={24} className="no-padding-mobile">
                          <div>
                            - Kiểm tra lại thông tin đơn hàng trước khi nhấn <strong>tiếp tục</strong>.
                          </div>
                          <div>
                            - Sau khi <strong>thanh toán thành công</strong>,
                            Bạn vào trang <strong><a href="/lich-su-giao-dich" className="history">lịch sử giao dịch </a></strong>
                            để nhận mã code hoặc kiểm tra email <span id="email-show-info"><a href="mailto:trongtu@gmail.com">{currentUser?.account}</a></span>.
                          </div>
                        </Col>
                      </div>
                      <div className="payment-button">
                        <button className="button-on-right-panel" onClick={() => router.push('course-order')}>Quay lại </button>
                        <button className="button-on-right-panel background-color-main" >Tiếp tục</button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Spin>
      </div>
    </React.Fragment>
  );
};

export default CoursePay;