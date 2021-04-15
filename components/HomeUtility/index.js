import React from 'react'
import SectionLabel from '../SectionLabel'
import './style.scss'
function HomeUtility() {
  return (
    <div className="home-utility">
      <SectionLabel></SectionLabel>
      <div className="home-section-title">
        CÁC TIỆN ÍCH HỌC ONLINE
      </div>
      <div className="home-section-description">
        Chỉ là cách học đơn giản và vui vẻ nhất mà bạn từng biết đến thôi mà <br />
        cùng điểm qua có gì hot nhé!
      </div>
      <div className="list container">
        <div className="list-item wow rollIn" data-wow-delay="0.5s" >
          <img src="/home/home-utility-1.png" alt="" />
          <div className="description">
            Học mọi lúc <br />
            mọi nơi
          </div>
        </div>
        <div className="list-item wow bounceInDown" data-wow-delay="0.6s">
          <img src="/home/home-utility-2.png" alt="" />
          <div className="description">
            Tối ưu ghi nhớ
          </div>
        </div>
        <div className="list-item wow bounceInUp" data-wow-delay="0.7s">
          <img src="/home/home-utility-3.png" alt="" />
          <div className="description">
            Kiểm tra, thi <br />
            mô phỏng kỳ thi thật
          </div>
        </div>
        <div className="list-item wow bounceInDown" data-wow-delay="0.6s">
          <img src="/home/home-utility-4.png" alt="" />
          <div className="description">
            Nội dung đầy đủ <br />
            xúc tích
          </div>
        </div>
        <div className="list-item wow lightSpeedIn" data-wow-delay="0.5s">
          <img src="/home/home-utility-5.png" alt="" />
          <div className="description">
            Tính tương tác cao <br />
            (chat, bình luận)
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeUtility
