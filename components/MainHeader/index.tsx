import { useRouter } from 'next/router'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../redux/reducers'
import LoginModal from '../../sub_modules/common/components/loginModal'
import RegisterModal from '../../sub_modules/common/components/registerModal'
import { showLoginModalAction, showRegisterModalAction } from '../../sub_modules/common/redux/actions/userActions'
import { removeCookie, TOKEN } from '../../sub_modules/common/utils/cookie'
import './style.scss'
function MainHeader() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser)
  const router = useRouter();
  return (
    <div className="main-header">
      <div className="container">
        <div className="logo" onClick={() => router.push('/')}>
          <img src="/home/logo.png" alt="" />
        </div>
        <div className="phone item">
          <div className="image">
            <img src="/home/header-phone.png" alt="" />
          </div>
          <div className="text">
            <span>Hotline:</span> 0947 0909 81
          </div>
        </div>
        <div className="mail item">
          <div className="image">
            <img src="/home/header-mail.png" alt="" />
          </div>
          <div className="text">
            <span>Email:</span> infor@onthisinhvien.com
          </div>
        </div>
        <div className="deal-shock item">
          <div className="text">Deals Shock</div>
          {/* <div className="head">NEW</div> */}
        </div>
        <div className="cart item">
          <div className="image">
            <img src="/home/header-cart.png" alt="" />
          </div>
        </div>
        {
          currentUser ? (
            <>
              <div className="current-user-wrap">
                <div className="current-user-text">Hi, {currentUser.name}</div>
              </div>
              <div className="logout text item" onClick={() => {
                removeCookie(TOKEN);
                router.reload();
              }}>Logout</div>
            </>
          ) : (
            <>
              <div className="login text item" onClick={() => dispatch(showLoginModalAction(true))}>
                Đăng nhập
              </div>
              <div className="signup text item" onClick={() => dispatch(showRegisterModalAction(true))}>
                Đăng ký
              </div>
            </>
          )
        }

        <LoginModal></LoginModal>
        <RegisterModal></RegisterModal>
      </div>
    </div>
  )
}

export default MainHeader
