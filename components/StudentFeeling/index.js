import React, { useEffect } from 'react'
import { Carousel } from 'react-responsive-carousel';
import SectionLabel from '../SectionLabel';
import './style.scss'

function StudentFeeling() {
  const init = () => {
    let browserWidth = document.body.clientWidth
    if (browserWidth > 900) {
      let expectedSlideItemWidth = 1270 * (50 / 100)
      let slideItemEls = document.getElementsByClassName('student-feeling-slide-item')
      Array.prototype.forEach.call(slideItemEls, function (el) {
        // Do stuff here
        el.style.width = `${expectedSlideItemWidth}px`
      });
    }
    else {
      let expectedSlideItemWidth = browserWidth * (93 / 100)
      console.log(browserWidth);
      let slideItemEls = document.getElementsByClassName('student-feeling-slide-item')
      Array.prototype.forEach.call(slideItemEls, function (el) {
        // Do stuff here
        el.style.width = `${expectedSlideItemWidth}px`
      });
    }


    // expectedSlideItemWidth
  }
  useEffect(() => {
    init()
    window.addEventListener('resize', init)
    return () => {
      window.removeEventListener('resize', init)
    }
  }, [])

  let currentSlideIndex = 0
  const switchSlide = () => {
    if (currentSlideIndex == 2) {
      currentSlideIndex = 0
    }
    else {
      currentSlideIndex = currentSlideIndex + 1
    }
    let slideEl = document.querySelector('.student-feeling .slide')
    let gap
    let browserWidth = document.body.clientWidth
    if (browserWidth > 900) {
      gap = currentSlideIndex * (50)
    }
    else {
      gap = currentSlideIndex * (104)
    }

    slideEl.style.transform = `translateX(-${gap}%)`
  }
  useEffect(() => {
    const hihi = setInterval(switchSlide, 3000)
    return () => {
      clearInterval(hihi)
    }

  }, [])

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
          <div className="slide-wrap">
            <div className="slide">
              <div className="student-feeling-slide-item">
                <div className="image">
                  <img src="/home/student-feeling-1.png" alt="" />
                </div>
                <div className="description">
                  Khóa học chất lượng, chị dạy rất nhiệt tình và dễ hiểu,
                  tài liệu có hệ thống và dễ theo dõi
                  Tuy lớp hơi đông,
                  chật nhưng bù lại đang mùa đông nên cũng khá ấm ^^
                  Gửi lời cảm ơn và ngàn tim đến chị
            </div>
              </div>

              <div className="student-feeling-slide-item">
                <div className="image">
                  <img src="/home/student-feeling-2.png" alt="" />
                </div>
                <div className="description">
                  Khóa học chất lượng, chị dạy rất nhiệt tình và dễ hiểu,
                  tài liệu có hệ thống và dễ theo dõi
                  Tuy lớp hơi đông,
                  chật nhưng bù lại đang mùa đông nên cũng khá ấm ^^
                  Gửi lời cảm ơn và ngàn tim đến chị
            </div>
              </div>

              <div className="student-feeling-slide-item">
                <div className="image">
                  <img src="/home/student-feeling-1.png" alt="" />
                </div>
                <div className="description">
                  Khóa học chất lượng, chị dạy rất nhiệt tình và dễ hiểu,
                  tài liệu có hệ thống và dễ theo dõi
                  Tuy lớp hơi đông,
                  chật nhưng bù lại đang mùa đông nên cũng khá ấm ^^
                  Gửi lời cảm ơn và ngàn tim đến chị
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StudentFeeling
