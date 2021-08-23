import { Col, message, Rate, Row, Spin } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useScrollToTop } from '../../hooks/scrollToTop';
import itemAvatar from '../../public/default/item-avatar.png';
import { removeCourseOrderAction } from '../../redux/actions/course.actions';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { numberFormat } from '../../utils';
import { apiGetCourseByIds } from '../../utils/apis/courseApi';
import { ROUTER_PAYMENT } from '../../utils/router';
import './style.scss';

const CourseOder = () => {
  useScrollToTop();
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser)
  const [dataOrder, setDataOrder] = useState([])
  const [dataTotal, setDataTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // if (currentUser?._id) {
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
          setLoading(false)
        })
        .catch(() => {
          message.warning('Có lỗi xảy ra');
          setDataOrder([]);
          setLoading(false);
        })
    } else {
      setLoading(false)
    }
    // }
  }, []);

  const onRemove = (value) => {
    const data = dataOrder?.filter(item => item._id !== value)
    const courseIds = localStorage.getItem('courseIds') ? localStorage.getItem('courseIds').split(',')?.filter(item => item !== value) : []
    dispatch(removeCourseOrderAction(value));
    setDataOrder(data)
    localStorage.setItem('courseIds', courseIds.join())
  }

  return (
    <React.Fragment>
      <div className="course-order">
        <Spin spinning={loading}>
          <div className="container">
            {dataOrder?.length > 0 ?
              <Row>
                <Col xs={24} sm={24} md={16} lg={16} xl={16} className="order-item">
                  <div>
                    {dataOrder.map(item =>
                      <Row className="transaction-item">
                        <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                          <img className="gwt-Image" src={item.avatar || itemAvatar} />
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12} className="infor">
                          <strong>
                            <div className="gwt-HTML">{item.name}</div>
                          </strong>
                          <div>
                            <span >(500) </span>
                            <span>
                              <Rate style={{ fontSize: '15px', color: '#ec1f24' }} disabled allowHalf defaultValue={4.5} />
                            </span>
                          </div>
                          <div className="dot-3" >
                            {item.shortDesc}
                          </div>
                        </Col>
                        <Col xs={24} sm={6} md={6} lg={6} xl={6} className="infor infor-order">
                          <button type="button" className="infor-order-close" onClick={() => onRemove(item._id)}>
                            <i className="far fa-times"></i>
                          </button>
                          {item.discountPrice !== 0 && <div className="discount-price">{numberFormat.format(item.cost)} VNĐ</div>}
                          <div className="gwt-HTML">{numberFormat.format(item.cost - item.discountPrice)} VND</div>
                        </Col>
                      </Row>
                    )}
                  </div>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8} className="total-price-left-panel">
                  <div>
                    <label className="infor-label">Thông tin đơn hàng</label>
                    <div className="item-price">
                      <span>Tạm tính</span>
                      <div className="gwt-HTML">{numberFormat.format(dataTotal)} VND</div>
                    </div>
                    <hr />
                    <div className="item-price">
                      <strong>Tổng tiền</strong>
                      <div className="gwt-HTML">{numberFormat.format(dataTotal)} VND</div>
                    </div>
                    {currentUser ?
                      <button
                        type="button"
                        className="button-pay"
                        onClick={() => router.push({
                          pathname: ROUTER_PAYMENT,
                          query: { courseIds: localStorage.getItem('courseIds') }
                        })}
                      >Thanh toán
                      </button>
                      :
                      <button
                        type="button"
                        className="button-pay"
                        onClick={() => dispatch(showLoginModalAction(true))}
                      >Thanh toán
                      </button>}
                  </div>
                </Col>
              </Row>
              :
              <div className="empty-cart-container">
                {!loading &&
                  <>
                    <div>
                      <div className="empty-cart-icon">
                        <i className="far fa-cart-plus"></i>
                      </div>
                      <div className="empty-cart-text">Bạn chưa có khoá học nào trong giỏ hàng</div>
                    </div>
                    <div className="empty-cart-div">
                      <a className="empty-cart-button" onClick={() => router.push('/')}>Tiếp tục mua sắm</a>
                    </div>
                  </>}
              </div>
            }
          </div>
        </Spin>
      </div>
    </React.Fragment>
  );
};

export default CourseOder;