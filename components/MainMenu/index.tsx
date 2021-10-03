import { PhoneOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import Link from 'next/link';
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/reducers";
import { showLoginModalAction, showRegisterModalAction } from "../../sub_modules/common/redux/actions/userActions";
import { getCookie, TOKEN, removeCookie } from '../../sub_modules/common/utils/cookie';
import { Course } from "../../sub_modules/share/model/courses";
import { apiActiveCode, apiGetCodeInfo, apiLoadCourseByCode } from "../../utils/apis/courseApi";
import { ROUTER_DOCUMENT, ROUTER_NEWS, ROUTER_CART, ROUTER_TRANSACTION_HISTORY, ROUTER_MY_COURSES } from '../../utils/router';
import { apiLogout } from '../../utils/apis/auth';
import defaultAvatar from '../../public/default/default_avatar_otsv.jpg'
import chooseLanguage from '../../public/default/language.png'
import { loadListAction } from '../../redux/actions';
import { Scopes } from '../../redux/types';
import orderUtils from '../../utils/payment/orderUtils';
import "./style.scss";
import { Grid } from "@material-ui/core";
import LoginModal from "../../sub_modules/common/components/loginModal";
import RegisterModal from "../../sub_modules/common/components/registerModal";
function MainMenu(props: { hotLine?: string }) {
  const router = useRouter();
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser)
  const [isActiveOnMobile, setisActiveOnMobile] = useState(false);
  const [showModalAct, setShowModalAct] = useState(false);
  const [courses, setCourses] = useState<Array<Course>>([]);
  const [textError, setTextError] = useState<String>("");
  const [activedIds, setActivedIds] = useState<string[]>([])
  const { items: cartItems, isLoading: cartLoading } = useSelector((state: AppState) => state.cartReducer);
  const [isShowUserMenu, setShowUserMenu] = useState(false);
  const toggleUserMenuRef = useRef<HTMLDivElement>();

  const codeRef = useRef(null);
  const dispatch = useDispatch()

  const showModalActiveCourse = () => {
    setShowModalAct(true);
  };
  const hideModal = () => {
    setShowModalAct(false);
    resetData()
  };

  const resetData = () => {
    codeRef.current.value = '';
    setTextError('');
    setCourses([])
  }
  useEffect(() => {
    if (cartLoading) {
      dispatch(loadListAction(Scopes.CART, orderUtils.getCartItemsStorage()))
    }
  }, [cartLoading]);
  const getCodeInfo = async () => {
    const codeInfo = await apiGetCodeInfo(codeRef.current.value);
    if (codeInfo.data) {
      if (codeInfo.data.userBuyId === currentUser._id || codeInfo.data.userBuyId === null) {
        if (codeInfo.data.startTime <= Date.now() && (codeInfo.data.endTime >= Date.now() || codeInfo.data.endTime === 0)) {
          const { courses, activedIds } = await apiLoadCourseByCode(codeRef.current.value);
          setCourses(courses ?? []);
          setActivedIds(activedIds ?? []);
          setTextError("")
        }
        else {
          setTextError("Code đã quá hạn kích hoạt")
        }
      }
      else {
        setTextError("Code đã được sử dụng")
      }
    } else {
      setTextError('Mã kích hoạt sai!')
    }
  }

  // useEffect(() => {
  //   const userActive = apiGetCoursesActivedByUser({ userId: currentUser._id })
  //   setListCourseActived(userActive.data)
  // }, [])

  const loadCourseByCode = async () => {
    if (!currentUser) {
      hideModal();
      dispatch(showLoginModalAction(true));
      return;
    }
    getCodeInfo()
  };

  const handleActiveCode = async (course: Course) => {
    try {
      const token = getCookie(TOKEN);
      if (!token) return;
      const userCourse = await apiActiveCode({ code: codeRef.current.value, token, courseId: course._id });
      if (!!userCourse) {
        setActivedIds([...activedIds, userCourse.courseId]);
      }
    } catch (e) {
      setTextError(e?.message);
    }
  }

  // const checkExpriseCourse = (_id: string) => {
  //   if (userCourses.length > 0) {
  //     return userCourses.some(value => value?.course?._id === _id)
  //   }
  //   else {
  //     return false
  //   }
  // }

  const checkCourseIsActive = (_id: string) => {
    return activedIds.length && activedIds.includes(_id);
  }

  return (
    <div className="main-menu">
      <div className="layout-header">
        <Grid md={4} className="left-header">
          <div className="logo" onClick={() => router.push('/')}>
            <img src="/hvvv/logo.png" alt="" />
          </div>
          <div className="search">
            <div className="icon">
              <img src="/home/search-icon.png" alt="" />
            </div>
            <input type="text" placeholder="Tìm kiếm" />
          </div>
        </Grid>
        <Grid md={8} className={`${isActiveOnMobile ? "active-on-mobile" : ""} menu`}>
          <div
            className="close-menu-icon"
            onClick={() => {
              setisActiveOnMobile(false);
            }}
          >
            <i className="fas fa-arrow-right"></i>
          </div>

          <div className="menu-item" onClick={() => router.push("/")}>
            Khoá Học
          </div>
          <div
            className="menu-item document"
            onClick={() => router.push(ROUTER_DOCUMENT)}
          >
            Tài liệu
          </div>
          <div style={{ display: 'none' }} className="menu-item">
            Liên hệ
          </div>
          <div className="menu-item" onClick={() => router.push(ROUTER_NEWS)}>
            Sự Kiện
          </div>
          <div className="menu-item" onClick={() => router.push(ROUTER_NEWS)}>
            Tin tức
          </div>
          {/* <div className="menu-item">
            Liên hệ
          </div> */}
          <div onClick={() => showModalActiveCourse()} className="active-course">
            Kích hoạt khóa học
          </div>
          <div className="cart item" onClick={() => router.push(ROUTER_CART)}>
            <i className="far fa-shopping-cart shopping-cart"></i>
            {!cartLoading && cartItems.length > 0 &&
              <span className="cart-number">{cartItems.length}</span>
            }
          </div>
          {
            currentUser ? (
              <>

                <div className="current-user-wrap item">
                  <div className="user-menu-icon" onClick={() => setShowUserMenu(!isShowUserMenu)} ref={toggleUserMenuRef}>
                    {/* <img src="/home/header-user.png" alt="" /> */}
                    <i className="fas fa-user-circle user-acc"></i>
                  </div>
                  {isShowUserMenu && (<div className="user-menu-panel">
                    <div className="user-profile">
                      <img src={currentUser.avatar || defaultAvatar} alt="" />
                      <div className="user-info">
                        <div className="info-text">{currentUser.name}</div>
                        <div className="info-text">{currentUser.email}</div>
                      </div>
                    </div>
                    <div className="user-menu">
                      <div className="menu-item" onClick={() => router.push(ROUTER_TRANSACTION_HISTORY)}>
                        <i className="fas fa-exchange-alt" />
                        Lịch sử giao dịch
                      </div>
                      <div className="menu-item" onClick={() => router.push(ROUTER_MY_COURSES)}>
                        <i className="fas fa-graduation-cap" />
                        Khoá học của tôi
                      </div>
                      {/* <div className="menu-item" onClick={() => router.push(getBrowserSlug('cms', PAGE_REPLY_COMMENT, 'comment'))} >
                      <i className="fas fa-wrench"></i>
                      Trả lời bình luận
                    </div> */}
                      <div className="menu-item" onClick={() => {
                        const token = getCookie(TOKEN);
                        if (!!token) apiLogout({ token }).then(() => {
                          removeCookie(TOKEN);
                          router.reload()
                        });
                      }}>
                        <i className="fas fa-sign-out" />
                        Đăng xuất
                      </div>
                    </div>
                  </div>)}
                </div>
              </>
            ) : (
              <>
                <div className="login item" onClick={() => dispatch(showLoginModalAction(true))}>
                  <img src="/home/header-user.png" alt="" />
                  <i className="fas fa-user-circle header-icon"></i>
                  <div className="text">Log in</div>
                </div>
                <div className="signup text item" onClick={() => dispatch(showRegisterModalAction(true))}>
                  Sign up
                </div>
              </>
            )
          }
          <div>
            <img style={{ width: '33px' }} src={chooseLanguage} alt="chooseLanguage" />
          </div>
        </Grid>
        <div className="hideDesktop">
          <div className="cart item" onClick={() => router.push(ROUTER_CART)}>
            <i className="far fa-shopping-cart shopping-cart"></i>
            {!cartLoading && cartItems.length > 0 &&
              <span className="cart-number">{cartItems.length}</span>
            }
          </div>
          {
            currentUser ? (
              <>

                <div className="current-user-wrap item">
                  <div className="user-menu-icon" onClick={() => setShowUserMenu(!isShowUserMenu)} ref={toggleUserMenuRef}>
                    {/* <img src="/home/header-user.png" alt="" /> */}
                    <i className="fas fa-user-circle user-acc"></i>
                  </div>
                  {isShowUserMenu && (<div className="user-menu-panel">
                    <div className="user-profile">
                      <img src={currentUser.avatar || defaultAvatar} alt="" />
                      <div className="user-info">
                        <div className="info-text">{currentUser.name}</div>
                        <div className="info-text">{currentUser.email}</div>
                      </div>
                    </div>
                    <div className="user-menu">
                      <div className="menu-item" onClick={() => router.push(ROUTER_TRANSACTION_HISTORY)}>
                        <i className="fas fa-exchange-alt" />
                        Lịch sử giao dịch
                      </div>
                      <div className="menu-item" onClick={() => router.push(ROUTER_MY_COURSES)}>
                        <i className="fas fa-graduation-cap" />
                        Khoá học của tôi
                      </div>
                      {/* <div className="menu-item" onClick={() => router.push(getBrowserSlug('cms', PAGE_REPLY_COMMENT, 'comment'))} >
                      <i className="fas fa-wrench"></i>
                      Trả lời bình luận
                    </div> */}
                      <div className="menu-item" onClick={() => {
                        const token = getCookie(TOKEN);
                        if (!!token) apiLogout({ token }).then(() => {
                          removeCookie(TOKEN);
                          router.reload()
                        });
                      }}>
                        <i className="fas fa-sign-out" />
                        Đăng xuất
                      </div>
                    </div>
                  </div>)}
                </div>
              </>
            ) : (
              <>
                <div className="login item" onClick={() => dispatch(showLoginModalAction(true))}>
                  <img src="/home/header-user.png" alt="" />
                  <i className="fas fa-user-circle header-icon"></i>
                  <div className="text">Log in</div>
                </div>
                <div className="signup text item" onClick={() => dispatch(showRegisterModalAction(true))}>
                  Sign up
                </div>
              </>
            )
          }
          <div
            className="menu-icon item"
            onClick={() => setisActiveOnMobile(true)}
          >
            <i className="far fa-bars" />
          </div>
        </div>

        <div
          className={`${isActiveOnMobile ? "active-on-mobile" : ""
            } overlay-on-mobile`}
        ></div>
      </div>
      <div className="modal-active-course">
        <Modal
          title="Kích hoạt khoá học "
          visible={showModalAct}
          onCancel={hideModal}
          cancelText="Cancel"
          footer=""
        >
          <div className="wrapper-active-course">
            <div className="title-active-course">
              <div>Nhập mã kích hoạt mã học vào ô bên dưới</div>
            </div>
            <div className="insert-code">
              <input type="text" ref={codeRef} />
            </div>
            <div style={{ color: 'red' }}>{textError}</div>
            {courses?.length > 0 &&
              courses?.map((value, key) => (
                <div key={key} className="course-item-modal">
                  <div className="course-subitem">
                    <img src={value?.avatar} className="course-avatar-modal" />
                    <div style={{ textAlign: "left", marginLeft: 2 }}>
                      <p className="title-course">{value?.name}</p>
                      <p className="des-course">{value?.shortDesc}</p>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3>{value?.cost.toLocaleString('vi', { currency: 'VND' })} VNĐ</h3>
                    <div>Mã Code</div>
                    <div className="title-course">{codeRef.current.value}</div>
                    {
                      !checkCourseIsActive(value?._id) ?
                        <Button size="small" type="primary" onClick={() => handleActiveCode(value)} style={{ backgroundColor: '#3fb307', borderColor: '#3fb307' }}>Kích hoạt</Button> :
                        <Button size="small" type="primary" style={{ backgroundColor: '#d9534f', borderColor: '#d9534f' }}>Đã kích hoạt</Button>
                    }
                  </div>
                </div>
              ))}
            <div className="search-code">
              <button onClick={loadCourseByCode}>Tìm kiếm</button>
            </div>
          </div>
          <div className="giai-dap-thac-mac">
            <div>Giải đáp thắc mắc Hotline:</div>{" "}
            <div>
              <PhoneOutlined /> {props.hotLine ?? ""}
            </div>
          </div>
        </Modal>
        <LoginModal />
        <RegisterModal />
      </div>
    </div>
  );
}

export default MainMenu;
