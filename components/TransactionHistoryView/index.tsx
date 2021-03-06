import { Grid, Pagination } from "@mui/material";
import { useSnackbar } from "notistack";
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MapPaymentType } from '../../custom-types/MapContraint';
import itemAvatar from '../../public/images/icons/item-avatar.png';
import { AppState } from '../../redux/reducers';
import { PAYMENT_BANK } from '../../sub_modules/share/constraint';
import Order from '../../sub_modules/share/model/order';
import OrderCombo from '../../sub_modules/share/model/orderCombo';
import { UserInfo } from '../../sub_modules/share/model/user';
import { formatDateDMY, formatFullDateTime, formatTimeHMS, numberFormat } from '../../utils';
import { apiGetUserOrders } from '../../utils/apis/orderApi';
import { getCoursePageSlug } from '../../utils/router';
import Bank from '../CoursePay/payment-content/Bank';
import EmptyUI from "../EmptyUI";
import LoadingUI from "../LoadingUI";
import './style.scss';

const LOAD_LIMIT = 10;

const TransactionHistoryView = () => {
  const [state, setState] = useState<{
    activeOrder: Order; orders: Order[]; total: number; isLoading: boolean; currentPage: number;
  }>({
    activeOrder: null, orders: [], total: 0, isLoading: true, currentPage: 1
  });
  const user: UserInfo = useSelector((state: AppState) => state.userReducer.currentUser);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // const token = getCookie(TOKEN);
    // if (!token) {
    //   setState({ ...state, isLoading: false });
    //   return;
    // }
    apiGetUserOrders({ offset: 0, limit: LOAD_LIMIT })
      .then(({ data, total }) => {
        setState({ ...state, activeOrder: data[0] || null, orders: data, total, isLoading: false })
      })
      .catch((e) => {
        console.error(e);
        enqueueSnackbar("Có lỗi xảy ra", { variant: "error" });
        setState({ ...state, isLoading: false });
      })
  }, [user]);

  const onChangePage = (page: number) => {
    scroll({ top: 0, behavior: "smooth" });
    setState({ ...state, isLoading: true });
    // const token = getCookie(TOKEN);
    // if (!token) {
    //   setState({ ...state, isLoading: false });
    //   return;
    // }
    apiGetUserOrders({ offset: (page - 1) * LOAD_LIMIT, limit: LOAD_LIMIT })
      .then(({ data, total }) => {
        setState({ ...state, activeOrder: data[0] || null, orders: data, total, isLoading: false, currentPage: page })
      })
      .catch((e) => {
        console.error(e);
        enqueueSnackbar("Có lỗi xảy ra", { variant: "error" });
        setState({ ...state, isLoading: false });
      })
  }

  return (<>

    <div id="transaction-history" className="container">
      <Grid container spacing={2} className="main-transaction-view">
        <Grid item xs={12} md={3}>
          <div className="panel order-list">
            <label className="title">
              <h3>Danh sách đơn hàng</h3>
            </label>
            <LoadingUI loading={state.isLoading}>
              <div className="list">
                {state.orders.map((order) => (
                  <div
                    className={`item${state.activeOrder._id === order._id ? ' active' : ''}`}
                    key={order._id}
                    onClick={() => {
                      window.scroll({ top: 0, behavior: "smooth" });
                      setState({ ...state, activeOrder: order })
                    }}
                  >
                    <div className="item-detail">
                      <label>Ngày GD:</label> {formatDateDMY(order.createDate)}
                    </div>
                    <div className="item-detail">
                      <label>Thời gian GD:</label> {formatTimeHMS(order.createDate)}
                    </div>
                    <div className="item-detail">
                      <label>Mã đơn hàng:</label>
                      <span className="emp">&nbsp;{order.serial}</span>
                    </div>
                    <div className="item-detail">
                      <label>Giá trị:</label> {numberFormat.format(order.price)} VNĐ
                    </div>
                  </div>
                ))}
              </div>
            </LoadingUI>
          </div>
          <LoadingUI loading={state.isLoading}>
            <div className="orders-pagination">
              <Pagination count={Math.ceil((state.total || 1) / LOAD_LIMIT)} page={state.currentPage} onChange={(e, page) => onChangePage(page)} shape="rounded" variant="outlined" color="primary" />
            </div>
          </LoadingUI>
        </Grid>

        <Grid item xs={12} md={9}>
          <div className="panel order-detail">
            <LoadingUI loading={state.isLoading}>
              {state.total <= 0
                ? <EmptyUI description="Không có đơn hàng" />
                : <>
                  <div className="info">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div>
                          <label>Ngày giao dịch: </label>
                          {formatFullDateTime(state.activeOrder?.createDate)}
                        </div>
                        <div>
                          <label>Mã đơn hàng: </label>
                          <span className="emp">{state.activeOrder?.serial}</span>
                        </div>
                      </div>
                      <div>
                        <div>
                          <label>Giá trị: </label>
                          {numberFormat.format(state.activeOrder?.price)} VNĐ
                        </div>
                        <div>
                          <label>Giảm giá: </label>
                          {numberFormat.format(state.activeOrder?.discount)} VNĐ
                        </div>
                        <div>
                          <label>Tổng cộng: </label>
                          <span className="price">{numberFormat.format(state.activeOrder?.price - state.activeOrder?.discount)} VNĐ</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label>Hình thức thanh toán: </label>
                      {MapPaymentType[state.activeOrder?.paymentType || 0] || ''}
                      {state.activeOrder?.paymentType === PAYMENT_BANK &&
                        <Bank
                          orderSerial={state.activeOrder?.serial}
                          hideHeader
                          hideNotifMessage
                        />
                      }
                    </div>
                  </div>

                  <div className="combo">
                    {state.activeOrder?.orderCombo.map((combo: OrderCombo, i) => (
                      <Fragment key={i}>
                        <label>{combo.comboName || ''}</label>
                        <div className="course-list">
                          {combo.courses.map((course) => (
                            <a key={course._id} href={getCoursePageSlug({ course })} className="plain-anchor-tag">
                              <Grid container className="course-item" spacing={1}>
                                <Grid item xs={12} md={3}>
                                  <img style={{ width: "100%" }} src={course.avatar || itemAvatar} alt={course.name} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <div className="name">{course.name}</div>
                                </Grid>
                                <Grid xs={12} md={3}>
                                  <div className="right-md">
                                    {!!course.discountPrice && <div className="origin-price">{numberFormat.format(course.cost)} VNĐ</div>}
                                    <div className="price">{numberFormat.format(course.cost - course.discountPrice)} VNĐ</div>
                                    <div>
                                      <span role="label">Mã code: </span>
                                      <span className="active-code">{state.activeOrder?.codeId?.serial || 'Đang chờ'}</span>
                                    </div>
                                  </div>
                                </Grid>
                              </Grid>
                            </a>
                          ))}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </>
              }
            </LoadingUI>
          </div>
        </Grid>
      </Grid>
    </div>
  </>);
}

export default TransactionHistoryView;