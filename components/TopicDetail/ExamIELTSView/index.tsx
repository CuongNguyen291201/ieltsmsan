import { Grid } from "@material-ui/core";
import dynamic from "next/dynamic";
import { PropsWithoutRef, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { CommentScopes, _Topic } from "../../../custom-types";
import { AppState } from "../../../redux/reducers";
import { UserInfo } from "../../../sub_modules/share/model/user";
import { apiGetIELTSTopicData } from "../../../utils/apis/topicApi";
import { InformationCourse } from "../../CourseDetail/InformationCourse/information-course";
import {
  IELTSFullTestReducer,
  initIELTSFullTestState,
  initIELTSSettingDataAction
} from "./IELTSFullTestView.logic";
import SkillInfoItem from "./SkillInfoItem";
import './style.scss';

const CommentPanel = dynamic(() => import("../../CommentPanelNew"), { ssr: false });

const ExamIELTSView = (props: PropsWithoutRef<{
  topic: _Topic;
}>) => {
  const { topic } = props;
  const { currentCourse: course } = useSelector((state: AppState) => state.courseReducer);
  const currentUser: UserInfo = useSelector((state: AppState) => state.userReducer.currentUser);

  const [state, uiLogic] = useReducer(IELTSFullTestReducer, initIELTSFullTestState);

  useEffect(() => {
    apiGetIELTSTopicData({ topicId: topic._id, userId: currentUser?._id })
      .then((data) => {
        uiLogic(initIELTSSettingDataAction(data));
      })
  }, [currentUser]);

  return (
    <div className="topic-test-view">
      <Grid container className="thong-ke-">
        <Grid item xs={12} md={8}>
          <Grid container spacing={1} className="topic-skill-parts-list" id="topic-ielts-parts">
            {state.listSkillPart
              .filter(({ cardCount }) => cardCount > 0)
              .map(({ skillInfo, studyScoreData }) => (
                <Grid key={skillInfo.skillId} item xs={6} sm={6} md={3} lg={3} className="item-skill-part">
                  <SkillInfoItem
                    skillInfo={skillInfo}
                    studyScore={state.studyScore}
                    studyScoreData={studyScoreData}
                    topic={topic}
                  />
                </Grid>
              ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4} className="commentPanel_">
          <div><h3 className="title">Thảo luận</h3></div>
          <CommentPanel commentScope={CommentScopes.TOPIC} />
        </Grid>
      </Grid>

      <Grid container className="view-panel-score">
        <Grid item xs={12} md={8} className="view-left">

        </Grid>

        <Grid item xs={12} md={4} className="view-right course-info-topic">
          <InformationCourse course={course} />
        </Grid>
      </Grid>
    </div>
  );
}

export default ExamIELTSView;
