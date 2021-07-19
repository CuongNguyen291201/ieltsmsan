import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Modal, Button, Space } from 'antd';
import './style.scss'
import { PhoneOutlined } from '@ant-design/icons'
function MainMenu() {
  const router = useRouter();
  const [isActiveOnMobile, setisActiveOnMobile] = useState(false)
  const [showModalAct, setShowModalAct] = useState(false)
  const showModalActiveCourse = () => {
    setShowModalAct(true)
  }
  const hideModal = () => {
    setShowModalAct(false)
  }
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
          <div className="menu-item document" onClick={() => router.push('/document')}>
            Tài liệu
          </div>
          <div className="menu-item" onClick={() => router.push('/livegame')}>
            Live game
          </div>
          <div className="menu-item">
            Tin tức
          </div>
          <div className="menu-item">
            Liên hệ
          </div>
          <div onClick={() => showModalActiveCourse()} className="active-course">
            Kích hoạt khóa học
          </div>
        </div>
        <div className="menu-icon" onClick={() => setisActiveOnMobile(true)}>
          <i className="fas fa-bars"></i>
        </div>
        <div className={`${isActiveOnMobile ? 'active-on-mobile' : ''} overlay-on-mobile`}>

        </div>
      </div>
      <div className="modal-active-course">
        <Modal
          title="Kích hoạt khoá học "
          visible={showModalAct}
          onCancel={hideModal}
          cancelText="Cancel"
          footer=""
        >
          <div className="wrapper-active-course">
            <div className="title-active-course">
              <div>
                Nhập mã kích hoạt mã học vào ô bên dưới
              </div>
            </div>
            <div className="insert-code">
              <input type="text" />
            </div>
            <div className="search-code">
              <button>Tìm kiếm</button>
            </div>
          </div>
          <div className="giai-dap-thac-mac">
            <div>Giải đáp thắc mắc Hotline:</div> <div><PhoneOutlined /> 0947090981</div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default MainMenu
