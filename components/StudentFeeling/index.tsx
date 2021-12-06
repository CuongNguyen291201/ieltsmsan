import React, { useEffect } from 'react';
import SectionLabel from '../SectionLabel';
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/swiper.min.css";
import './style.scss';

SwiperCore.use([Autoplay, Pagination, Navigation]);

function StudentFeeling() {
  return (
    <>
      <SectionLabel></SectionLabel>
      <div className="student-feeling">
        <div className="container">
          <div className="text-1">
            <div className="text">
              ONTHISINHVIEN.COM
            </div>
            <div className="sign"></div>
          </div>
          <div className="text-2">
            CẢM NHẬN CỦA HỌC VIÊN
          </div>
          <div className="text-3">
            Năm 2020, chúng tôi có hàng ngàn sinh viên từ các trường đại học
          </div>

          <Swiper autoplay={{ delay: 3000, disableOnInteraction: false }} slidesPerView={1} spaceBetween={0} pagination={{}} className="home-swiper-wrap">
            <SwiperSlide key={0}>
              <div className="student-feeling-slide-item">
                <div className="image">
                  <img src="/images/home/student-feeling-1.png" alt="" />
                </div>
                <div className="description">
                  Khóa học chất lượng, chị dạy rất nhiệt tình và dễ hiểu,
                  tài liệu có hệ thống và dễ theo dõi
                  Tuy lớp hơi đông,
                  chật nhưng bù lại đang mùa đông nên cũng khá ấm ^^
                  Gửi lời cảm ơn và ngàn tim đến chị
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide key={1}>
              <div className="student-feeling-slide-item">
                <div className="image">
                  <img src="/images/home/student-feeling-2.png" alt="" />
                </div>
                <div className="description">
                  Khóa học chất lượng, chị dạy rất nhiệt tình và dễ hiểu,
                  tài liệu có hệ thống và dễ theo dõi
                  Tuy lớp hơi đông,
                  chật nhưng bù lại đang mùa đông nên cũng khá ấm ^^
                  Gửi lời cảm ơn và ngàn tim đến chị
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  )
}

export default StudentFeeling
