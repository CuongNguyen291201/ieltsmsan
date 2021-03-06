import { Phone } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import Link from 'next/link';
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadListAction } from '../../redux/actions';
import { AppState } from "../../redux/reducers";
import { Scopes } from '../../redux/types';
import { showLoginModalAction } from "../../sub_modules/common/redux/actions/userActions";
import { Course } from "../../sub_modules/share/model/courses";
import { apiActiveCode, apiGetCodeInfo, apiLoadCourseByCode } from "../../utils/apis/courseApi";
import orderUtils from '../../utils/payment/orderUtils';
import { ROUTER_CART } from '../../utils/router';
import { MenuDesktop } from "../MenuDesktop";
import { MenuMobile } from "../MenuMobile";
import LoginModal from "./LoginModal";
import MenuChild from "./MenuItem/menuChild";
import RegisterModal from "./RegisterModal";
import "./style.scss";
function MainMenu(props: { hotLine?: string, webLogo?: string; disableFixedHeader?: boolean }) {
  const router = useRouter();
  // const [{ rootItems, mapItem }, menuLogic] = useReducer(webMenuReducer, menuState);
  const { rootItems, mapItem } = useSelector((state: AppState) => state.menuReducer);
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
          if (headerPage) {
            headerPage.classList.add('fixed-menu-top');
          }
        } else {
          if (headerPage) {
            headerPage.classList.remove('fixed-menu-top')
          }
        }
      }
      window.addEventListener("scroll", fixedTop);
      return () => {
        window.removeEventListener("scroll", fixedTop);
      }
    }
  }, []);

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
          setTextError("Code ???? qu?? h???n k??ch ho???t")
        }
      }
      else {
        setTextError("Code ???? ???????c s??? d???ng")
      }
    } else {
      setTextError('M?? k??ch ho???t sai!')
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
          <Grid container wrap="nowrap" justifyContent="space-between">
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
                <input type="text" placeholder="T??m ki???m th??ng tin..." />
              </div>
            </Grid>
            <Grid item md={8} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <div className="menu">
                {/* <div className="menu-item" onClick={() => router.push("/")}>
                  Kho?? H???c
                </div>
                <div
                  className="menu-item document"
                  onClick={() => router.push(ROUTER_DOCUMENT)}
                >
                  T??i li???u
                </div>
                <div style={{ display: 'none' }} className="menu-item">
                  Li??n h???
                </div>
                <div className="menu-item" onClick={() => router.push(ROUTER_NEWS)}>
                  S??? Ki???n
                </div>
                <div className="menu-item" onClick={() => router.push(ROUTER_NEWS)}>
                  Tin t???c
                </div>
                <div onClick={() => showModalActiveCourse()} className="active-course">
                  K??ch ho???t kh??a h???c
                </div> */}

                {!!rootItems && rootItems.map((item) => (
                  <div key={item._id} className="menu-item">
                    {mapItem[item._id].length > 0 ? <MenuChild item={item} mapItem={mapItem} /> : <Link href={item.url ?? ""} passHref><a className="plain-anchor-tag" style={{ color: "inherit" }}>{item.title}</a></Link>}
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
            title="K??ch ho???t kho?? h???c "
            open={showModalAct}
            onClose={hideModal}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle style={{ textAlign: "center" }}>K??ch ho???t kho?? h???c</DialogTitle>
            <DialogContent>
              <div className="wrapper-active-course">
                <div className="title-active-course">
                  <div>Nh???p m?? k??ch ho???t m?? h???c v??o ?? b??n d?????i</div>
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
                        <h3>{value?.cost.toLocaleString('vi', { currency: 'VND' })} VN??</h3>
                        <div>M?? Code</div>
                        <div className="title-course">{codeRef.current.value}</div>
                        {
                          !checkCourseIsActive(value?._id) ?
                            <Button size="small" variant="contained" onClick={() => handleActiveCode(value)} style={{ backgroundColor: '#3fb307', borderColor: '#3fb307' }}>K??ch ho???t</Button> :
                            <Button size="small" variant="contained" style={{ backgroundColor: '#d9534f', borderColor: '#d9534f' }}>???? k??ch ho???t</Button>
                        }
                      </div>
                    </div>
                  ))}
                <div className="search-code">
                  <button onClick={loadCourseByCode}>T??m ki???m</button>
                </div>
              </div>
              <div className="giai-dap-thac-mac">
                <div>Gi???i ????p th???c m???c Hotline:</div>{" "}
                <div>
                  <Phone /> {props.hotLine ?? ""}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <LoginModal />
          <RegisterModal />
        </div>
      </div >
    </div>
  );
}

export default MainMenu;
