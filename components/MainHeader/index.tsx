import { useRouter } from 'next/router'
import React, { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { notification } from 'antd';
import defaultAvatar from '../../public/default/default_avatar_otsv.jpg'
import { AppState } from '../../redux/reducers'
import LoginModal from '../../sub_modules/common/components/loginModal'
import RegisterModal from '../../sub_modules/common/components/registerModal'
import { loginSuccessAction, showLoginModalAction, showRegisterModalAction } from '../../sub_modules/common/redux/actions/userActions'
import { removeCookie, TOKEN } from '../../sub_modules/common/utils/cookie'
import { Menu, Dropdown, Row, Col } from 'antd';
import { useSocketNotification } from '../../hooks/socket';
import './style.scss'
function MainHeader() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser)
  const router = useRouter();

  const { socket, leaveRoom } = useSocketNotification({
    enabled: !!currentUser,
    // roomType: 0,
    userId: `notif_${currentUser._id}`,
    url: process.env.NEXT_PUBLIC_SOCKET_URL
  });

  const menu = (
    <Menu className="menu-notif">
      <Menu.Item key="0">
        <div className="notify-text">
          Thông báo
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <a href="#" className="notify-a" style={{ width: '275px' }}>
          <img className="img-notif" src="https://storage.googleapis.com/ielts-fighters.appspot.com/images/admin?t=1621992874279&amp;ignoreCache=1" />
          <div className="content_">
            admin đã bình luận trong khoá TÍNH NĂNG
          </div>
        </a>
      </Menu.Item>
      <Menu.Item key="2">
        <a href="#">2nd menu item</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">3rd menu item</Menu.Item>
    </Menu>
  )
  const toggleLangMenuRef = useRef<HTMLDivElement>();
  const toggleUserMenuRef = useRef<HTMLDivElement>();
  const [isShowLangOptions, setShowLangOptions] = useState(false);
  const [isShowUserMenu, setShowUserMenu] = useState(false);

  const toggleEvent = (e: Event) => {
    const target = e.target as Node;
    if (!toggleLangMenuRef.current?.contains(target)) {
      setShowLangOptions(false);
    }
    if (!toggleUserMenuRef.current?.contains(target)) {
      setShowUserMenu(false);
    }
  }

  const onSelectLanguage = (lang: string) => {
    console.log(lang);
    setShowLangOptions(false);
  }

  useEffect(() => {
    document.addEventListener('click', toggleEvent);
    return () => document.removeEventListener('click', toggleEvent);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('add-new-notification', (comment: any) => {
        if (comment.userId !== currentUser._id) {
          console.log('add-new-notification: ', comment)
          notification.info({
            message: `${comment.user.name} đã trả lời bình luận của bạn`,
            description: comment.content,
            placement: 'bottomLeft',
            duration: 10,
            onClick: () => {
              console.log('Notification Clicked!');
            },
          });
        }
      });

      return () => {
        console.log('leave-room')
        leaveRoom();
      }
    }
  }, [socket]);

  // useEffect(() => {
  //   document.documentElement.lang = 'vi';
  // }, []); // TODO: set a language dependency here


  return (
    <div className="main-header">
      <div className="container">
        <div className="logo" onClick={() => router.push('/')}>
          <img src="/home/logo.png" alt="" />
        </div>
        <div className="phone item">
          <img src="/home/header-phone.png" alt="" />
          <div className="text">
            <span>Hotline:</span> 0947 0909 81
          </div>
        </div>
        <div className="mail item">
          <img src="/home/header-mail.png" alt="" />
          <div className="text">
            <span>Email:</span> info@onthisinhvien.com
          </div>
        </div>
        <div className="lang item">
          <img src="/home/header-lang.png" alt="" />
          <div className="text">Ngôn ngữ</div>
          <div className="toggle-dropdown-menu" ref={toggleLangMenuRef} >
            <div className="toggle-button"
              onClick={() => {
                setShowLangOptions(!isShowLangOptions);
              }}
            >
              <img src="/home/icon-vietnam-flag.png" />
              <i className={`fas fa-caret-${isShowLangOptions ? 'up' : 'down'}`} />
            </div>

            {isShowLangOptions && <div
              className={`toggle-options${isShowLangOptions ? ' open' : ''}`}
            >
              <div id="lang-vi"
                className="toggle-item"
                onClick={() => onSelectLanguage('vi')}
              >
                <div className="icon-wrap">
                  <img src="/home/icon-vietnam-flag.png" />
                </div>
                Tiếng Việt
              </div>
              <div id="lang-en"
                className="toggle-item"
                onClick={() => onSelectLanguage('en')}
              >
                <div className="icon-wrap">
                  <img src="/home/icon-english.png" />
                </div>
                Tiếng Anh
              </div>
            </div>}
          </div>
        </div>
        <div className="deal-shock item">
          <div className="text">Deals Shock</div>
        </div>
        <div className="cart item">
          <img src="/home/header-cart.png" alt="" />
        </div>
        <div className="notification-item item">
          <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              <i className="far fa-bell notification"></i>
            </a>
          </Dropdown>
        </div>
        {
          currentUser ? (
            <>
              <div className="current-user-wrap item">
                <div className="user-menu-icon" onClick={() => setShowUserMenu(!isShowUserMenu)} ref={toggleUserMenuRef}>
                  <img src="/home/header-user.png" alt="" />
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
                    <div className="menu-item">
                      <i className="fas fa-exchange-alt" />
                      Lịch sử giao dịch
                    </div>
                    <div className="menu-item">
                      <i className="fas fa-graduation-cap" />
                      Khoá học của tôi
                    </div>
                    <div className="menu-item" onClick={() => {
                      removeCookie(TOKEN);
                      dispatch(loginSuccessAction(null));
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
                <div className="text">Đăng nhập</div>
              </div>
              <div className="signup text item" onClick={() => dispatch(showRegisterModalAction(true))}>
                Đăng ký
              </div>
            </>
          )
        }

        <LoginModal />
        <RegisterModal />
      </div>
    </div>
  )
}

export default memo(MainHeader);
