import React from 'react'
import SectionLabel from '../SectionLabel'
import './style.scss'

function HomeWhy() {
  return (
    <div className="home-why">

      <SectionLabel></SectionLabel>
      <h1 className="home-section-title">
        TẠI SAO NÊN CHỌN CHÚNG TÔI
      </h1>
      <div className="home-section-description">
        Giữa vô vàn các website học trực tuyến, chúng tôi mang đến cho bạn lựa chọn tốt nhất.
      </div>
      <div className="content container">
        <div className="left">
          {/* <div className="image1">
            <img src="/images/home/home-why-1.png" alt="" />
          </div>
          <div className="image2">
            <img src="/images/home/home-why-2.png" alt="" />
          </div>
          <div className="image3">
            <img src="/images/home/home-why-3.png" alt="" />
          </div>
          <div className="image4">
            <img src="/images/home/home-why-4.png" alt="" />
          </div> */}
          <img src="/images/home/home-why-1.png" className="image1 image wow bounceInDown" data-wow-delay="0.6s" alt="" />
          <img src="/images/home/home-why-2.png" className="image2 image wow bounceInDown" data-wow-delay="0.8s" alt="" />
          <img src="/images/home/home-why-3.png" className="image3 image wow bounceInUp" data-wow-delay="0.6s" alt="" />
          <img src="/images/home/home-why-4.png" className="image4 image wow bounceInUp" data-wow-delay="0.8s" alt="" />
        </div>
        <div className="right wow bounceInRight" data-wow-delay="0.8s">
          <div className="box wow fadeInDown" data-wow-delay="1.2s">
            <div className="title " >
              Tính hiệu quả
            </div>
            <div className="description " >
              Học tập qua video chất lượng cao,
              tốc độ nhanh và có thể xem lại nhiều lần
              trong suốt một kỳ học đến khi đi thi.
            </div>
          </div>
          <div className="box wow fadeInDown" data-wow-delay="1.4s">
            <div className="title">
              Tính tương tác cao
            </div>
            <div className="description">
              Tính năng chat online giữa các thành viên
              trong lớp và với giảng viên. Tính năng Thảo luận,
              chia sẻ tài liệu,...
            </div>
          </div>
          <div className="box wow fadeInDown" data-wow-delay="1.6s">
            <div className="title">
              Cam kết chất lượng
            </div>
            <div className="description">
              Chúng tôi cam kết mang đến sinh viên
              những khoá học chất lượng . Tất cả bài học
              được biên soạn bởi các Mentor tâm huyết,
              luôn cập nhật nội dung mới tốt nhất
            </div>
          </div>
          <div className="box wow fadeInDown" data-wow-delay="1.8s">
            <div className="title">
              Tính tiện lợi cao
            </div>
            <div className="description">
              Học tập mọi lúc, mọi nơi trên nhiều
              nền tảng thiết bị: website, điên thoại android, ios.
              Tiến độ học được đồng bộ trên các thiết bị
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeWhy
