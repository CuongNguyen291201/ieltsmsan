import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/reducers";
import Link from 'next/link';
import defaultAvatar from '../../public/images/icons/default_avatar_otsv.jpg'
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { ROUTER_DOCUMENT, ROUTER_NEWS, ROUTER_CART, ROUTER_TRANSACTION_HISTORY, ROUTER_MY_COURSES, ROUTER_LOGIN, ROUTER_REGISTER, ROUTER_USER_INFO } from '../../utils/router';
import { getCookie, TOKEN, removeCookie } from '../../sub_modules/common/utils/cookie';
import { apiLogout } from '../../utils/apis/auth';
import { loginSuccessAction, showLoginModalAction, showRegisterModalAction } from "../../sub_modules/common/redux/actions/userActions";
import "./style.scss";

export const MenuDesktop = () => {
    const currentUser = useSelector((state: AppState) => state.userReducer.currentUser)
    const [isShowUserMenu, setShowUserMenu] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch()
    const toggleUserMenuRef = useRef<HTMLDivElement>();
    const handleClickLogin = () => {
        const currentPath = router.asPath;
        if (!currentPath.startsWith(ROUTER_LOGIN)) {
            const query = router.query;
            if (!query.return_uri) query.return_uri = currentPath;
            router.push({
                pathname: ROUTER_LOGIN,
                query
            });
        }
    }
    const handleClickRegister = () => {
        const currentPath = router.asPath;
        if (!currentPath.startsWith(ROUTER_REGISTER)) {
            const query = router.query;
            if (!query.return_uri) query.return_uri = currentPath;
            router.push({
                pathname: ROUTER_REGISTER,
                query
            });
        }
    }
    return (
        <div id="menu-desktop">
            {
                currentUser ? (
                    <>
                        <div className="current-user-wrap item">
                            <div className="user-menu-icon" onClick={() => setShowUserMenu(!isShowUserMenu)} ref={toggleUserMenuRef}>
                                {/* <img src="/images/home/header-user.png" alt="" /> */}
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
                                    <div className="menu-item" onClick={() => router.push(ROUTER_USER_INFO)}>
                                    <i className="fas fa-id-card" />
                                        Thông tin tài khoản
                                    </div>
                                    {/* <div className="menu-item" onClick={() => router.push(getBrowserSlug('cms', PAGE_REPLY_COMMENT, 'comment'))} >
                <i className="fas fa-wrench"></i>
                Trả lời bình luận
              </div> */}
                                    <div className="menu-item" onClick={() => {
                                        apiLogout().then(() => {
                                            dispatch(loginSuccessAction(null));
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
                        {/* <div className="login item" onClick={() => dispatch(showLoginModalAction(true))}>
                            <img src="/images/home/header-user.png" alt="" />
                            <i className="fas fa-user-circle header-icon"></i>
                            <div className="text">Log in</div>
                        </div> */}
                        <div className="login item" onClick={handleClickLogin}>
                            <span className="text">Log in</span>
                        </div>
                        {/* <div className="signup text item" onClick={() => dispatch(showRegisterModalAction(true))}>
                            Sign up
                        </div> */}
                        <div className="signup text item" style={{ color: "#fff" }} onClick={handleClickRegister}>
                            <span className="text">Sign up</span>
                        </div>
                    </>
                )
            }
        </div>
    )
}