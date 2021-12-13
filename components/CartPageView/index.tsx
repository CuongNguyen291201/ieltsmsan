import { Grid, Paper, Rating } from "@mui/material";
import { useRouter } from 'next/router';
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useScrollToTop } from '../../hooks/scrollToTop';
import itemAvatar from '../../public/images/icons/item-avatar.png';
import { removeOneAction } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { Scopes } from '../../redux/types';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { Course } from '../../sub_modules/share/model/courses';
import { numberFormat } from '../../utils';
import { apiGetCourseByIds } from '../../utils/apis/courseApi';
import orderUtils from '../../utils/payment/orderUtils';
import { ROUTER_PAYMENT } from '../../utils/router';
import LoadingContainer from "../LoadingContainer";
import './style.scss';

const CartPageView = () => {
  useScrollToTop();
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser);
  const { items: courseIds, isLoading: cartLoading } = useSelector((state: AppState) => state.cartReducer);
  const [dataOrder, setDataOrder] = useState<Course[]>([]);
  const [dataTotal, setDataTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!cartLoading && courseIds?.length > 0) {
      apiGetCourseByIds(courseIds)
        .then((courses) => {
          setDataOrder(courses.reverse());
          const priceTotal = courses.reduce((total, item) => (total += item.cost - item.discountPrice, total), 0);
          setDataTotal(priceTotal)
          setLoading(false);
        })
        .catch(() => {
          enqueueSnackbar('Có lỗi xảy ra', { variant: "warning" })
          setDataOrder([]);
          setLoading(false);
        })
    } else {
      setLoading(false)
    }
  }, [cartLoading]);

  const onRemove = (value: string) => {
    const data = dataOrder?.filter(item => item._id !== value);
    const priceTotal = data.reduce((total, item) => (total += item.cost - item.discountPrice, total), 0);
    orderUtils.removeCourseFromCart(value, () => {
      dispatch(removeOneAction(Scopes.CART, value));
    });
    setDataTotal(priceTotal);
    setDataOrder(data)
  }

  return (
    <>
      <div className="course-order">
        <LoadingContainer loading={loading}>
          <div className="container">
            {dataOrder?.length > 0 ?
              <Grid container spacing={3}>
                <Grid item xs={12} md={8} className="order-item">
                  <div style={{ width: "100%" }}>
                    {dataOrder.map((item, i) =>
                      <Grid className="transaction-item" key={i} container>
                        <Grid item xs={12} sm={3}>
                          <img className="gwt-Image" src={item.avatar || itemAvatar} />
                        </Grid>
                        <Grid item xs={12} sm={6} className="infor">
                          <strong>
                            <div className="gwt-HTML">{item.name}</div>
                          </strong>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <span >(500) </span>
                            <span>
                              <Rating readOnly value={4.5} precision={0.5} size="small" />
                            </span>
                          </div>
                          <div className="dot-3" >
                            {item.shortDesc}
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={3} className="infor infor-order">
                          <button type="button" className="infor-order-close" onClick={() => onRemove(item._id)}>
                            <i className="far fa-times"></i>
                          </button>
                          {item.discountPrice !== 0 && <div className="discount-price">{numberFormat.format(item.cost)} VNĐ</div>}
                          <div className="gwt-HTML">{numberFormat.format(item.cost - item.discountPrice)} VND</div>
                        </Grid>
                      </Grid>
                    )}
                  </div>
                </Grid>

                <Grid item xs={12} md={4} className="total-price-left-panel">
                  <Paper className="total-price-left-panel-main">
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
                  </Paper>
                </Grid>
              </Grid>
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
        </LoadingContainer>
      </div>
    </>
  );
};

export default CartPageView;