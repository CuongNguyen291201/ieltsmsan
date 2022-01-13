import { Box } from "@mui/system";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { useSelector } from 'react-redux';
import useHeadingsData from "../../hooks/useHeadingsData";
import { AppState } from '../../redux/reducers';
import SanitizedDiv from "../SanitizedDiv";
import MyCardDataView from './topic-widgets/MyCardDataView';
import useTopicContentStyles from "./useTopicContentStyles";

const DocumentsListView = dynamic(() => import('./DocumentsListView'), { ssr: false });
const TableOfContents = dynamic(() => import('../TableOfContents'), { ssr: false });
const TopicInfoCommonView = dynamic(() => import('./topic-widgets/TopicInfoCommonView'), { ssr: false });

const ExerciseInfoView = () => {
  const { currentTopic: topic, studyScore, myCardData } = useSelector((state: AppState) => state.topicReducer);
  const { currentCourse: course, isJoinedCourse } = useSelector((state: AppState) => state.courseReducer);
  const { currentUser: user } = useSelector((state: AppState) => state.userReducer);
  const nestedHeadings = useSelector((state: AppState) => state.contentReducer.headings);
  const isVideoContent = useMemo(() => !!topic.videoUrl, [topic]);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const classes = useTopicContentStyles();
  useHeadingsData({ rootElement: contentRef.current });

  return (
    <div id="exercise-info-content">
      <Box>
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

        {/* Excercie INFO */}
        <Box className={classNames(classes.boxContent, classes.boxShadowContainer)} pb="50px !important">
          <MyCardDataView currentTopic={topic} studyScore={studyScore} myCardData={myCardData} user={user}
            sliderBoxStyle={{ padding: { xs: "0 8px", lg: "0 59px", xl: "0 134px" } }}
            cardDataBoxStyle={{ padding: { xs: "8px", lg: "0 59px", xl: "0 134px" } }}
            isJoinedCourse={isJoinedCourse}
            gameButtonGroupBoxStyle={{ padding: { xl: "0 70px" } }}
          />
        </Box>

        <Box className={classNames(classes.boxContent, classes.boxShadowContainer)}>
          <TopicInfoCommonView currentTopic={topic} studyScore={studyScore} hidePlayGameButton />
        </Box>
        {!isVideoContent && !topic.description && <Box>
          <DocumentsListView />
        </Box>}
      </Box>
    </div>
  );
};

export default ExerciseInfoView;