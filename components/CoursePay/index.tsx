import { HighlightOffTwoTone, LoyaltyTwoTone } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, Typography } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { useRouter } from 'next/router';
import { useSnackbar } from "notistack";
import randomstring from 'randomstring';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _Category } from "../../custom-types";
import { MapPaymentType } from '../../custom-types/MapContraint';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { removeOneAction } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { Scopes } from '../../redux/types';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { encodeSHA256Code } from '../../sub_modules/common/utils';
import { showToastifyWarning } from '../../sub_modules/common/utils/toastify';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import {
  COUPON_DISCOUNT_UNIT_CURRENCY,
  COUPON_DISCOUNT_UNIT_PERCENT,
  NOT_PAYMENT,
  OrderItemTypes,
  PAYMENT_BANK,
  PAYMENT_MOMO
} from '../../sub_modules/share/constraint';
import Coupon from "../../sub_modules/share/model/coupon";
import { Course } from '../../sub_modules/share/model/courses';
import Order from '../../sub_modules/share/model/order';
import WebInfo from '../../sub_modules/share/model/webInfo';
import { numberFormat } from '../../utils';
import { apiGetCategoryById } from "../../utils/apis/categoryApi";
import { apiGetCouponByCode } from "../../utils/apis/couponApi";
import { apiGetCourseByIds } from '../../utils/apis/courseApi';
import { apiCreateOrder } from '../../utils/apis/orderApi';
import { KEY_ORDER_SECRET } from '../../utils/contrants';
import orderUtils, { COUPON_CODE_KEY } from '../../utils/payment/orderUtils';
import { ROUTER_TRANSACTION_HISTORY } from '../../utils/router';
import SkeletonContainer from "../SkeletonContainer";
import Bank from './payment-content/Bank';
import Momo from './payment-content/Momo';
import './style.scss';
import { getCookie, removeCookie, setCookie } from "../../sub_modules/common/utils/cookie";


const CoursePay = (props: { webInfo?: WebInfo; maxCoupons?: number }) => {
  const { maxCoupons = 1 } = props;
  useScrollToTop();
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser)
  const [dataOrder, setDataOrder] = useState<Course[]>([])
  const [dataTotal, setDataTotal] = useState(0);
  const [discountTotal, setDiscountTotal] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [paymentType, setPaymentType] = useState<number>(NOT_PAYMENT)
  const [serial, setSerial] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOrderCreated, setOrderCreated] = useState(false);
  const [comboCategory, setComboCategory] = useState<_Category>();
  const [isSearchingCoupon, setSearchingCoupon] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponList, setCouponList] = useState<Coupon[]>([]);
  const courseIdsQuery: string = router.query?.courseIds as string
  const courseIds = courseIdsQuery ? courseIdsQuery?.split(',') : [];
  const categoryId = router.query.categoryId as string;
  const couponCodeRef = useRef<HTMLInputElement | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const PaymentInfo: { [paymentType: number]: JSX.Element } = {
    [PAYMENT_BANK]: <Bank
      contactInfo={props.webInfo?.contactInfo}
      email={props.webInfo?.email}
      phone={props.webInfo?.hotLine}
      orderSerial={serial}
    />,
    [PAYMENT_MOMO]: <Momo />
  }

  const showModal = () => {
    if (!currentUser) {
      dispatch(showLoginModalAction(true));
      return;
    }
    if (!paymentType || paymentType === NOT_PAYMENT) {
      showToastifyWarning("Vui l??ng ch???n ph????ng th???c thanh to??n");
      return;
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  useEffect(() => {
    const loadCoursesFC = async () => {
      let category: _Category;
      const courses = await apiGetCourseByIds(courseIds);
      if (categoryId) {
        category = await apiGetCategoryById({ categoryId });
        setComboCategory(category);
      }
      setDataOrder(courses);
      const priceTotal = courses.reduce((total, item) => (total += item.cost, total), 0);
      const discountTotal = category ? priceTotal - category.price : courses.reduce((total, item) => (total += item.discountPrice, total), 0);
      const finalPrice = category ? category.price : priceTotal - discountTotal;
      setDataTotal(priceTotal);
      setDiscountTotal(discountTotal);
      setFinalPrice(finalPrice);
      setSerial(randomstring.generate({ length: 8, charset: 'alphanumeric', capitalization: 'uppercase' }));
      setLoading(false)
      return finalPrice;
    }
    if (courseIds?.length > 0) {
      loadCoursesFC()
        .then((finalPrice) => {
          // Coupon cookie/query
          const cookieCouponCode = getCookie(COUPON_CODE_KEY);
          const couponCodeQuery = router.query.code as string;
          const code = couponCodeQuery || cookieCouponCode;
          if (!!code) {
            if (!cookieCouponCode) setCookie(COUPON_CODE_KEY, code);
            const decodedCode = atob(code);
            apiGetCouponByCode(decodedCode)
              .then((coupon) => {
                if (!coupon) removeCookie(COUPON_CODE_KEY);
                if (coupon && !coupon.isExpired && !coupon.isExceededUses && coupon.isActive && couponList.length < maxCoupons) {
                  const newCouponList = [...couponList, coupon];
                  setCouponList(newCouponList);
                  setCouponDiscount(newCouponList.reduce((total: number, coupon) => {
                    const cDiscount = coupon.discountUnit === COUPON_DISCOUNT_UNIT_CURRENCY ? coupon.discount : (Math.round(finalPrice * coupon.discount / (100 * 1000) * 1000));
                    return total + cDiscount;
                  }, 0));
                }
              })
          }
        });
    } else {
      setLoading(false)
    }
  }, []);

  const createOrder = () => {
    const order = new Order({
      userId: currentUser?._id,
      codeId: null,
      serial,
      content: comboCategory ? `Combo: ${comboCategory.name}` : `Kho?? h???c: ${dataOrder.map(({ name }) => name).join('; ')}`,
      price: dataTotal,
      discount: discountTotal + couponDiscount,
      userName: currentUser?.name,
      email: currentUser?.email,
      paymentType,
      courseIds,
      phone: currentUser?.phoneNumber,
    });
    const reqOrder = { ...order, itemId: comboCategory?._id || null, itemType: OrderItemTypes.COURSE, couponIds: couponList.map(({ _id }) => _id) }
    const checkValue = encodeSHA256Code(reqOrder, KEY_ORDER_SECRET);
    apiCreateOrder(reqOrder, checkValue)
      .then(({ status }) => {
        if (status === response_status_codes.success) {
          // showToastifySuccess("T???o ????n h??ng th??nh c??ng, vui l??ng ch??? x??c nh???n");
          orderUtils.clearCart();
          // handleCancel();
          setOrderCreated(true);
        } else {
          showToastifyWarning("T???o ????n h??ng th???t b???i")
        }
      })
      .catch(() => {
        showToastifyWarning("C?? l???i x???y ra!")
      });
  }

  const renderModalConfirm = () => {
    return (
      <Dialog
        title="Mua kh??a h???c"
        open={isModalVisible}
        onClose={handleCancel}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <span style={{ textAlign: "center" }}>{isOrderCreated ? '????n h??ng ???? ???????c t???o th??nh c??ng!' : 'X??c nh???n mua kh??a h???c ?'}</span>
        </DialogTitle>
        <DialogContent>
          {isOrderCreated && paymentType === PAYMENT_BANK &&
            <Bank
              contactInfo={props.webInfo?.contactInfo}
              email={props.webInfo?.email}
              phone={props.webInfo?.hotLine}
              orderSerial={serial}
              hideHeader
              hideNotifMessage
            />}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleCancel}>Hu???</Button>

          <Button variant="contained" color="primary" onClick={() => {
            if (isOrderCreated) {
              router.push(ROUTER_TRANSACTION_HISTORY);
            } else {
              createOrder();
            }
          }}>
            {isOrderCreated ? 'L???ch s??? giao d???ch' : 'OK'}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const onRemove = (value: string) => {
    const data = dataOrder?.filter(item => item._id !== value)
    const priceTotal = data.reduce((total, item) => (total += item.cost, total), 0);
    const totalDiscount = data.reduce((total, item) => (total += item.discountPrice, total), 0);
    // const courseIds = localStorage.getItem('courseIds') ? localStorage.getItem('courseIds').split(',')?.filter(item => item !== value) : []
    orderUtils.removeCourseFromCart(value);
    dispatch(removeOneAction(Scopes.CART, value))
    setDataTotal(priceTotal);
    setDataOrder(data);
    setDiscountTotal(totalDiscount);
    setFinalPrice(priceTotal - totalDiscount);
    if (comboCategory) setComboCategory(null);
    const dataCourse = data?.map(item => item._id);
    // localStorage.setItem('courseIds', courseIds.join())
    router.push(`?courseIds=${dataCourse.join()}`, undefined, { shallow: true })
  }

  const onChangeCheck = (value: number) => {
    if (value === paymentType) setPaymentType(NOT_PAYMENT);
    else setPaymentType(value);
  }

  const onSearchCoupon = async () => {
    if (isSearchingCoupon) return;
    const couponCode = DOMPurify.sanitize(couponCodeRef?.current?.value);
    if (!couponCode) return;
    if (couponCodeRef?.current?.value) {
      couponCodeRef.current.value = '';
    }
    if (couponList.length >= maxCoupons) {
      enqueueSnackbar(`????n h??ng ch??? ??p d???ng t???i ??a ${maxCoupons} m?? khuy???n m??i`, { variant: "info" });
      return;
    }
    setSearchingCoupon(true);
    const coupon = await apiGetCouponByCode(couponCode);
    setSearchingCoupon(false);
    if (!coupon) {
      enqueueSnackbar('M?? kh??ng t???n t???i!', { variant: "error" });
      return;
    }
    if (coupon.isExceededUses) {
      enqueueSnackbar('M?? ???? h???t l?????t s??? d???ng!', { variant: "info" });
      return;
    }
    if (coupon.isExpired || !coupon.isActive) {
      enqueueSnackbar('M?? kh??ng kh??? d???ng!', { variant: "error" });
      return;
    }
    if (couponList.map(({ code }) => code).includes(couponCode)) {
      enqueueSnackbar('M?? ???? ???????c ??p d???ng!', { variant: "warning" });
      return;
    }
    const newCouponList = [...couponList, coupon];
    setCouponList(newCouponList);
    setCouponDiscount(newCouponList.reduce((total: number, coupon) => {
      const cDiscount = coupon.discountUnit === COUPON_DISCOUNT_UNIT_CURRENCY ? coupon.discount : (Math.round(finalPrice * coupon.discount / (100 * 1000) * 1000));
      return total + cDiscount;
    }, 0));
  }

  const onRemoveCoupon = (coupon: Coupon, index: number) => {
    const newCouponList = [...couponList];
    newCouponList.splice(index, 1);
    setCouponList(newCouponList);
    if (getCookie(COUPON_CODE_KEY) === btoa(coupon.code)) {
      removeCookie(COUPON_CODE_KEY);
    }
    const cDiscount = coupon.discountUnit === COUPON_DISCOUNT_UNIT_CURRENCY ? coupon.discount : (Math.round(finalPrice * coupon.discount / (100 * 1000) * 1000));
    setCouponDiscount(couponDiscount - cDiscount);
  }

  return (
    <React.Fragment>
      {renderModalConfirm()}
      <div className="course-pay">
        <div className="container ">
          <SkeletonContainer loading={loading} noTransform>
            <Grid container className="casc">
              <Grid item xs={12} md={8} className="payment-main-panel new-position">
                <Grid container>
                  <Grid item xs={12} className="custom-reset-row-col right-panel">
                    <label><strong>1. Th??ng tin thanh to??n</strong></label>
                    <div className="transactionCode">
                      <span>M?? ????n h??ng: </span> <span style={{ color: "#ff0000" }}>{serial}</span>
                    </div>

                    <div className="content-block-panel left-panel-background">
                      <div className="main-block-content-panel" >
                        <div className="header-left-panel">
                          <label><span className="count-course-number">{dataOrder?.length || 0} Kho?? h???c</span></label>
                        </div>
                        {dataOrder?.length > 0 && dataOrder?.map((item, i) =>
                          <div className="item-course-bought" key={i}>
                            <div>
                              <label>{item.name}</label>
                              <span className="price-html">
                                <div>
                                  <strong>{numberFormat.format(item.cost - item.discountPrice)} VND</strong>
                                </div>
                                {item.discountPrice !== 0 && <div className="discount">{numberFormat.format(item.cost)} VN??</div>}
                              </span>
                            </div>
                            <span className="remove-course-item" onClick={() => onRemove(item._id)}><i className="fa fa-times"></i></span>
                          </div>
                        )}
                        {dataOrder?.length === 0 &&
                          <div className="course-item-empty">
                            {!loading && <span>
                              Kho?? h???c kh??ng t???n t???i ho???c b???n ch??a ch???n kho?? h???c n??o ! Quay l???i trang <a onClick={() => router.push('/')}>Mua kho?? h???c</a>.
                            </span>}
                          </div>}
                      </div>
                      <div className="membership-info-panel">
                        <div className="new-price-display-temp-panel flex">
                          <span>T???m t??nh</span>
                          <span id="new-template-price_">{numberFormat.format(dataTotal)} VND</span>
                        </div>
                      </div>

                      <div className="membership-info-panel">
                        <label htmlFor="coupon-code-input"><b>M?? khuy???n m??i</b></label>
                        <Grid container className="coupon-code-wrapper" sx={{ marginTop: "8px" }}>
                          <Grid item flex={1}>
                            <input type="text" id="coupon-code-input" placeholder="Nh???p m?? khuy???n m??i" ref={couponCodeRef} />
                          </Grid>
                          <Grid item>
                            <Button sx={{ textTransform: "none", height: "35px", borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} color="primary" variant="contained" onClick={() => onSearchCoupon()}>??p d???ng</Button>
                          </Grid>
                        </Grid>

                        {!!couponList.length && couponList.map((coupon, index) => {
                          const cDiscount = coupon.discountUnit === COUPON_DISCOUNT_UNIT_CURRENCY ? coupon.discount : (Math.round(finalPrice * coupon.discount / (100 * 1000) * 1000));
                          const cDiscountUnit = coupon.discountUnit === COUPON_DISCOUNT_UNIT_CURRENCY ? 'VND' : '%';
                          return (
                            <Paper key={coupon._id} sx={{ marginTop: "5px", display: "flex", alignItems: "center" }} elevation={3}>
                              <Box display="flex" alignItems="center" margin="0 10px" padding="0 10px" flex={1} bgcolor="#eee" border="1px solid #ccc">
                                <LoyaltyTwoTone sx={{ color: "#FFB302", marginRight: "5px" }} />
                                <Typography sx={{ fontSize: "14px" }} flex={1}>{coupon.code}</Typography>
                                <Typography sx={{ fontSize: "14px", color: "red" }} component="span">- {numberFormat.format(cDiscount)} VND {coupon.discountUnit === COUPON_DISCOUNT_UNIT_PERCENT ? `[-${coupon.discount}%]` : ''}</Typography>
                              </Box>
                              <IconButton onClick={() => { onRemoveCoupon(coupon, index) }}>
                                <HighlightOffTwoTone />
                              </IconButton>
                            </Paper>
                          )
                        })}
                      </div>

                      <div className="membership-info-panel">
                        <div className="new-price-display-temp-panel flex">
                          <span>Gi???m gi??</span>
                          <span id="new-template-price_">{numberFormat.format(discountTotal)} VND</span>
                        </div>
                      </div>
                      <div className="total-price-info-panel">
                        <div className="new-price-display-panel flex">
                          <span>T???ng c???ng</span>
                          <span className="new-total-price">{numberFormat.format(finalPrice - couponDiscount)} VND</span>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} className="custom-reset-row-col left-panel">
                    <div className="content-block-panel">
                      <Grid container className="main-block-content-panel">
                        <div className="panel-group payment-method" id="payment-methods">
                          {currentUser && <>
                            <label><strong>1. Th??ng tin kh??ch h??ng (*)</strong></label>
                            <div id="customer-info">
                              <ul>
                                <li>T??n ng?????i d??ng: {currentUser.name}</li>
                                <li>Email: {currentUser.email}</li>
                                <li>S??? ??i???n tho???i: {currentUser.phoneNumber}</li>
                              </ul>
                            </div>
                          </>}
                          <label><strong>
                            {currentUser ? '2. ' : ''}
                            Ch???n ph????ng th???c thanh to??n
                          </strong></label>
                          <div>
                            {[PAYMENT_BANK, PAYMENT_MOMO].map((type, i) => (
                              <div className="item-checkbox" key={i} onClick={() => onChangeCheck(type)}>
                                <a data-toggle="collapse" data-parent="#payment-methods">
                                  <i className="icon-before" />
                                  <i className={`far ${paymentType === type ? 'fa-check-circle' : 'fa-circle'}`} />
                                  &nbsp;
                                  <span>{MapPaymentType[type]}</span>
                                </a>
                              </div>
                            ))}
                            {paymentType !== NOT_PAYMENT && <div id={`method-${paymentType}`} className="panel-collapse collapse" data-method={paymentType} aria-expanded="false">
                              <div className="panel-body">
                                {PaymentInfo[paymentType]}
                              </div>
                            </div>}
                          </div>
                        </div>
                        <Grid item xs={12} className="no-padding-mobile">
                          <div>
                            - Ki???m tra l???i th??ng tin ????n h??ng tr?????c khi nh???n <strong>ti???p t???c</strong>.
                          </div>
                          <div>
                            - Sau khi <strong>thanh to??n th??nh c??ng</strong>,
                            B???n v??o trang <strong><a href="/lich-su-giao-dich" className="history">l???ch s??? giao d???ch </a></strong>
                            ????? nh???n m?? code ho???c ki???m tra email <span id="email-show-info"><a href={`mailto:${currentUser?.email}`}>{currentUser?.email}</a></span>.
                          </div>
                        </Grid>
                      </Grid>
                      <div className="payment-button">
                        <button className="button-on-right-panel" onClick={() => {
                          router.back();
                        }}>Quay l???i </button>
                        {!isOrderCreated && <button className="button-on-right-panel background-color-main" onClick={showModal}>Ti???p t???c</button>}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </SkeletonContainer>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CoursePay;