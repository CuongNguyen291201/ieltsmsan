import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import Link from 'next/link'
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { getEventByTime, getCurrentDateTests } from '../../../utils/apis/eventApi';
import { setCurrrentTopicAction } from '../../../redux/actions/topic.action';
import './style.scss';

const EventDetail = () => {
  const dispatch = useDispatch();
  const [exams, setExams] = useState([]);
  const [bigEvent, setBigEvent] = useState({} as any);

  useEffect(() => {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
    const startTime = moment(startOfMonth).valueOf();
    const endTime = moment(endOfMonth).valueOf();

    getEvents(startTime, endTime)
  }, [])

  const getEvents = async (startTime, endTime) => {
    const data = await getEventByTime(startTime, endTime);
    setBigEvent(data[0]);
    getCurrentTest(data);
  }

  const getCurrentTest = async (events) => {
    let dataTemp = [];
    await events.map(async (item, index) => {
      const data = await getCurrentDateTests(item.courseId);
      dataTemp = [...dataTemp, ...data];
      if ((events.length - 1) === index) {
        setExams([...dataTemp]);
      }
    })
  }

  const setCurrentTopic = (exam) => {
    dispatch(setCurrrentTopicAction(exam))
  }

  return (
    <>
      <div className="event-page">
        <div className="main-event" style={{ backgroundImage: 'url(' + bigEvent.image + ')' }}>
          <div className="container">
            <Row>
              <Col sm={20} md={18} lg={14} xl={12}>
                <div className="event-title">
                  <div className="event-notify">
                    <div>Sự kiện:</div>
                    <div className="event-name">
                      {bigEvent.name}
                    </div>
                  </div>
                  <div className="event-detail" dangerouslySetInnerHTML={{ __html: bigEvent.description }}>
                  </div>
                  <div className="exams">
                    {
                      exams &&
                      exams.map((exam) => (
                        <div className="exam-detail" key={exam._id}>
                          <Link href={`/event/${exam.slug}?topicId=${exam._id}`}>
                            <div className="exam exam-reading" onClick={() => setCurrentTopic(exam)} >
                              <i className="fas fa-chevron-right"></i>
                              {exam.name}
                            </div>
                          </Link>
                          {
                            exam.endTime <= moment(moment().format()).valueOf() &&
                            <div className="event-end">
                              Đã kết thúc
                            </div>
                          }
                        </div>
                      ))
                    }
                  </div>
                  {
                    exams.length === 0 &&
                    <div className="all-event-end">
                      Đã kết thúc
                    </div>
                  }
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  )
}

export default EventDetail
