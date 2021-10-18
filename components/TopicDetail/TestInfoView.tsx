import { Grid } from '@material-ui/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { CommentScopes } from '../../custom-types';
import { AppState } from '../../redux/reducers';
import ChartBar from '../../sub_modules/common/components/chart/ChartBar';
import { getExamScoreDetails, getSkills } from '../../sub_modules/game/api/ExamApi';
import { EXAM_SCORE_FINISH, STUDY_SCORE_DETAIL_CORRECT, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import { Course } from '../../sub_modules/share/model/courses';
import Skill from '../../sub_modules/share/model/skill';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import Topic from '../../sub_modules/share/model/topic';
import { UserInfo } from '../../sub_modules/share/model/user';
import CommentPanel from '../CommentPanel';
import { InfoCourse } from '../CourseDetail/InfoCourse';
import { InformationCourse } from '../CourseDetail/InformationCourse/information-course';
import NoTestView from './NoTestView';
import StudyScoreView from './StudyScoreView';
import { MyCardDataView, StatisticSkillSkeleton, TopicInfoCommonView } from './TopicWidget';

export const StatisticSkillView = (props: { currentTopic: Topic; studyScore?: StudyScore | null, currentUser: UserInfo }) => {
  const { currentTopic, currentUser, studyScore } = props;
  const [statisticSkill, setStatisticSkill] = useState([]);
  useEffect(() => {
    const statFC = async () => {
      const examScoreDetails: any[] = await getExamScoreDetails({
        userId: currentUser._id,
        studyScoreDataId: studyScore.studyScoreData._id
      });
      const mapSkillExamScoreDetail = examScoreDetails.reduce((map, e) => {
        if (e.cardType > 0) {
          map[e.cardType] = [...map[e.cardType] || [], e];
        }
        return map;
      }, {});

      const skillRes = await getSkills();
      const mapSkill = {};
      if (!skillRes.data.length) return;
      (skillRes.data).map((e) => {
        mapSkill[e.value] = e;
        if (e.childSkills) {
          (e.childSkills).map((ce) => {
            mapSkill[ce.value] = ce;
          })
        }
      });

      const statisticSkillData: any[] = [];
      Object.keys(mapSkillExamScoreDetail).map((key) => {
        if (mapSkill[key]) {
          let totalCorrect = 0;
          let totalInCorrect = 0;
          (mapSkillExamScoreDetail[key] as any[]).map((e) => {
            e.correct === STUDY_SCORE_DETAIL_CORRECT ? totalCorrect++ : totalInCorrect++;
          });
          statisticSkillData.push({
            skillValue: key,
            name: mapSkill[key].name,
            totalCorrect,
            totalInCorrect
          });
        }
      });

      setStatisticSkill(statisticSkillData.sort((a, b) => a.skillValue - b.skillValue))
    }

    statFC();
  }, [])

  const genData = useCallback((statisticSkill: any[]) => {
    const labels = [];
    const dataCorrect = [];
    const dataInCorrect = [];
    statisticSkill.map((e) => {
      labels.push(e.name);
      dataCorrect.push(e.totalCorrect);
      dataInCorrect.push(e.totalInCorrect);
    });
    return {
      labels,
      datasets: [
        {
          label: 'Câu đúng',
          data: dataCorrect,
          backgroundColor: 'rgb(54, 162, 235)'
        },
        {
          label: 'Câu sai',
          data: dataInCorrect,
          backgroundColor: 'rgb(255, 99, 132)'
        }
      ]
    }
  }, [statisticSkill]);

  return (
    <>
      {
        statisticSkill
          ? (statisticSkill.length ? <div className="section4"><ChartBar data={genData(statisticSkill)} height={undefined} /></div> : <></>)
          : <StatisticSkillSkeleton />
      }
    </>
  )
}

const SkeletonScoreView = () => {
  return (
    <div className="section2">
      <div className="section2-left">
        <div className="date-time">
          <div className="date skeleton">
            <span><Skeleton /></span>
          </div>
          <div className="time skeleton">
            <span><Skeleton /></span>
          </div>
        </div>
        <div className="score-wrap">
          <div className="score-number skeleton"><Skeleton /></div>
          <div className="score-text skeleton"><Skeleton /></div>
        </div>
        <div className="buttons">
          <div className="xem-lai skeleton">
            <Skeleton />
          </div>
        </div>
      </div>
      <div className="section2-right">
        <div className="title"><Skeleton ></Skeleton></div>
        <div className="image skeleton"><Skeleton /></div>
        <div className="text skeleton"><Skeleton /></div>
      </div>
    </div>

  )
}

const TestInfoView = (props: { topic: any }) => {
  const { topic } = props;
  const { studyScore, myCardData } = useSelector((state: AppState) => state.topicReducer);
  const { currentCourse: course } = useSelector((state: AppState) => state.courseReducer);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const isFinishedExam = useMemo(() => studyScore?.status === EXAM_SCORE_FINISH, [studyScore]);
  return (
    <div className="topic-test-view">
      <div className="thong-ke-">
        <Grid md={isFinishedExam ? 8 : 12}>
          {
            isFinishedExam
              ?
              <>
                <MyCardDataView currentTopic={topic} studyScore={studyScore} myCardData={myCardData} />
                <Grid className="commentPanel_" md={4}>
                  <CommentPanel commentScope={CommentScopes.TOPIC} />
                </Grid>
              </>
              : <TopicInfoCommonView currentTopic={topic} studyScore={studyScore} hideCourseInfo />
          }
        </Grid>
      </div>
      <div className="view-panel-score">
        <Grid md={8} className="view-left">
          <>
            {
              isFinishedExam && <TopicInfoCommonView currentTopic={topic} studyScore={studyScore} hideCourseInfo />
            }
            {/* {
              studyScore?.status === EXAM_SCORE_FINISH
                ? <div className="viewStudycore">
                  <Grid>
                    <StudyScoreView currentTopic={topic} studyScore={studyScore} currentUser={currentUser} />
                  </Grid>
                </div>
                : <NoTestView currentTopic={topic} currentUser={currentUser} studyScore={studyScore} />
            }

            {
              studyScore?.status === EXAM_SCORE_FINISH && topic.type === TOPIC_TYPE_TEST && <StatisticSkillView currentTopic={topic} studyScore={studyScore} currentUser={currentUser} />
            } */}
          </>
        </Grid>
        <Grid md={4} className="view-right">
          <InformationCourse course={course} />
        </Grid>
      </div>
    </div>
  )
}

export default TestInfoView;
