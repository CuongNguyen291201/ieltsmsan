import { Grid } from '@material-ui/core';
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import { useSnackbar } from "notistack";
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { CommentScopes } from '../../custom-types';
import { setActiveCourseModalVisibleAction } from '../../redux/actions/course.actions';
import { prepareGoToGameAction } from '../../redux/actions/prepareGame.actions';
import { setUserCardDataAction } from '../../redux/actions/topic.action';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { getCookie, MODE_SHOW_RESULT_EXERCISE } from '../../sub_modules/common/utils/cookie';
import { GAME_STATUS_PREPARE_REVIEW } from '../../sub_modules/game/src/gameConfig';
import * as Config from '../../sub_modules/share/constraint';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import Topic from '../../sub_modules/share/model/topic';
import { UserInfo } from '../../sub_modules/share/model/user';
import { formatDateDMY, formatTimeClock, getGameSlug } from '../../utils';
import { canPlayTopic } from '../../utils/permission/topic.permission';
import { InformationCourse } from '../CourseDetail/InformationCourse/information-course';
import './topic-content.scss';
import { MyCardDataView, TopicInfoCommonView } from './TopicWidget';

const CommentPanelNew = dynamic(() => import('../CommentPanelNew'), { ssr: false });

const ExerciseInfoView = (props: { topic: any }) => {
  const { topic } = props;
  const { studyScore, myCardData } = useSelector((state: AppState) => state.topicReducer);
  const { currentCourse: course, isJoinedCourse } = useSelector((state: AppState) => state.courseReducer);
  const { currentUser: user } = useSelector((state: AppState) => state.userReducer);
  return (
    <div className="topic-test-view">
      <Grid container className="thong-ke-">
        <Grid item xs={12} md={8}>
          <MyCardDataView currentTopic={topic} studyScore={studyScore} myCardData={myCardData} user={user} isJoinedCourse={isJoinedCourse} />
        </Grid>

        <Grid item xs={12} md={4} className="commentPanel_">
          <div>
            <div><h3 className="title">Thảo luận</h3></div>
            <CommentPanelNew commentScope={CommentScopes.TOPIC} />
          </div>
        </Grid>
      </Grid>

      <Grid container className="view-panel-score" spacing={2}>
        <Grid item xs={12} md={8} className="view-left">
          <TopicInfoCommonView currentTopic={topic} studyScore={studyScore} hidePlayGameButton />
        </Grid>

        <Grid xs={12} md={4} className="view-right course-info-topic">
          <InformationCourse course={course} />
        </Grid>
      </Grid>
    </div >
  );
};

export default ExerciseInfoView;