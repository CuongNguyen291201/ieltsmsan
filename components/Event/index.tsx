import React, { useState, useEffect } from 'react';
import { Row, Col, Statistic } from 'antd';
import { useRouter } from 'next/router';
import Link from 'next/link'
import moment from 'moment';
import './style.scss';

const { Countdown } = Statistic;

const Event = () => {
  const [timeCheck, setTimeCheck] = useState(0);
  const router = useRouter();
  const slug = router.query.slug || [];
  const { topicId } = router.query;

  useEffect(() => {
    const timeCountDown = () => {
      let publishDay = "7/2/2021 12:00:00", countDown = new Date(publishDay).getTime();
      let x = setInterval(function () {

        let now = new Date().getTime(), distance = countDown - now;

        setTimeCheck(distance);
        if (distance < 0) {
          clearInterval(x);
        }
      }, 0)
    }
    timeCountDown()
  })

  // const timeUp = () => {
  //   setEndTime(true)
  // }


  const exam = () => {
    const href = `/event/${slug}?topicId=123`;
    router.push(
      { href },
      href,
      { shallow: true }
    );
  }


  return (
    <div className="event-page">
      <div className="main-event">
        <div className="container">

          {
            !topicId ?

              <Row>
                <Col sm={20} md={18} lg={12} xl={10}>
                  <div className="event-title">
                    <div className="event-notify">
                      <div>Sự kiện:</div>
                      <div className="event-name">
                        THI THỬ ĐỊNH KỲ THÁNG 6
                      </div>
                    </div>

                    <div className="event-detail">
                      Bài thi được mở từ 20h - 21h15. Các em có 15 phút để vào thi, tránh vào cùng một lúc gây ra tinh trạng nghẽn, không vào được bài. Mỗi học sinh chỉ được làm bài 1 lần. Bài thi sẽ kết thúc lúc 21h15 các kết quả sau 21h15 sẽ không được tính.
                    </div>

                    {/* <Link href={`/event/${slug}?topicId=12`}>
                      <div className="list-exam">
                        BÀI THI THỬ THPTQG TIẾNG ANH ĐỊNH KỲ THÁNG 6
                      </div>
                    </Link> */}

                    <div className="exams">
                      <div className="exam exam-reading">
                        <i className="far fa-chevron-right"></i> 
                        BÀI THI THỬ ĐỌC HIỂU
                      </div>
                      <div className="exam exam-reading-fill">
                        <i className="far fa-chevron-right"></i>
                        BÀI THI THỬ ĐỌC ĐIỀN
                      </div>
                      <div className="exam exam-quiz">
                        <i className="far fa-chevron-right"></i>
                        BÀI THI THỬ TRẮC NGHIỆM VIẾT
                      </div>
                    </div>

                    {
                      timeCheck < 0 &&
                      <div className="event-end">
                        Đã kết thúc
                      </div>
                    }
                  </div>
                </Col>
              </Row>
              :
              <Row>
                <Col xs={24} sm={24} md={24} lg={8}>
                  <div>
                    <div className="event-back" onClick={() => router.back()}>
                      Quay lại
                    </div>
                    {
                      timeCheck > 0 &&
                      // <div className="list-exam">
                      //   <Countdown className="Countdown" value={timeCheck + Date.now()} format="D ngày H giờ m phút s giây" valueStyle={{ fontSize: '14px' }} />
                      // </div>
                      <div className="event-back">
                        <Countdown className="Countdown" value={timeCheck + Date.now()} format="HH mm ss" valueStyle={{ fontSize: '25px', wordSpacing: '20px' }} />
                        <div>giờ phút giây</div>
                      </div>
                    }
                  </div>
                </Col>

                <Col xs={24} sm={24} md={24} lg={16}>
                  <div className="table-statistical">
                    <label>Bảng xếp hạng</label>

                    <div className="high-score-item-panel title">
                      <div className="item stt">STT</div>
                      <div className="item avatar"></div>
                      <div className="item name">Tên</div>
                      <div className="item correct">Câu đúng</div>
                      <div className="item time">Thời gian</div>
                      <div className="item score">Điểm</div>
                    </div>

                    <div className="high-score-item-panel">
                      <div className="item stt">1</div>
                      <div className="item avatar">
                        <img className="gwt-Image" src="https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1426029167752230&amp;width=100&amp;ext=1627695440&amp;hash=AeRkgidrrH_4j1hvOvE" />
                      </div>
                      <div className="item name">nguyen van anh</div>
                      <div className="item correct">49</div>
                      <div className="item time">34m:59s</div>
                      <div className="item score">9.8 Điểm</div>
                    </div>

                    <div className="high-score-item-panel">
                      <div className="item stt">2</div>
                      <div className="item avatar">
                        {/* <img className="gwt-Image" src="https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1426029167752230&amp;width=100&amp;ext=1627695440&amp;hash=AeRkgidrrH_4j1hvOvE" /> */}
                        <img className="gwt-Image" src="https://storage.googleapis.com/ielts-fighters.appspot.com/images/admin?t=1625190322055&amp;ignoreCache=1" />
                      </div>
                      <div className="item name">nguyen thi anh</div>
                      <div className="item correct">0</div>
                      <div className="item time">33m:59s</div>
                      <div className="item score">8 Điểm</div>
                    </div>


                  </div>
                </Col>
              </Row>
          }
        </div>
      </div>
    </div >
  )
}

export default Event
