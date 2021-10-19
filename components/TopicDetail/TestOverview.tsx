import { message } from 'antd';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveCourseModalVisibleAction } from '../../redux/actions/course.actions';
import { prepareGoToGameAction } from '../../redux/actions/prepareGame.actions';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { GAME_STATUS_PREPARE_CONTINUE, GAME_STATUS_PREPARE_REVIEW } from '../../sub_modules/game/src/gameConfig';
import { EXAM_SCORE_FINISH, EXAM_SCORE_PAUSE, EXAM_SCORE_PLAY } from '../../sub_modules/share/constraint';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import Topic from '../../sub_modules/share/model/topic';
import { UserInfo } from '../../sub_modules/share/model/user';
import { getGameSlug } from '../../utils';
import { canPlayTopic } from '../../utils/permission/topic.permission';
import passExamImg from '../../public/topics/pass_exam.png';
import failureExamImg from '../../public/topics/failure_exam.png';
import continueExamImg from '../../public/topics/continue_exam.png';

const TestOverView = (props: { currentTopic: Topic, studyScore?: StudyScore | null, currentUser: UserInfo }) => {
	const { currentTopic, studyScore, currentUser } = props;
	const { isJoinedCourse, currentCourse } = useSelector((state: AppState) => state.courseReducer);
	const dispatch = useDispatch()
	const router = useRouter();
	const {
		isFinishedExam,
		isPassedExam,
		canPlayAgain
	} = useMemo(() => {
		return {
			isFinishedExam: studyScore?.status === EXAM_SCORE_FINISH,
			isPassedExam: ((studyScore?.score || 0 / 10) * 100) > currentTopic?.topicExercise?.pass,
			canPlayAgain: studyScore?.studyScoreData?.studyTime < currentTopic?.topicExercise?.replay
		}
	}, [studyScore]);

	const results: { image: any; color: string; text: string; } = useMemo(() => {
		let image = '';
		let color = '';
		let text = '';
		if (studyScore?.status === EXAM_SCORE_PAUSE || studyScore?.status === EXAM_SCORE_PLAY) {
			image = continueExamImg;
			color = '#02C2E8',
				text = 'Tiếp tục hoàn thành bạn nhé!'
		} else if (studyScore?.status === EXAM_SCORE_FINISH) {
			image = isPassedExam ? passExamImg : failureExamImg;
			color = isPassedExam ? '#1FA457 ' : '#FF557E';
			text = isPassedExam ? 'Bạn đã vượt qua bài thi này!' : 'Hãy luyện tập nhiều hơn bạn nhé!'
		}
		return {
			image, color, text
		}
	}, [studyScore, isPassedExam]);


	function playGame() {
		if (currentUser) {
			if (canPlayTopic({ topic: currentTopic, isJoinedCourse })) {
				dispatch(prepareGoToGameAction({ statusGame: GAME_STATUS_PREPARE_CONTINUE, studyScore }))
				router.push(getGameSlug(currentTopic._id));
			} else {
				message.warning("Chưa tham gia khoá học");
				if (currentCourse.cost > 0) {
					dispatch(setActiveCourseModalVisibleAction(true));
				}
			}
		} else {
			dispatch(showLoginModalAction(true));
		}
	}

	const review = () => {
		if (!currentUser) {
			dispatch(showLoginModalAction(true));
			return;
		}
		dispatch(prepareGoToGameAction({ statusGame: GAME_STATUS_PREPARE_REVIEW, studyScore }));
		router.push(getGameSlug(currentTopic._id));
	}

	return (
		<div className="topic-test-overview">
			{isFinishedExam && <div><h3 className="title">Kết quả</h3></div>}

			<div className="results-img">
				<img src={results.image} alt={results.text} />
			</div>

			<div className="results-info" style={{ color: results.color }}>
				<div className="results results-text">
					{results.text}
				</div>
				{isFinishedExam && <div className="results results-point">
					{studyScore?.score} điểm
				</div>}
			</div>

			<div className="topic-button-group">
				{canPlayAgain && <div className="topic-button topic-button-play" onClick={playGame}>
					Làm lại
				</div>}

				<div className="topic-button topic-button-review" onClick={review}>
					Xem giải chi tiết
				</div>
			</div>
		</div >
	)
}

export default TestOverView;
