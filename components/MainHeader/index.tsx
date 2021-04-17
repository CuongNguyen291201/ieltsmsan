import React from 'react'
import { useDispatch } from 'react-redux'
import LoginModal from '../../sub_modules/common/components/loginModal'
import RegisterModal from '../../sub_modules/common/components/registerModal'
import { showLoginModalAction, showRegisterModalAction } from '../../sub_modules/common/redux/actions/userActions'
import './style.scss'
function MainHeader() {
  let dispatch = useDispatch()
  return (
    <div className="main-header ">
      <div className="container">
        <div className="logo">
          <img src="/home/logo.png" alt="" />
        </div>
        <div className="phone item">
          <div className="image">
            <img src="/home/header-phone.png" alt="" />
          </div>
          <div className="text">
            Hotline: 0947 0909 81
          </div>
        </div>
        <div className="mail item">
          <div className="image">
            <img src="/home/header-mail.png" alt="" />
          </div>
          <div className="text">
            Email: infor@onthisinhvien.com
          </div>
        </div>
        <div className="deal-shock item">
          <div className="text">Deals Shock</div>
          <div className="head">NEW</div>
        </div>
        <div className="cart item">
          <div className="image">
            <img src="/home/header-cart.png" alt="" />
          </div>
        </div>
        <div className="login text item" onClick={() => dispatch(showLoginModalAction(true))}>
          Đăng nhập
        </div>
        <div className="signup text item" onClick={() => dispatch(showRegisterModalAction(true))}>
          Đăng ký
        </div>
        <LoginModal></LoginModal>
        <RegisterModal></RegisterModal>
      </div>
    </div>
  )
}

export default MainHeader
