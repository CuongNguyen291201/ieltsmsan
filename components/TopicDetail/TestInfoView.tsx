import { Box, Grid, Paper, Typography } from '@material-ui/core';
import dynamic from "next/dynamic";
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CommentScopes } from '../../custom-types';
import { AppState } from '../../redux/reducers';
import ChartBar from '../../sub_modules/common/components/chart/ChartBar';
import { EXAM_SCORE_FINISH } from '../../sub_modules/share/constraint';
import Skill from "../../sub_modules/share/model/skill";
import Topic from '../../sub_modules/share/model/topic';
import { InformationCourse } from '../CourseDetail/InformationCourse/information-course';
import ExamTOEICResutls from "./ExamTOEICResults";
import TestOverView from './TestOverview';
import { TopicInfoCommonView } from './TopicWidget';

const CommentPanelNew = dynamic(() => import('../CommentPanelNew'), { ssr: false });

export const StatisticSkillView = (props: { skills: Skill[] }) => {
  const { skills } = props;
  const { studyScore } = useSelector((state: AppState) => state.topicReducer);
  const mapSkillValueCard = studyScore?.studyScoreData?.statistics?.mapSkillValueCard || {};
  const data = useMemo(() => {
    const _skills = skills
      .filter((skill) => typeof mapSkillValueCard[skill.value] !== 'undefined')
      .sort((a, b) => a.name.localeCompare(b.name));
    const labels: string[] = [];
    const dataCorrect: number[] = [];
    const dataIncorrect: number[] = [];
    _skills.forEach((skill) => {
      labels.push(skill.name);
      dataCorrect.push(mapSkillValueCard[skill.value].correctNum);
      dataIncorrect.push(mapSkillValueCard[skill.value].totalCardNum - mapSkillValueCard[skill.value].correctNum);
    })

    return {
      labels, dataCorrect, dataIncorrect
    };
  }, [studyScore, skills]);

  return <div id="statistic-skills-view" style={{ padding: "16px" }}>
    <Box textAlign="center">
      <Typography component="h3">THỐNG KÊ KỸ NĂNG</Typography>
    </Box>

    <ChartBar
      data={{
        labels: data.labels,
        datasets: [
          { label: 'Correct', data: data.dataCorrect, backgroundColor: 'rgb(54, 162, 235)' },
          { label: 'Incorrect', data: data.dataIncorrect, backgroundColor: 'rgb(255, 99, 132)' },
        ]
      }}
      height={undefined}
    />
  </div>
}

const TestInfoView = (props: { topic: Topic; toeicStats?: boolean; skills?: Skill[] }) => {
  const { topic, toeicStats, skills = [] } = props;
  const { studyScore, myCardData } = useSelector((state: AppState) => state.topicReducer);
  const { currentCourse: course } = useSelector((state: AppState) => state.courseReducer);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const isPlayTest = useMemo(() => !!studyScore, [studyScore]);
  const isFinisedTest = useMemo(() => studyScore?.status === EXAM_SCORE_FINISH, [studyScore])

  const renderMainView = useMemo(() => {
    if (isPlayTest) {
      return <>
        {!!toeicStats && isFinisedTest && <ExamTOEICResutls />}
        <TestOverView currentTopic={topic} currentUser={currentUser} studyScore={studyScore} />
      </>
    }
    return <TopicInfoCommonView currentTopic={topic} studyScore={studyScore} />;
  }, [isPlayTest, topic, studyScore])

  return (
    <div className="topic-test-view">
      <Grid container className="thong-ke-">
        <Grid item xs={12} md={8}>
          {renderMainView}
        </Grid>

        <Grid item xs={12} md={4} className="commentPanel_">
          <div><h3 className="title">Thảo luận</h3></div>
          <CommentPanelNew commentScope={CommentScopes.TOPIC} />
        </Grid>
      </Grid>
      <Grid container className="view-panel-score" spacing={2}>
        <Grid item xs={12} md={8} className="view-left">
          {isPlayTest && <TopicInfoCommonView currentTopic={topic} studyScore={studyScore} hidePlayGameButton />}

          {isPlayTest && isFinisedTest && skills.length && <Paper elevation={1} style={{ marginTop: "20px" }}>
            <StatisticSkillView skills={skills} />
          </Paper>}
        </Grid>
        <Grid item xs={12} md={4} className="view-right course-info-topic">
          <InformationCourse course={course} />
        </Grid>
      </Grid>
    </div>
  )
}

export default TestInfoView;
