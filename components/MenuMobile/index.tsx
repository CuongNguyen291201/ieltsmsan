import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/reducers";
import { getCookie, TOKEN, removeCookie } from "../../sub_modules/common/utils/cookie";
import { apiLogout } from "../../utils/apis/auth";
import { ROUTER_DOCUMENT, ROUTER_NEWS, ROUTER_CART, ROUTER_TRANSACTION_HISTORY, ROUTER_MY_COURSES } from '../../utils/router';
import { showLoginModalAction, showRegisterModalAction } from "../../sub_modules/common/redux/actions/userActions";
import defaultAvatar from '../../public/images/icons/default_avatar_otsv.jpg'
import iconItemMenu from '../../public/images/icons/icon-item-menu.png'
import iconClose from '../../public/images/icons/icon-close.png'
import "./style.scss"
export const MenuMobile = () => {
    const [isActiveOnMobile, setisActiveOnMobile] = useState(false);
    const [showModalAct, setShowModalAct] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch()
    const currentUser = useSelector((state: AppState) => state.userReducer.currentUser)
    const [isShowUserMenu, setShowUserMenu] = useState(false);
    const showModalActiveCourse = () => {
        setShowModalAct(true);
    };
    const showMenu = () => {
        setisActiveOnMobile(!isActiveOnMobile)
    }
    return (
        <div id="menu-mobile" className="menu-mobile-">
            <div className="show-menu" onClick={() => showMenu()}>
                <div>
                    <i className="fas fa-bars"></i>
                </div>
            </div>
            <div className={`mobile-menu${isActiveOnMobile ? " active" : ""}`}>
                <div className="wraper-show" onClick={() => showMenu()}>
                    {currentUser ? (<div className="user-profile">
                        <img src={currentUser?.avatar || defaultAvatar} alt="" />
                        <div className="user-info">
                            <div className="info-text">{currentUser.name}</div>
                            <div className="info-text">{currentUser.email}</div>
                        </div>
                    </div>) : (<div></div>)}
                    <img className="icon-close" src={iconClose} alt="iconClose" />
                </div>
                <div className="wraper-menu-item">
                    <div className="menu-item" onClick={() => router.push("/")}>
                        <span><img src={iconItemMenu} alt="iconItemMenu" /></span>Khoá Học
                    </div>
                    <div
                        className="menu-item document"
                        onClick={() => router.push(ROUTER_DOCUMENT)}
                    >
                        <span><img src={iconItemMenu} alt="iconItemMenu" /></span>Tài liệu
                    </div>
                    <div style={{ display: 'none' }} className="menu-item">
                        <span><img src={iconItemMenu} alt="iconItemMenu" /></span>Liên hệ
                    </div>
                    <div className="menu-item" onClick={() => router.push(ROUTER_NEWS)}>
                        <span><img src={iconItemMenu} alt="iconItemMenu" /></span>Sự Kiện
                    </div>
                    <div className="menu-item" onClick={() => router.push(ROUTER_NEWS)}>
                        <span><img src={iconItemMenu} alt="iconItemMenu" /></span>Tin tức
                    </div>
                    <div onClick={() => showModalActiveCourse()} className="menu-item">
                        <span><img src={iconItemMenu} alt="iconItemMenu" /></span>Kích hoạt khóa học
                    </div>
                    <div>
                        {
                            currentUser ? (
                                <>
                                    <div className="current-user-wrap item">
                                        <div className="user-menu">
                                            <div className="menu-item" onClick={() => router.push(ROUTER_TRANSACTION_HISTORY)}>
                                                <span><img src={iconItemMenu} alt="iconItemMenu" /></span>Lịch sử giao dịch
                                            </div>
                                            <div className="menu-item" onClick={() => router.push(ROUTER_MY_COURSES)}>
                                                <span><img src={iconItemMenu} alt="iconItemMenu" /></span>Khoá học của tôi
                                            </div>
                                            {/* <div className="menu-item" onClick={() => router.push(getBrowserSlug('cms', PAGE_REPLY_COMMENT, 'comment'))} >
                <i className="fas fa-wrench"></i>
                Trả lời bình luận
              </div> */}
                                            <div className="menu-item" onClick={() => {
                                                apiLogout().then(() => {
                                                    router.reload()
                                                });
                                            }}>
                                                <span><img src={iconItemMenu} alt="iconItemMenu" /></span>Đăng xuất
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="login menu-item" onClick={() => { dispatch(showLoginModalAction(true)); showMenu() }}>
                                        {/* <img src="/images/home/header-user.png" alt="" /> */}
                                        {/* <i className="fas fa-user-circle header-icon"></i> */}
                                        <div className="text"><span><img src={iconItemMenu} alt="iconItemMenu" /></span>Đăng nhập</div>
                                    </div>
                                    <div className="signup text menu-item" onClick={() => dispatch(showRegisterModalAction(true))}>
                                        <span><img src={iconItemMenu} alt="iconItemMenu" /></span>Đăng kí
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>

    )

}