import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { useRouter } from 'next/router';
import Link from 'next/link'
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducers';
import { getEventByTime, getCurrentDateTests } from '../../../utils/apis/eventApi';
import { setCurrrentTopicAction } from '../../../redux/actions/topic.action';
import './style.scss';

const EventDetail = () => {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {  
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
    const startTime = moment(startOfMonth).valueOf();
    const endTime = moment(endOfMonth).valueOf();
    
    getEventByTime(startTime, endTime)
      .then(data => {
        setEvents(data)
      })    
  }, [])

  useEffect(() => {
    if (events) {
      events.map(item => (
        getCurrentDateTests(item.courseId)
          .then(data => {
            console.log('current tests: ', data);
            setExams(data)
            dispatch(setCurrrentTopicAction(data))
          })
      ))
    }
  }, [events])

  return (
    <div className="event-page">
      <div className="main-event">
        <div className="container">
          <Row>
            <Col sm={20} md={18} lg={14} xl={12}>
              <div className="event-title">
                <div className="event-notify">
                  <div>Sự kiện:</div>
                  <div className="event-name">
                    THI THỬ ĐỊNH KỲ THÁNG {moment().month() + 1}
                  </div>
                </div>
                <div className="event-detail">
                  Bài thi được mở từ 20h - 21h15. Các em có 15 phút để vào thi, tránh vào cùng một lúc gây ra tinh trạng nghẽn, không vào được bài. Mỗi học sinh chỉ được làm bài 1 lần. Bài thi sẽ kết thúc lúc 21h15 các kết quả sau 21h15 sẽ không được tính.
                </div>
                <div className="exams">
                  {
                    exams &&
                    exams.map((exam) => (
                      <Link href={`/event/${exam.slug}?topicId=${exam._id}&endTime=${exam.endTime}`} key={exam._id}>
                        <div className="exam exam-reading" >
                          <i className="fas fa-chevron-right"></i>
                          {exam.name}
                        </div>
                      </Link>
                    ))
                  }
                </div>

                {/* {
                  examCountDown === currentTime &&
                  <div className="event-end">
                    Đã kết thúc
                  </div>
                } */}
                {
                  !exams &&
                  <div className="event-end">
                    Đã kết thúc
                  </div>
                }
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div >
  )
}

export default EventDetail
