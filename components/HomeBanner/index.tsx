import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import SectionLabel from '../SectionLabel';
// requires a loader

function HomeBanner() {
  return (
    <>
      <div className="home-banner">
        <Carousel showStatus={false} autoPlay={true} interval={2000} infiniteLoop={true} showThumbs={false} swipeable={true} emulateTouch={true}>
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
    </>
  )
}

export default HomeBanner