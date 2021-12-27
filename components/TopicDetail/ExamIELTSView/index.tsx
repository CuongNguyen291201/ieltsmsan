import { Box, Button, Grid } from "@mui/material";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { PropsWithoutRef, useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { CommentScopes, _Topic } from "../../../custom-types";
import { AppState } from "../../../redux/reducers";
import { UserInfo } from "../../../sub_modules/share/model/user";
import { apiGetIELTSTopicData } from "../../../utils/apis/topicApi";
import { InformationCourse } from "../../CourseDetail/InformationCourse/information-course";
import useTopicContentStyles from "../useTopicContentStyles";
import {
  IELTSFullTestReducer,
  initIELTSFullTestState,
  initIELTSSettingDataAction
} from "./IELTSFullTestView.logic";
import SkillInfoItem from "./SkillInfoItem";
import './style.scss';

const CommentPanel = dynamic(() => import("../../CommentPanelNew"), { ssr: false });

const ExamIELTSView = () => {
  const topic = useSelector((state: AppState) => state.topicReducer.currentTopic);
  const { currentCourse: course } = useSelector((state: AppState) => state.courseReducer);
  const currentUser: UserInfo = useSelector((state: AppState) => state.userReducer.currentUser);

  const [state, uiLogic] = useReducer(IELTSFullTestReducer, initIELTSFullTestState);
  const classes = useTopicContentStyles();
  const [showComment, setShowComment] = useState(true);


  useEffect(() => {
    apiGetIELTSTopicData({ topicId: topic._id, userId: currentUser?._id })
      .then((data) => {
        uiLogic(initIELTSSettingDataAction(data));
      })
  }, [currentUser]);

  return (
    <div id="ielts-test-view" className={classes.mainView}>
      <Grid container className={classes.mainGrid}>
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
          <Grid container columnSpacing={3}>
            <Grid item xs={12}>
              <Box>
                <Box className={classNames(classes.boxContent, classes.commentShadow, classes.commentPanel)} sx={{
                  overflow: showComment ? "auto" : "hidden", display: showComment ? undefined : "none"
                }}>
                  <CommentPanel commentScope={CommentScopes.TOPIC} />
                </Box>
                <Box width="100%" mt={showComment ? 0 : { xs: "8px", md: "16px" }}>
                  <Button sx={{ width: "100%" }}
                    variant="outlined"
                    onClick={() => setShowComment(!showComment)}>
                    {showComment ? 'Ẩn bình luận' : 'Hiển thị bình luận'}
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box mt="30px">
                <InformationCourse course={course} />
              </Box>
            </Grid>

          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default ExamIELTSView;
