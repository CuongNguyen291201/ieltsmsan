import { Box, Grid } from '@mui/material';
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import useHeadingsData from "../../hooks/useHeadingsData";
import { AppState } from '../../redux/reducers';
import { EXAM_SCORE_FINISH } from '../../sub_modules/share/constraint';
import Skill from "../../sub_modules/share/model/skill";
import SanitizedDiv from "../SanitizedDiv";
import StatisticSkillView from "./StatisticSkillView";
import TestOverView from './topic-widgets/TestOverview';
import { TopicInfoCommonView } from './topic-widgets/TopicWidget';
import useTopicContentStyles from "./useTopicContentStyles";

const DocumentsListView = dynamic(() => import('./DocumentsListView'), { ssr: false });
const TableOfContents = dynamic(() => import('../TableOfContents'), { ssr: false });

const TestInfoView = (props: { skills?: Skill[] }) => {
  const { skills = [] } = props;
  const { currentTopic: topic, studyScore, myCardData } = useSelector((state: AppState) => state.topicReducer);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const nestedHeadings = useSelector((state: AppState) => state.contentReducer.headings);
  const isPlayTest = useMemo(() => !!studyScore, [studyScore]);
  const isFinisedTest = useMemo(() => studyScore?.status === EXAM_SCORE_FINISH, [studyScore]);
  const isVideoContent = useMemo(() => !!topic.videoUrl, [topic]);
  const resultsGridCol = useMemo(() => studyScore?.status === EXAM_SCORE_FINISH && !!skills.length ? 6 : 12, [studyScore, skills]);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const classes = useTopicContentStyles();
  useHeadingsData({ rootElement: contentRef.current });

  return (
    <div id="test-info-content">
      <Box display="flex" flexDirection={isPlayTest ? "column-reverse" : "column"}>
        {/* CONTENT TEXT */}
        {!!topic.description && <Box component="div" className={classes.boxContent} ref={contentRef}>
          <Box className={classNames(classes.tableOfContent, classes.tableOfContentMobile)}>
            <TableOfContents nestedHeadings={nestedHeadings} stickyClass="no-sticky-table-of-content" />
          </Box>
          <SanitizedDiv content={topic.description} />
          {!isVideoContent && <Box>
            <DocumentsListView />
          </Box>}
        </Box>}

        {/* TEST INFO */}
        <Grid container>
          <Grid item xs={12} md={resultsGridCol}>
            {isPlayTest && <Box className={classes.boxShadowContainer}>
              <TestOverView
                currentTopic={topic}
                currentUser={currentUser}
                studyScore={studyScore}
                gameButtonGroupBoxStyle={{ padding: { xs: "0 8px", xl: "0 60px" } }}
              />
            </Box>}
          </Grid>

          <Grid item xs={12} md={resultsGridCol}>
            {isFinisedTest && !!skills.length && <Box className={classes.boxShadowContainer}>
              <StatisticSkillView skills={skills} />
            </Box>}
          </Grid>

          <Grid item xs={12}>
            <Box className={classNames(classes.boxContent, classes.boxShadowContainer)}>
              <TopicInfoCommonView currentTopic={topic} studyScore={studyScore} hidePlayGameButton={isPlayTest} />
            </Box>
          </Grid>
        </Grid>
        {!isVideoContent && !topic.description && <Box>
          <DocumentsListView />
        </Box>}
      </Box>
    </div>
  );
}

export default TestInfoView;
