import React, { useEffect } from 'react'
import SectionLabel from '../SectionLabel'
import './style.scss'

function HomeNews() {

  const setSlideVewMarginLeft = () => {
    let slideViewEl = document.querySelector('.home-news .slide-view')
    let browserWidth = window.innerWidth
    let gap = (browserWidth - 1270) / 2
    let slideViewMarginLeft
    if (gap >= 0) {
      slideViewMarginLeft = (browserWidth - 1270) / 2
    }
    else {
      slideViewMarginLeft = 0
    }
    slideViewEl.style.marginLeft = `${slideViewMarginLeft}px`
  }
  const setArrowLeft = () => {
    let browserWidth = window.innerWidth
    let gap = (browserWidth - 1270) / 2
    let arrowLeft
    let arrowLeftEl = document.querySelector('.home-news .slide-view-wrap .arrow')
    if (browserWidth > 1355) {
      arrowLeft = gap - 45
    }
    else {
      arrowLeft = 0
    }
    arrowLeftEl.style.left = `${arrowLeft}px`
  }
  const init = () => {
    setSlideVewMarginLeft()
    setArrowLeft()
  }
  useEffect(() => {
    init()
    window.addEventListener('resize', init)
    return () => {
      window.removeEventListener('resize', init)
    }
  }, [])

  let currnetSlideIndex = 0
  const switchSlide = () => {
    if (currnetSlideIndex == 4) {
      currnetSlideIndex = 1
    }
    else {
      currnetSlideIndex = currnetSlideIndex + 1
    }
    let slide = document.querySelector('.home-news .slide')
    let gap = currnetSlideIndex * (600)
    slide.style.transform = `translateX(-${gap}px)`
  }

  useEffect(() => {
    let hihi = setInterval(switchSlide, 3000)
    return () => {
      clearInterval(hihi)
    }
  }, [])

  return (
    <div className="home-news">
      <SectionLabel></SectionLabel>
      <div className="home-section-title">Tin tức</div>
      <div className="slide-view-wrap">
        <div className="slide-view">
          <div className="slide">
            {
              [1, 2, 3, 4, 5, 6].map((el, index) => {
                return (
                  <div className="slide-item">
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
                  </div>
                )
              })
            }

          </div>

        </div>
        <div className="arrow" onClick={switchSlide}>
          <img src="/home/home-news-arrow.png" alt="" />
        </div>
      </div>
    </div>
  )
}

export default HomeNews
