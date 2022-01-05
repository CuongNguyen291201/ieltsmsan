import { Box, Grid } from "@mui/material";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useReducer, useRef } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/reducers";
import { UserInfo } from "../../../sub_modules/share/model/user";
import { apiGetIELTSTopicData } from "../../../utils/apis/topicApi";
import SanitizedDiv from "../../SanitizedDiv";
import useTopicContentStyles from "../useTopicContentStyles";
import {
  IELTSFullTestReducer,
  initIELTSFullTestState,
  initIELTSSettingDataAction
} from "./IELTSFullTestView.logic";
import SkillInfoItem from "./SkillInfoItem";
import './style.scss';

const DocumentsListView = dynamic(() => import('../DocumentsListView'), { ssr: false });
const TableOfContents = dynamic(() => import('../../TableOfContents'), { ssr: false });

const ExamIELTSView = () => {
  const topic = useSelector((state: AppState) => state.topicReducer.currentTopic);
  const currentUser: UserInfo = useSelector((state: AppState) => state.userReducer.currentUser);
  const nestedHeadings = useSelector((state: AppState) => state.contentReducer.headings);
  const isVideoContent = useMemo(() => !!topic.videoUrl, [topic]);

  const [state, uiLogic] = useReducer(IELTSFullTestReducer, initIELTSFullTestState);
  
  const contentRef = useRef<HTMLDivElement | null>(null);
  const classes = useTopicContentStyles();

  useEffect(() => {
    apiGetIELTSTopicData({ topicId: topic._id, userId: currentUser?._id })
      .then((data) => {
        uiLogic(initIELTSSettingDataAction(data));
      })
  }, [currentUser]);

  return (
    <div id="ielts-test-view">
      <Box>
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
        {/* CONTENT TEXT */}
        {!!topic.description && <Box component="div" className={classes.boxContent} ref={contentRef}>
          <Box className={classNames(classes.tableOfContent, classes.tableOfContentMobile)}>
            <TableOfContents nestedHeadings={nestedHeadings} stickyClass="no-sticky-table-of-content" />
          </Box>
          <SanitizedDiv content={topic.description} />
        </Box>}
        {!isVideoContent && <Box>
          <DocumentsListView />
        </Box>}
      </Box>
    </div>
  );
}

export default ExamIELTSView;
