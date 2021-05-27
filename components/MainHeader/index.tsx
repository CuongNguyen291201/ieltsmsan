import { useRouter } from 'next/router'
import React, { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import defaultAvatar from '../../public/default/default_avatar_otsv.jpg'
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
  const toggleLangMenuRef = useRef<HTMLDivElement>();
  const [isShowLangOptions, setShowLangOptions] = useState(false);

  const toggleLanguageEvent = (e: Event) => {
    const target = e.target as Node;
    if (!toggleLangMenuRef.current?.contains(target)) {
      setShowLangOptions(false);
    }
  }

  const onSelectLanguage = (lang: string) => {
    console.log(lang);
    setShowLangOptions(false);
  }

  useEffect(() => {
    document.addEventListener('click', toggleLanguageEvent);
    return () => document.removeEventListener('click', toggleLanguageEvent);
  }, []);

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
        {
          currentUser ? (
            <>
              <div className="current-user-wrap">
                <img src="/home/header-user.png" alt="" />
                <div className="user-menu-panel">
                  <div className="user-profile">
                    <img src={currentUser.avatar || defaultAvatar} alt="" />
                    <div>
                      <div className="user-name">{currentUser.name}</div>
                      <div className="user-email">{currentUser.email || ''}</div>
                    </div>
                  </div>
                </div>
                <div className="user-menu">
                  <div className="menu-item">
                    Lịch sử giao dịch
                  </div>
                  <div className="menu-item">
                    Khoá học của tôi
                  </div>
                  <div className="menu-item">
                    Đăng xuất
                  </div>
                </div>
              </div>
              <div className="logout text item" onClick={() => {
                removeCookie(TOKEN);
                router.reload();
              }}>Đăng xuất</div>
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
