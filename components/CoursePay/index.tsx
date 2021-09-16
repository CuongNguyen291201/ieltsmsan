import { Col, Modal, Row, Spin } from 'antd';
import { useRouter } from 'next/router';
import randomstring from 'randomstring';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { removeOneAction } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { Scopes } from '../../redux/types';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { encodeSHA256Code } from '../../sub_modules/common/utils';
import { showToastifySuccess, showToastifyWarning } from '../../sub_modules/common/utils/toastify';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import {
  NOT_PAYMENT,
  PAYMENT_BANK,
  PAYMENT_MOMO
} from '../../sub_modules/share/constraint';
import { Course } from '../../sub_modules/share/model/courses';
import Order from '../../sub_modules/share/model/order';
import WebInfo from '../../sub_modules/share/model/webInfo';
import { numberFormat } from '../../utils';
import { apiGetCourseByIds } from '../../utils/apis/courseApi';
import { apiCreateOrder } from '../../utils/apis/orderApi';
import { KEY_ORDER_SECRET } from '../../utils/contrants';
import orderUtils from '../../utils/payment/orderUtils';
import { ROUTER_TRANSACTION_HISTORY } from '../../utils/router';
import Bank from './payment-content/Bank';
import Momo from './payment-content/Momo';
import './style.scss';


const CoursePay = (props: { webInfo?: WebInfo }) => {
  useScrollToTop();
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser)
  const [dataOrder, setDataOrder] = useState<Course[]>([])
  const [dataTotal, setDataTotal] = useState(0)
  const [paymentType, setPaymentType] = useState<number>(NOT_PAYMENT)
  const [serial, setSerial] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOrderCreated, setOrderCreated] = useState(false);
  const courseIdsQuery: string = router.query?.courseIds as string
  const courseIds = courseIdsQuery ? courseIdsQuery?.split(',') : [];

  const PaymentInfo: { [paymentType: number]: { title: string; content: JSX.Element } } = {
    [PAYMENT_BANK]: {
      title: "Chuyển khoản ngân hàng",
      content: <Bank
        contactInfo={props.webInfo?.contactInfo}
        email={props.webInfo?.email}
        phone={props.webInfo?.hotLine}
        orderSerial={serial}
      />
    },
    [PAYMENT_MOMO]: {
      title: "Thanh toán qua ví Momo",
      content: <Momo />
    }
  }

  const showModal = () => {
    if (!currentUser) {
      dispatch(showLoginModalAction(true));
      return;
    }
    if (!paymentType || paymentType === NOT_PAYMENT) {
      showToastifyWarning("Vui lòng chọn phương thức thanh toán");
      return;
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  useEffect(() => {
    if (courseIds?.length > 0) {
      apiGetCourseByIds(courseIds)
        .then((courses) => {
          setDataOrder(courses)
          const priceTotal = courses.reduce((total, item) => (total += item.cost - item.discountPrice, total), 0);
          setDataTotal(priceTotal);
          setSerial(randomstring.generate({ length: 8, charset: 'alphanumeric', capitalization: 'uppercase' }));
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, []);

  const createOrder = () => {
    const order = new Order({
      userId: currentUser?._id,
      codeId: null,
      serial,
      content: `Course: ${dataOrder.map(({ name }) => name).join('; ')}`,
      price: dataOrder.reduce((total, item) => (total += item.cost, total), 0),
      discount: dataOrder.reduce((total, item) => (total += item.discountPrice, total), 0),
      userName: currentUser?.name,
      email: currentUser?.email,
      paymentType,
      courseIds,
      phone: currentUser?.phoneNumber,
    });
    const checkValue = encodeSHA256Code(order, KEY_ORDER_SECRET);
    apiCreateOrder(order, checkValue)
      .then(({ status }) => {
        if (status === response_status_codes.success) {
          // showToastifySuccess("Tạo đơn hàng thành công, vui lòng chờ xác nhận");
          orderUtils.clearCart();
          // handleCancel();
          setOrderCreated(true);
        } else {
          showToastifyWarning("Tạo đơn hàng thất bại")
        }
      })
      .catch(() => {
        showToastifyWarning("Có lỗi xảy ra!")
      });
  }

  const renderModalConfirm = () => {
    return (
      <Modal title="Mua khóa học" visible={isModalVisible} onOk={() => {
        if (isOrderCreated) {
          router.push(ROUTER_TRANSACTION_HISTORY);
        } else {
          createOrder();
        }
      }}
        onCancel={handleCancel}
        centered
        okText={isOrderCreated ? 'Lịch sử giao dịch' : 'OK'}
      >
        <h2 style={{ textAlign: "center" }}>{isOrderCreated ? 'Đơn hàng đã được tạo thành công!' : 'Xác nhận mua khóa học ?'}</h2>
        {isOrderCreated && paymentType === PAYMENT_BANK &&
          <Bank
            contactInfo={props.webInfo?.contactInfo}
            email={props.webInfo?.email}
            phone={props.webInfo?.hotLine}
            orderSerial={serial}
            hideHeader
            hideNotifMessage
          />}
      </Modal>
    )
  }

  const onRemove = (value: string) => {
    const data = dataOrder?.filter(item => item._id !== value)
    const priceTotal = data.reduce((total, item) => (total += item.cost - item.discountPrice, total), 0);
    // const courseIds = localStorage.getItem('courseIds') ? localStorage.getItem('courseIds').split(',')?.filter(item => item !== value) : []
    orderUtils.removeCourseFromCart(value);
    dispatch(removeOneAction(Scopes.CART, value))
    setDataTotal(priceTotal);
    setDataOrder(data)
    const dataCourse = data?.map(item => item._id)
    // localStorage.setItem('courseIds', courseIds.join())
    router.push(`?courseIds=${dataCourse.join()}`, undefined, { shallow: true })
  }

  const onChangeCheck = (value: number) => {
    if (value === paymentType) setPaymentType(NOT_PAYMENT);
    else setPaymentType(value);
  }

  return (
    <React.Fragment>
      {renderModalConfirm()}
      <div className="course-pay">
        <Spin spinning={loading}>
          <div className="container ">
            <Row className="casc">
              <Col sm={24} md={16} className="payment-main-panel new-position">
                <Row>
                  <Col xs={24} className="custom-reset-row-col right-panel">
                    <label><strong>1. Thông tin thanh toán</strong></label>
                    <div className="transactionCode">
                      <span>Mã đơn hàng: </span> <span style={{ color: "#ff0000" }}>{serial}</span>
                    </div>

                    <div className="content-block-panel left-panel-background">
                      <div className="main-block-content-panel" >
                        <div className="header-left-panel">
                          <label><span className="count-course-number">{dataOrder?.length || 0} Khoá học</span></label>
                        </div>
                        {dataOrder?.length > 0 && dataOrder?.map((item, i) =>
                          <div className="item-course-bought" key={i}>
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
                        <div className="panel-group payment-method" id="payment-methods">
                          {currentUser && <>
                            <label><strong>1. Thông tin khách hàng (*)</strong></label>
                            <div id="customer-info">
                              <ul>
                                <li>Tên người dùng: {currentUser.name}</li>
                                <li>Email: {currentUser.email}</li>
                                <li>Số điện thoại: {currentUser.phoneNumber}</li>
                              </ul>
                            </div>
                          </>}
                          <label><strong>
                            {currentUser ? '2. ' : ''}
                            Chọn phương thức thanh toán
                          </strong></label>
                          <div>
                            {[PAYMENT_BANK, PAYMENT_MOMO].map((type, i) => (
                              <div className="item-checkbox" key={i} onClick={() => onChangeCheck(type)}>
                                <a data-toggle="collapse" data-parent="#payment-methods">
                                  <i className="icon-before" />
                                  <i className={`far ${paymentType === type ? 'fa-check-circle' : 'fa-circle'}`} />
                                  &nbsp;
                                  <span>{PaymentInfo[type].title}</span>
                                </a>
                              </div>
                            ))}
                            {paymentType !== NOT_PAYMENT && <div id={`method-${paymentType}`} className="panel-collapse collapse" data-method={paymentType} aria-expanded="false">
                              <div className="panel-body">
                                {PaymentInfo[paymentType].content}
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
                            để nhận mã code hoặc kiểm tra email <span id="email-show-info"><a href={`mailto:${currentUser?.email}`}>{currentUser?.email}</a></span>.
                          </div>
                        </Col>
                      </div>
                      <div className="payment-button">
                        <button className="button-on-right-panel" onClick={() => {
                          router.back();
                        }}>Quay lại </button>
                        {!isOrderCreated && <button className="button-on-right-panel background-color-main" onClick={showModal}>Tiếp tục</button>}
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