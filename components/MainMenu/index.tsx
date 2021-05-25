import React, { useState } from 'react'
import { useRouter } from 'next/router'
import './style.scss'

function MainMenu() {
  const router = useRouter();
  const [isActiveOnMobile, setisActiveOnMobile] = useState(false)
  return (
    <div className="main-menu">
      <div className="container">
        <div className="search">
          <div className="icon">
            <img src="/home/search-icon.png" alt="" />
          </div>
          <input type="text" placeholder="Tìm kiếm" />
        </div>
        <div className={`${isActiveOnMobile ? 'active-on-mobile' : ''} menu`}>
          <div className="close-menu-icon" onClick={() => { setisActiveOnMobile(false) }}>
            <i className="fas fa-arrow-right"></i>
          </div>
          <div className="menu-item" onClick={() => router.push('/')}>
            Trang chủ
          </div>
          <div className="menu-item document">
            Tài liệu
          </div>
          <div className="menu-item">
            Tin tức
          </div>
          <div className="menu-item">
            Liên hệ
          </div>
          <div className="active-course">
            Kích hoạt khóa học
          </div>

        </div>
        <div className="menu-icon" onClick={() => setisActiveOnMobile(true)}>
          <i className="fas fa-bars"></i>
        </div>
        <div className={`${isActiveOnMobile ? 'active-on-mobile' : ''} overlay-on-mobile`}>

        </div>
      </div>

    </div>
  )
}

export default MainMenu
