import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader

function HomeBanner() {
  return (
    <div className="home-banner">
      <Carousel autoPlay={true} interval={2000} infiniteLoop={true} showThumbs={false} dynamicHeight={true} swipeable={true} emulateTouch={true}>
        <div>
          <img src="/home/banner-bg-1.jpeg" />
        </div>
        <div>
          <img src="/home/banner-bg-2.jpeg" />
        </div>
        <div>
          <img src="/home/banner-bg-3.jpeg" />
        </div>
        <div>
          <img src="/home/banner-bg-4.jpeg" />
        </div>
      </Carousel>
    </div>
  )
}

export default HomeBanner
