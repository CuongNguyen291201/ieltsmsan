import { Button, Dialog, DialogContent, DialogTitle, Grid } from "@material-ui/core";
import { Phone } from "@material-ui/icons"
import Link from 'next/link';
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadListAction } from '../../redux/actions';
import { AppState } from "../../redux/reducers";
import { Scopes } from '../../redux/types';
import LoginModal from "../../sub_modules/common/components/loginModal";
import RegisterModal from "../../sub_modules/common/components/registerModal";
import { showLoginModalAction } from "../../sub_modules/common/redux/actions/userActions";
import { Course } from "../../sub_modules/share/model/courses";
import { apiActiveCode, apiGetCodeInfo, apiLoadCourseByCode } from "../../utils/apis/courseApi";
import { webMenuApi } from "../../utils/apis/menuApi";
import orderUtils from '../../utils/payment/orderUtils';
import { ROUTER_CART, ROUTER_DOCUMENT, ROUTER_NEWS } from '../../utils/router';
import { MenuDesktop } from "../MenuDesktop";
import { MenuMobile } from "../MenuMobile";
import MenuChild from "./MenuItem/menuChild";
import { menuState, webMenuReducer, webMenuAction } from "./MenuItem/webMenu.reducer";
import "./style.scss";
function MainMenu(props: { hotLine?: string, webLogo?: string; disableFixedHeader?: boolean }) {
  const router = useRouter();
  const [{ rootItems, mapItem }, menuLogic] = useReducer(webMenuReducer, menuState);
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser)
  const [showModalAct, setShowModalAct] = useState(false);
  const [courses, setCourses] = useState<Array<Course>>([]);
  const [textError, setTextError] = useState<String>("");
  const [activedIds, setActivedIds] = useState<string[]>([])
  const { items: cartItems, isLoading: cartLoading } = useSelector((state: AppState) => state.cartReducer);
  const toggleUserMenuRef = useRef<HTMLDivElement>();

  const codeRef = useRef(null);
  const dispatch = useDispatch();


  useEffect(() => {
    if (!props.disableFixedHeader) {
      const fixedTop = () => {
        const headerPage = document.getElementById("main-menu");
        const offsetHeightPage = 112;
        if (window.pageYOffset > offsetHeightPage) {
          headerPage.classList.add('fixed-menu-top');
        } else {
          headerPage.classList.remove('fixed-menu-top')
        }
      }
      window.addEventListener("scroll", fixedTop);
      return () => {
        window.removeEventListener("scroll", fixedTop);
      }
    }
  }, []);

  useEffect(() => {
    webMenuApi().then((res) => {
      menuLogic(webMenuAction(res));
    })
  }, [])

  useEffect(() => {
    if (cartLoading) {
      dispatch(loadListAction(Scopes.CART, orderUtils.getCartItemsStorage()))
    }
  }, [cartLoading]);

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
      // const token = getCookie(TOKEN);
      // if (!token) return;
      const userCourse = await apiActiveCode({ code: codeRef.current.value, courseId: course._id });
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
    <div id="main-menu">
      <div className="main-menu">
        <div className="layout-header">
          <Grid container wrap="nowrap" justify="space-between">
            <Grid item md={4} className="left-header">
              <Link href='/'>
                <a>
                  <div className="logo">
                    <img src={props.webLogo} alt="logo" />
                  </div>
                </a>
              </Link>
              <div className="search">
                <div className="icon">
                  <i style={{ fontSize: '17px', color: '#A4ADD7' }} className="far fa-search"></i>
                </div>
                <input type="text" placeholder="Tìm kiếm thông tin..." />
              </div>
            </Grid>
            <Grid item md={8} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <div className="menu">
                {/* <div className="menu-item" onClick={() => router.push("/")}>
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
                <div onClick={() => showModalActiveCourse()} className="active-course">
                  Kích hoạt khóa học
                </div> */}

                {!!rootItems && rootItems.map((item) => (
                  <div key={item._id} className="menu-item">
                    {mapItem[item._id].length > 0 ? <MenuChild item={item} mapItem={mapItem} /> : <span onClick={() => router.push(item.url)}>{item.title}</span>}
                  </div>
                ))}

                <div className="cart item" onClick={() => router.push(ROUTER_CART)}>
                  <i className="far fa-shopping-cart shopping-cart"></i>
                  {!cartLoading && cartItems.length > 0 &&
                    <span className="cart-number">{cartItems.length}</span>
                  }
                </div>
                <MenuDesktop />
                <div className="lang item" >
                  <i className="far fa-globe" />
                  {/* <img style={{ width: '33px', margin:'0px 10px', mixBlendMode: "difference" }} src={chooseLanguage} alt="chooseLanguage" /> */}
                </div>
              </div>

              <div className="hideDesktop">
                <div className="cart item" onClick={() => router.push(ROUTER_CART)}>
                  <i className="far fa-shopping-cart shopping-cart"></i>
                  {!cartLoading && cartItems.length > 0 &&
                    <span className="cart-number">{cartItems.length}</span>
                  }
                </div>
                <MenuMobile rootItems={rootItems} mapItem={mapItem} />
              </div>
            </Grid>
          </Grid>
        </div >
        <div className="modal-active-course">
          <Dialog
            title="Kích hoạt khoá học "
            open={showModalAct}
            onClose={hideModal}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle style={{ textAlign: "center" }}>Kích hoạt khoá học</DialogTitle>
            <DialogContent>
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
                            <Button size="small" variant="contained" onClick={() => handleActiveCode(value)} style={{ backgroundColor: '#3fb307', borderColor: '#3fb307' }}>Kích hoạt</Button> :
                            <Button size="small" variant="contained" style={{ backgroundColor: '#d9534f', borderColor: '#d9534f' }}>Đã kích hoạt</Button>
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
                  <Phone /> {props.hotLine ?? ""}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <LoginModal mainBgrColor="#19CE7A" mainTextColor="#FFF" />
          <RegisterModal mainBgrColor="#19CE7A" mainTextColor="#FFF" />
        </div>
      </div >
    </div>
  );
}

export default MainMenu;
