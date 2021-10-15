import React, { useEffect } from 'react'
import SectionLabel from '../SectionLabel';
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/swiper.min.css";
import './style.scss'

SwiperCore.use([Autoplay, Pagination, Navigation]);

function HomeNews() {
  return (
    <div className="home-news">
      <div className="container news-header">
        <SectionLabel></SectionLabel>
        <div className="home-section-title">Tin tức</div>
      </div>
      <div className="slide-view-wrap">
        <div className="slide-view">
          <Swiper className="slide" autoplay={{ delay: 3000, disableOnInteraction: false }} slidesPerView={3} spaceBetween={0} pagination={{}}>
            {
              [1, 2, 3, 4, 5, 6].map((_, index) => {
                return (
                  <SwiperSlide className="slide-item" key={index}>
                    <div className="title">
                      REVIEW ĐỀ THI TRẮC NGHIỆM
                      TOÁN CAO CẤP [KỲ 2/2020 - KTQD]
                    </div>
                    <div className="date">10:51:43 13/08/2020</div>
                    <div className="description">
                      trắc nghiệm TCC
                    </div>
                    <div className="quote">
                      {
                        index % 2 == 0 ? (
                          <img src="/home/home-quote-1.png" alt="" />
                        ) : (
                          <img src="/home/home-quote-2.png" alt="" />
                        )
                      }

                    </div>
                  </SwiperSlide>
                )
              })
            }

          </Swiper>

        </div>
        <div className="arrow">
          <img src="/home/home-news-arrow.png" alt="" />
        </div>
      </div>
    </div>
  )
}

export default HomeNews
