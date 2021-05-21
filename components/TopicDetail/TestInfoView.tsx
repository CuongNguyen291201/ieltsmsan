import { useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/reducers';
import ChartBar from '../../sub_modules/common/components/chart/ChartBar';
import { getExamScoreDetails, getSkills } from '../../sub_modules/game/api/ExamApi';
import { EXAM_SCORE_FINISH, STUDY_SCORE_DETAIL_CORRECT, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import Skill from '../../sub_modules/share/model/skill';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import Topic from '../../sub_modules/share/model/topic';
import { UserInfo } from '../../sub_modules/share/model/user';
import NoTestView from './NoTestView';
import StudyScoreView from './StudyScoreView';
import { MyCardDataView, StatisticSkillSkeleton, TopicInfoCommonView } from './TopicWidget';

const StatisticSkillView = (props: { currentTopic: Topic; studyScore?: StudyScore | null, currentUser: UserInfo }) => {
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
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  return (
    <div className="topic-test-view">
      <TopicInfoCommonView currentTopic={topic} studyScore={studyScore} />
      <>
        {
          studyScore?.status === EXAM_SCORE_FINISH
            ? <StudyScoreView currentTopic={topic} studyScore={studyScore} currentUser={currentUser} />
            : <NoTestView currentTopic={topic} currentUser={currentUser} studyScore={studyScore} />
        }
        <MyCardDataView currentTopic={topic} studyScore={studyScore} myCardData={myCardData} />
        {
          studyScore?.status === EXAM_SCORE_FINISH && topic.type === TOPIC_TYPE_TEST && <StatisticSkillView currentTopic={topic} studyScore={studyScore} currentUser={currentUser} />
        }
      </>
    </div>
  )
}

export default TestInfoView;
