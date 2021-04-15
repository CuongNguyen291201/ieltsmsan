import React, { useEffect } from 'react'
import { Carousel } from 'react-responsive-carousel';
import './style.scss'

function StudentFeeling() {
  const init = () => {
    let browserWidth = document.body.clientWidth
    let expectedSlideItemWidth = browserWidth * (50 / 100)
    let slideItemEls = document.getElementsByClassName('student-feeling-slide-item')
    Array.prototype.forEach.call(slideItemEls, function (el) {
      // Do stuff here
      el.style.width = `${expectedSlideItemWidth}px`
    });

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
    let gap = currentSlideIndex * (52)
    slideEl.style.transform = `translateX(-${gap}%)`
  }
  useEffect(() => {
    setInterval(() => {
      switchSlide()
    }, 2000)
  }, [])
  return (
    <div className="student-feeling">
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
  )
}

export default StudentFeeling
