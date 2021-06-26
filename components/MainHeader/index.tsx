import { useRouter } from 'next/router'
import React, { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { notification } from 'antd';
import defaultAvatar from '../../public/default/default_avatar_otsv.jpg'
import { AppState } from '../../redux/reducers'
import LoginModal from '../../sub_modules/common/components/loginModal'
import RegisterModal from '../../sub_modules/common/components/registerModal'
import { loginSuccessAction, showLoginModalAction, showRegisterModalAction } from '../../sub_modules/common/redux/actions/userActions'
import { apiListNotificationByTarget, apiUpdateReadStatusNotification, apiListNotificationByReadStatus } from '../../utils/apis/notificationApi';
import { removeCookie, TOKEN } from '../../sub_modules/common/utils/cookie'
import { formatFullDateTime, getBrowserSlug } from '../../utils';
import { Menu, Dropdown, Row, Col } from 'antd';
import { useSocketNotification } from '../../hooks/socket';
import { TOPIC_DETAIL_PAGE_TYPE, COURSE_DETAIL_PAGE_TYPE, REPLY_COMMENT_PAGE_TYPE, COURSE_ORDER_PAGE_TYPE } from '../../sub_modules/share/constraint';
import SanitizedDiv from '../SanitizedDiv';
import './style.scss'
import { route } from 'next/dist/next-server/server/router';

let dataNotification = []
let dataNotiCount = []

function MainHeader() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser)
  const courseId = useSelector((state: AppState) => state.courseReducer.courseId)
  const removeCourseId = useSelector((state: AppState) => state.courseReducer.removeCourseId)
  const router = useRouter();
  const [dataNoti, setDataNoti] = useState([]);
  const [dataCount, setDataCount] = useState([]);
  const [dataCountOrder, setDataCountOrder] = useState(0);
  const { socket, leaveRoom } = useSocketNotification({
    enabled: !!currentUser,
    // roomType: 0,
    userId: currentUser?._id ? `notif_${currentUser?._id}` : null,
    url: process.env.NEXT_PUBLIC_SOCKET_URL
  });
  const [lang, setLang] = useState('vi');

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
    // console.log(lang);
    setLang(lang)
    localStorage.setItem('language', lang)
    setShowLangOptions(false);
  }

  useEffect(() => {
    setLang(localStorage.getItem('language'))
    document.addEventListener('click', toggleEvent);
    return () => document.removeEventListener('click', toggleEvent);
  }, []);

  useEffect(() => {
    if (currentUser?._id) {
      apiListNotificationByTarget({ target: currentUser?._id, offset: 0 })
        .then((data) => {
          if (data?.data?.result?.length > 0) {
            dataNotification = [...data.data.result]
            setDataNoti([...data.data.result])
          }
        });
      apiListNotificationByReadStatus({ target: currentUser?._id, offset: 0 })
        .then((data) => {
          dataNotiCount = data.data || []
          setDataCount(data?.data || [])
        });
    }
  }, [currentUser]);
  useEffect(() => {

    setDataCountOrder(localStorage.getItem('courseIds') ? localStorage.getItem('courseIds').split(',')?.length : 0)
  }, [courseId]);

  useEffect(() => {
    if (removeCourseId) {
      setDataCountOrder(localStorage.getItem('courseIds') ? localStorage.getItem('courseIds').split(',')?.length : 0)
    }
  }, [removeCourseId]);

  useEffect(() => {
    if (socket) {
      socket.on('add-new-notification', (dataArr: any) => {
        if (dataArr.userId !== currentUser._id) {
          // console.log('dataArr: ', dataArr);
          let dataNew = dataArr
          dataNotification = [dataNew, ...dataNotification]
          dataNotiCount = [dataNew, ...dataNotiCount]
          setDataNoti([...dataNotification])
          setDataCount(dataNotiCount?.filter(item => item.readStatus === 0) || [])
          notification.info({
            message: `${dataArr.user?.name} đã trả lời bình luận của bạn trong ${dataArr.topicId ? `bài học ${dataArr?.topic?.name}` : `khóa học ${dataArr?.course?.name}`}`,
            description: <SanitizedDiv className="description-html" content={dataArr.content} />,
            placement: 'bottomLeft',
            duration: 20,
            icon: <img src={dataArr.user?.avatar || defaultAvatar} style={{ width: '24px', height: '24px', borderRadius: '30px' }} alt="" />,
            onClick: () => {
              handleReadStatus(dataArr._id)
              router.push({
                pathname: getBrowserSlug(dataArr.topic?.slug || dataArr.course?.slug, dataArr.topic?.type ? TOPIC_DETAIL_PAGE_TYPE : COURSE_DETAIL_PAGE_TYPE, dataArr.topic?._id || dataArr.course?._id),
                query: { discussionsId: dataArr.discussionsId || dataArr.parentId as string }
              });
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

  const handleMore = () => {
    if (currentUser?._id) {
      apiListNotificationByTarget({ target: currentUser?._id, offset: dataNoti?.length || 0 })
        .then((data) => {
          if (data?.data?.result?.length > 0) {
            dataNotification = [...dataNotification, ...data.data.result]
            // dataNotiCount = [...dataNotiCount, ...data.data]
            setDataNoti([...dataNotification])
            // setDataCount(dataNotiCount?.filter(item => item.readStatus === 0) || [])
          }
        });
    }
  }

  const handleReadStatus = (value) => {
    apiUpdateReadStatusNotification({ notificationId: value })
  }

  // useEffect(() => {
  //   document.documentElement.lang = 'vi';
  // }, []); // TODO: set a language dependency here

  return (
    <div className="main-header">
      <div className="container">
        <div className="logo" onClick={() => router.push('/')}>
          <img src="/home/logo-02-3.png" alt="" />
        </div>
        <div className="phone item">
          {/* <img src="/home/header-phone.png" alt="" /> */}
          <i className="fas fa-phone header-icon"></i>
          <div className="text">
            <span>Hotline:</span> 0947 0909 81
          </div>
        </div>
        <div className="mail item">
          {/* <img src="/home/header-mail.png" alt="" /> */}
          <i className="fas fa-envelope header-icon"></i>
          <div className="text">
            <span>Email:</span> info@onthisinhvien.com
          </div>
        </div>
        <div className="lang item">
          {/* <img className="img" src="/home/header-lang.png" alt="" /> */}
          <i className="fal fa-globe header-icon"></i>
          <div className="text">Ngôn ngữ</div>
          <div className="toggle-dropdown-menu" ref={toggleLangMenuRef} >
            <div className="toggle-button"
              onClick={() => {
                setShowLangOptions(!isShowLangOptions);
              }}
            >
              {lang === 'en' ?
                <img className="flag-icon" src="/home/Flag_of_the_United_Kingdom.svg" />
                :
                <img className="flag-icon" src="/home/Flag_of_Vietnam.svg" />}
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
                  <img src="/home/Flag_of_Vietnam.svg" />
                </div>
                Tiếng Việt
              </div>
              <div id="lang-en"
                className="toggle-item"
                onClick={() => onSelectLanguage('en')}
              >
                <div className="icon-wrap">
                  <img src="/home/Flag_of_the_United_Kingdom.svg" />
                </div>
                Tiếng Anh
              </div>
            </div>}
          </div>
        </div>
        <div className="deal-shock item">
          <div className="text">Deals Shock</div>
        </div>
        <div className="cart item" onClick={() => router.push('course-order')}>
          <i className="far fa-shopping-cart shopping-cart"></i>
          {/* <img style={{ cursor: "pointer" }} onClick={() => router.push(getBrowserSlug('cart', COURSE_ORDER_PAGE_TYPE, 'course'))} src="/home/header-cart.png" alt="" /> */}
          {dataCountOrder > 0 &&
            <span className="cart-number">{dataCountOrder}</span>
          }
        </div>
        {currentUser?._id && <div className="notification-item item">
          <Dropdown
            // key={key}
            overlayStyle={{
              overflow: "auto",
              maxHeight: '400px',
              boxShadow: '0 3px 8px rgb(0 0 0 / 20%)'
            }}
            overlay={
              <Menu className="menu-notif">
                <Menu.Item key="0" style={{ minWidth: '275px' }}>
                  <div className="notify-text">
                    Thông báo
                  </div>
                </Menu.Item>
                <Menu.Divider />
                {dataNoti?.map(item => (
                  <Menu.Item key={item._id} style={{ background: item.readStatus === 0 ? '#f5f5f5' : '' }}>
                    <a
                      // href={item.href}
                      onClick={() => {
                        handleReadStatus(item._id)
                        if (item.href) {
                          document.location.href = item.href
                        } else {
                          router.push({
                            pathname: getBrowserSlug(item.topic?.slug || item.course?.slug, item.topic?.type ? TOPIC_DETAIL_PAGE_TYPE : COURSE_DETAIL_PAGE_TYPE, item.topic?._id || item.course?._id),
                            query: { discussionsId: item.discussionsId || item.parentId as string }
                          });
                        }
                      }}
                      className="notify-a"
                      style={{ width: '275px' }}>
                      <img className="img-notif" src={item.user?.avatar || defaultAvatar} />
                      <div className="content_">
                        <div className="notification-content"><strong>{item.user?.name}</strong> đã trả lời bình luận của bạn trong {item.topicId ? `bài học ${item.topicName || item?.topic?.name}` : `khóa học ${item.courseName || item?.course?.name}`}:
                          &nbsp;<SanitizedDiv className="text-html" content={item.content} />
                        </div>
                        <div className="notification-date">{formatFullDateTime(item.createdDate || item.createDate)}</div>
                      </div>
                    </a>
                  </Menu.Item>
                ))}
                {dataNoti?.length >= 9 &&
                  <div key="-1" className="notify-text-more" onClick={() => handleMore()}>
                    Xem thêm...
                  </div>}
              </Menu>
            }
            placement="bottomRight"
            trigger={['click']}
          >
            <a className="ant-dropdown-link" onClick={e => { e.preventDefault(); }}>
              <i className="far fa-bell notification"></i>
              {dataCount?.length > 0 &&
                <span className="notification-number">{dataCount.length > 9 ? '9+' : dataCount.length}</span>
              }
            </a>
          </Dropdown>
        </div>}
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
                    <div className="menu-item">
                      <i className="fas fa-exchange-alt" />
                      Lịch sử giao dịch
                    </div>
                    <div className="menu-item" onClick={() => router.push('/khoa-hoc-cua-toi')}>
                      <i className="fas fa-graduation-cap" />
                      Khoá học của tôi
                    </div>
                    <div className="menu-item" onClick={() => router.push(getBrowserSlug('cms', REPLY_COMMENT_PAGE_TYPE, 'comment'))} >
                      <i className="fas fa-wrench"></i>
                      Trả lời bình luận
                    </div>
                    <div className="menu-item" onClick={() => {
                      removeCookie(TOKEN);
                      // dispatch(loginSuccessAction(null));
                      router.reload()
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
                {/* <img src="/home/header-user.png" alt="" /> */}
                <i className="fas fa-user-circle header-icon"></i>
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
