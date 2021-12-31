import { Box, Button, Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import classNames from "classnames";
import { useRouter } from 'next/router';
import { useSnackbar } from "notistack";
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import continueExamImg from '../../../public/images/topics/continue_exam.png';
import failureExamImg from '../../../public/images/topics/failure_exam.png';
import passExamImg from '../../../public/images/topics/pass_exam.png';
import { prepareGoToGameAction } from '../../../redux/actions/prepareGame.actions';
import { AppState } from '../../../redux/reducers';
import { showLoginModalAction } from '../../../sub_modules/common/redux/actions/userActions';
import { GAME_STATUS_PREPARE_CONTINUE, GAME_STATUS_PREPARE_PLAY, GAME_STATUS_PREPARE_REVIEW } from '../../../sub_modules/game/src/gameConfig';
import { EXAM_SCORE_FINISH, EXAM_SCORE_PAUSE, EXAM_SCORE_PLAY } from '../../../sub_modules/share/constraint';
import { StudyScore } from '../../../sub_modules/share/model/studyScore';
import Topic from '../../../sub_modules/share/model/topic';
import { UserInfo } from '../../../sub_modules/share/model/user';
import { getGameSlug } from '../../../utils';
import { canPlayTopic } from '../../../utils/permission/topic.permission';
import useTopicWidgetStyles from "./useTopicWidgetStyles";

const TestOverView = (props: { currentTopic: Topic, studyScore?: StudyScore | null, currentUser: UserInfo; gameButtonGroupBoxStyle?: SxProps<Theme> }) => {
	const { currentTopic, studyScore, currentUser, gameButtonGroupBoxStyle } = props;
	const { isJoinedCourse, currentCourse } = useSelector((state: AppState) => state.courseReducer);
	const dispatch = useDispatch()
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();
	const classes = useTopicWidgetStyles();
	const {
		isFinishedExam,
		isPassedExam,
		canPlayAgain,
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
				const statusGame = (studyScore?.status === EXAM_SCORE_PAUSE || studyScore?.status === EXAM_SCORE_PLAY) ? GAME_STATUS_PREPARE_CONTINUE : GAME_STATUS_PREPARE_PLAY;
				dispatch(prepareGoToGameAction({ statusGame, studyScore }))
				router.push(getGameSlug(currentTopic._id));
			} else {
				enqueueSnackbar("Chưa tham gia khoá học", { variant: "warning" });
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
			{isFinishedExam && <Box textAlign="center" paddingTop="32px"><h2>Kết quả</h2></Box>}

			<Box display="flex" flexDirection="column" alignItems="center">
				<Box className="results-img" sx={{ height: "170px" }}>
					<img src={results.image} alt={results.text} height={"100%"} />
				</Box>

				<div className="results-info" style={{ color: results.color, fontWeight: 600 }}>
					<div className="results results-text">
						{results.text}
					</div>
					{isFinishedExam && <div className="results results-point"
						style={{
							color: results.color, fontSize: "30px", fontWeight: 700, textAlign: "center", marginTop: "32px"
						}}>
						{studyScore?.score ?? 0} điểm
					</div>}
				</div>
			</Box>

			<Box className="topic-button-group" sx={{
				display: "flex",
				gap: "50px",
				justifyContent: "center",
				alignItems: "center",
				marginTop: "40px",
				flexDirection: {
					xs: "column",
					md: "row"
				},
				...gameButtonGroupBoxStyle
			}}>
				{canPlayAgain && <Button className={classNames(classes.gameButton, classes.gameButtonPlay)} onClick={playGame}>
					{isFinishedExam ? 'Làm lại' : 'Làm tiếp'}
				</Button>}

				{isFinishedExam && <Button className={classNames(classes.gameButton, classes.gameButtonReview)} onClick={review}>
					Xem giải chi tiết
				</Button>}
			</Box>
		</div >
	)
}

export default TestOverView;
