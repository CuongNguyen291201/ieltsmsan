import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducers';
import { showLoginModalAction } from '../../../sub_modules/common/redux/actions/userActions';
import { getGameSlug } from '../../../utils';
import { apiGetDataDetailExercise, apiSeekRankingsByTopic } from '../../../utils/apis/topicApi';
import { updateTopicExerciseAction } from '../../../redux/actions/topic.action';
import { EXAM_SCORE_PAUSE, EXAM_SCORE_PLAY } from '../../../sub_modules/share/constraint';
import defaultAvatar from '../../../public/images/event/default-avatar-rank.png';
import './style.scss';
import { Grid } from "@mui/material";


const EventExam = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: AppState) => state.userReducer.currentUser);
    const { currentTopic } = useSelector((state: AppState) => state.topicReducer)
    const { studyScore } = useSelector((state: AppState) => state.topicReducer);
    const parentId = useMemo(() => currentTopic.parentId || currentTopic.courseId, [currentTopic]);
    const [userRank, setUserRank] = useState([]);
    const router = useRouter();
    const { topicId } = router.query;
    const startTimeTest = currentTopic.startTime;
    const endTimeTest = currentTopic.endTime;
    const currentTime = moment(moment().format()).valueOf();

    useEffect(() => {
        const getExerciseDetail = async () => {
            const data = await apiGetDataDetailExercise({
                topicId: currentTopic._id, userId: currentUser?._id ?? null, type: currentTopic.type
            });
            if (!data) return;
            const { topicExercise, studyScore, myCardData } = data;
            dispatch(updateTopicExerciseAction(parentId, topicExercise, studyScore, myCardData));
        }
        if (currentUser) {
            getExerciseDetail();
        } else {
            dispatch(updateTopicExerciseAction(parentId, null, null, null));
        }
    }, [currentTopic])

    useEffect(() => {
        const getUserRankingByTopic = async () => {
            let { data, status } = await apiSeekRankingsByTopic({
                field: 'currentIndex',
                topicId: currentTopic._id,
                limit: 20,
                lastRecord: studyScore,
                asc: true
            })
            if (status === 200) setUserRank(data);
        }
        getUserRankingByTopic()
    }, [currentTopic])

    const playGame = () => {
        router.push(getGameSlug(topicId as string));
    }

    return (
        <>
            <div className="event-exam">
                <div className="main-event-exam">
                    <div className="container">
                        <Grid container>
                            <Grid item xs={12} lg={4}>
                                <div>
                                    <div className="event-btn" onClick={() => router.back()}>
                                        Quay l???i
                                    </div>
                                    {
                                        (startTimeTest >= currentTime) &&
                                        <div className="event-btn countdown">
                                            <div className="statistic-countdown">
                                                {/* <Countdown value={startTimeTest} /> */}
                                            </div>
                                        </div>
                                    }
                                    {
                                        (startTimeTest <= currentTime && endTimeTest >= currentTime) &&
                                        <div className="event-btn"
                                            onClick={() => {
                                                if (currentUser) {
                                                    playGame()
                                                } else {
                                                    dispatch(showLoginModalAction())
                                                }
                                            }}
                                        >
                                            {(studyScore && (studyScore.status == EXAM_SCORE_PLAY || studyScore.status == EXAM_SCORE_PAUSE)) ? "L??m ti???p" : "L??m b??i"}
                                        </div>
                                        // :
                                        // <div className="event-btn">
                                        //     Xem chi ti???t
                                        // </div>
                                    }
                                </div>
                            </Grid>

                            <Grid item xs={12} lg={8}>
                                <div className="table-statistical">
                                    <label>B???ng x???p h???ng</label>

                                    <div className="high-score-item-panel title">
                                        <div className="item stt">STT</div>
                                        <div className="item avatar"></div>
                                        <div className="item name">T??n</div>
                                        <div className="item correct">C??u ????ng</div>
                                        <div className="item time">Th???i gian</div>
                                        <div className="item score">??i???m</div>
                                    </div>
                                    {
                                        userRank &&
                                        userRank.map((item, index) => (
                                            <div className="high-score-item-panel" key={item.userId}>
                                                <div className={`item stt stt-${index + 1}`}>{index + 1}</div>
                                                <div className="item avatar">
                                                    <img className="gwt-Image" src={item.studyScoreData.userInfo?.avatar || defaultAvatar} />
                                                </div>
                                                <div className="item name">{item.userName}</div>
                                                <div className="item correct">{item.studyScoreData.correctNum}</div>
                                                <div className="item time">{moment.utc(item.totalTime * 1000).format('mm:ss')}s</div>
                                                <div className="item score">{item.score} ??i???m</div>
                                            </div>
                                        ))
                                    }
                                    {
                                        userRank.length === 0 &&
                                        <>
                                            <div className="high-score-item-panel">
                                                <div className="item stt stt-1">1</div>
                                                <div className="item avatar">
                                                    <img className="gwt-Image" src={defaultAvatar} />
                                                </div>
                                                <div className="item name">?</div>
                                                <div className="item correct">--</div>
                                                <div className="item time">--</div>
                                                <div className="item score">--</div>
                                            </div>
                                            <div className="high-score-item-panel">
                                                <div className="item stt stt-2">2</div>
                                                <div className="item avatar">
                                                    <img className="gwt-Image" src={defaultAvatar} />
                                                </div>
                                                <div className="item name">?</div>
                                                <div className="item correct">--</div>
                                                <div className="item time">--</div>
                                                <div className="item score">--</div>
                                            </div>
                                            <div className="high-score-item-panel">
                                                <div className="item stt stt-3">3</div>
                                                <div className="item avatar">
                                                    <img className="gwt-Image" src={defaultAvatar} />
                                                </div>
                                                <div className="item name">?</div>
                                                <div className="item correct">--</div>
                                                <div className="item time">--</div>
                                                <div className="item score">--</div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EventExam
