import React from 'react';
import { Row, Col, Statistic } from 'antd';
import { useRouter } from 'next/router';
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducers';
import { showLoginModalAction } from '../../../sub_modules/common/redux/actions/userActions';
import { getGameSlug } from '../../../utils';
import './style.scss';

const { Countdown } = Statistic;

const EventExam = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: AppState) => state.userReducer.currentUser);
    const { currentTopic } = useSelector((state: AppState) => state.topicReducer)
    const router = useRouter();
    const { topicId, endTime } = router.query;
    const time: string = moment(endTime, "x").format("MM-DD-YYYY HH:mm:ss");
    const examCountDown: any = moment(time);

    const playGame = () => {
        router.push(getGameSlug(topicId as string));
    }

    return (
        <>
            <div className="event-exam">
                <div className="main-event-exam">
                    <div className="container">
                        <Row>
                            <Col xs={24} sm={24} md={24} lg={8}>
                                <div>
                                    <div className="event-btn" onClick={() => router.back()}>
                                        Quay lại
                                    </div>
                                    <div className="event-btn">
                                        <Countdown className="Countdown" value={examCountDown} />
                                        <div>giờ phút giây</div>
                                    </div>
                                    <div className="event-btn"
                                        onClick={() => {
                                            if (currentUser) {
                                                playGame()
                                            } else {
                                                dispatch(showLoginModalAction())
                                            }
                                        }}
                                    >
                                        Làm bài
                                    </div>
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
                                        <div className="item stt stt-first">1</div>
                                        <div className="item avatar">
                                            <img className="gwt-Image" src="https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1426029167752230&amp;width=100&amp;ext=1627695440&amp;hash=AeRkgidrrH_4j1hvOvE" />
                                        </div>
                                        <div className="item name">nguyen van anh</div>
                                        <div className="item correct">49</div>
                                        <div className="item time">34m:59s</div>
                                        <div className="item score">9.8 Điểm</div>
                                    </div>

                                    <div className="high-score-item-panel">
                                        <div className="item stt stt-second">2</div>
                                        <div className="item avatar">
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
                    </div>
                </div>
            </div>
        </>
    )
}

export default EventExam
