import { Grid } from '@mui/material';
import dynamic from "next/dynamic";
import { useSelector } from 'react-redux';
import { CommentScopes, _Topic } from '../../custom-types';
import { AppState } from '../../redux/reducers';
import { InformationCourse } from '../CourseDetail/InformationCourse/information-course';
import './topic-content.scss';
import { MyCardDataView, TopicInfoCommonView } from './TopicWidget';

const CommentPanelNew = dynamic(() => import('../CommentPanelNew'), { ssr: false });

const ExerciseInfoView = (props: { topic: _Topic; }) => {
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

        <Grid item xs={12} md={4} className="view-right course-info-topic">
          <InformationCourse course={course} />
        </Grid>
      </Grid>
    </div >
  );
};

export default ExerciseInfoView;