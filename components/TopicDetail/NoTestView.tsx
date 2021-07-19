import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { prepareGoToGameAction } from '../../redux/actions/prepareGame.actions';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { GAME_STATUS_PREPARE_CONTINUE } from '../../sub_modules/game/src/gameConfig';
import { EXAM_SCORE_PAUSE, EXAM_SCORE_PLAY } from '../../sub_modules/share/constraint';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import Topic from '../../sub_modules/share/model/topic';
import { UserInfo } from '../../sub_modules/share/model/user';
import { formatDateDMY, getGameSlug } from '../../utils';
import { ROUTER_GAME } from '../../utils/router';

const NoTestView = (props: { currentTopic: Topic, studyScore?: StudyScore | null, currentUser: UserInfo }) => {
	const { currentTopic, studyScore, currentUser } = props;
	const dispatch = useDispatch()
	const router = useRouter()
	function playGame() {
		if (currentUser && !!studyScore) {
			dispatch(prepareGoToGameAction({ statusGame: GAME_STATUS_PREPARE_CONTINUE, studyScore }))
			router.push(getGameSlug(currentTopic._id));
		}
	}

	return (
		<div className="section2-no-exam">
			<div className="date">
				<span>Ngày: </span><span>{formatDateDMY(Date.now())}</span>
			</div>
			<img src={`/topics/welcome_exam.png`} alt="" />
			<div className="lam-lai" onClick={() => {
				if (currentUser) {
					playGame()
				} else {
					dispatch(showLoginModalAction())
				}
			}}>{(studyScore && (studyScore.status == EXAM_SCORE_PLAY || studyScore.status == EXAM_SCORE_PAUSE)) ? "Làm tiếp" : "Làm bài"}</div>
		</div>
	)
}

export default NoTestView;
