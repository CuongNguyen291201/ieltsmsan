import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

function HomeBanner() {
  return (
    <div className="home-banner">
      <div className="container">
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
    </div>
  )
}

export default HomeBanner
