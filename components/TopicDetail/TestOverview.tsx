import { message } from 'antd';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveCourseModalVisibleAction } from '../../redux/actions/course.actions';
import { prepareGoToGameAction } from '../../redux/actions/prepareGame.actions';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { GAME_STATUS_PREPARE_CONTINUE } from '../../sub_modules/game/src/gameConfig';
import { EXAM_SCORE_PAUSE, EXAM_SCORE_PLAY } from '../../sub_modules/share/constraint';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import Topic from '../../sub_modules/share/model/topic';
import { UserInfo } from '../../sub_modules/share/model/user';
import { formatDateDMY, getGameSlug } from '../../utils';
import { canPlayTopic } from '../../utils/permission/topic.permission';
import { ROUTER_GAME } from '../../utils/router';

const TestOverView = (props: { currentTopic: Topic, studyScore?: StudyScore | null, currentUser: UserInfo }) => {
	const { currentTopic, studyScore, currentUser } = props;
	const { isJoinedCourse, currentCourse } = useSelector((state: AppState) => state.courseReducer);
	const dispatch = useDispatch()
	const router = useRouter()
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

	return (
		<div className="section2-no-exam">
			<div className="date">
				<span>Ngày: </span><span>{formatDateDMY(Date.now())}</span>
			</div>
			<img src={`/topics/welcome_exam.png`} alt="" />
			<div className="resume--" onClick={() => {
				playGame()
				
			}}>
				<div className="lam-tiep play__">Làm tiếp</div>
				<div className="xem-lai_ play__">Xem lại</div>
			</div>
		</div>
	)
}

export default TestOverView;
