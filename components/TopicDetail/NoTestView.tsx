import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { prepareResumeGameAction } from '../../redux/actions/prepareGame.actions';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { EXAM_SCORE_PAUSE, EXAM_SCORE_PLAY } from '../../sub_modules/share/constraint';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import { formatDateDMY } from '../../utils';
import { ROUTER_GAME } from '../../utils/router';

const NoTestView = (props: { currentTopic: any, studyScore?: StudyScore | null, currentUser: any }) => {
	const { currentTopic, studyScore, currentUser } = props;
	const dispatch = useDispatch()
	const router = useRouter()
	function playGame() {
		if (currentUser) {
			dispatch(prepareResumeGameAction())
			router.push({
				pathname: ROUTER_GAME,
				query: { id: currentTopic._id }
			})
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
					// if (isStudyTrialCategory(currentUser, category._id) && currentTopic.status !== STATUS_OPEN) {
					//     showToastifyWarning('Bạn cần mua khoá học để làm bài tập ')
					// } else {
					//     if ((studyScore && studyScore != null)) {
					//         dispatch(resumGameAction())
					//     }
					//     router.push({
					//         pathname: ROUTER_GAME,
					//         query: { id: currentTopic._id } //{ id: currentTopic._id }
					//     })
					// }
					playGame()
				} else {
					dispatch(showLoginModalAction())
				}
			}}>{(studyScore && (studyScore.status == EXAM_SCORE_PLAY || studyScore.status == EXAM_SCORE_PAUSE)) ? "Làm tiếp" : "Làm bài"}</div>
		</div>
	)
}

export default NoTestView;
