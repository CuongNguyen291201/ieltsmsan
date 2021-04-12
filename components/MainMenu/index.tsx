import React from 'react'
import './style.scss'

function MainMenu() {
  return (
    <div className="main-menu">
      <div className="container">
        <div className="search">
          <div className="icon">
            <img src="/home/search-icon.png" alt="" />
          </div>
          <input type="text" placeholder="tìm kiếm" />
        </div>
        <div className="menu">
          <div className="menu-item">
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
        </div>
        <div className="active-course">
          Kích hoạt khóa học
        </div>
      </div>
    </div>
  )
}

export default MainMenu
